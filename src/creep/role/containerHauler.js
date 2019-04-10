let Task = require('task');
let Designer = require('constant.creepDesigner');
const CREEP_ROLE = 'containerHauler';

// Constructed memory locations
const SOURCE_ROOM_NAME_ADDR = 'sourceRoom';
const HOME_ROOM_NAME_ADDR = 'homeRoom';
// Dynamic memory locations
const CONTAINER_ID_MEM_ADDR = 'containerId';

const STORAGE_TYPES = [STRUCTURE_STORAGE, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER]
const OBJ = (id) => Game.getObjectById(id);

let go = new Task(10, 'goToRoom', {destination: SOURCE_ROOM_NAME_ADDR })
  .while(c => c.carry.energy == 0 && c.room.name != c.memory[SOURCE_ROOM_NAME_ADDR]);

let transfer = new Task(20, 'getEnergy', {container:CONTAINER_ID_MEM_ADDR,useContainer:true,useSource:false})
  .while(c => c.carry.energy < c.carryCapacity
    && c.room.name == c.memory[SOURCE_ROOM_NAME_ADDR]);

const maintainStructureTypes = [STRUCTURE_ROAD];
let repair = new Task(25, 'repair', {types: maintainStructureTypes})
  .when(s => s.carry.energy > 0 
    && s.room.find(FIND_STRUCTURES, { 
      filter: o => _.includes(maintainStructureTypes, o.structureType) 
      && (o.hits < o.hitsMax / 3)
    }).length > 0
    && s.room.name != s.memory[HOME_ROOM_NAME_ADDR])
  .until(s => s.carry.energy == 0
    || s.room.find(FIND_STRUCTURES, {
      filter: o => 
        _.includes(maintainStructureTypes, o.structureType) 
        && (o.hits < o.hitsMax / 2)
      }).length == 0
    );

const roadFilter = s => s.structureType == STRUCTURE_ROAD;
let build = new Task(28, 'build', {buildFilter: roadFilter})
  .while(c => c.carry.energy > 0
    && c.room.find(FIND_CONSTRUCTION_SITES, {
      filter: roadFilter
    }).length > 0
    && c.room.name != c.memory[HOME_ROOM_NAME_ADDR]);

let goHome = new Task(30, 'goToRoom', {destination: HOME_ROOM_NAME_ADDR })
  .while(c => c.carry.energy == c.carryCapacity
    && c.room.name != c.memory[HOME_ROOM_NAME_ADDR]);

let store = new Task(40, 'storeEnergy', {structureTypes: STORAGE_TYPES})
  .while(c => c.carry.energy > 0
    && c.room.name == c.memory[HOME_ROOM_NAME_ADDR]);

function remember(options) {
  let spawn = OBJ(options.spawnId);
  let unboundContainer = getUnboundContainerNear(spawn);

  let opts = {memory : {
    role: CREEP_ROLE,
    spawnId: options.spawnId
  }}

  opts.memory[HOME_ROOM_NAME_ADDR] = spawn.room.name;
  opts.memory[SOURCE_ROOM_NAME_ADDR] = unboundContainer.pos.roomName || 'err';
  opts.memory[CONTAINER_ID_MEM_ADDR] = unboundContainer.id;

  return opts;
}

function spawn(options) {
  let spawn = OBJ(options.spawnId);
  let unboundContainer = getUnboundContainerNear(spawn);
  return unboundContainer != undefined;
}

function body(budget, spawn) {
  let myBody;

  let container = getUnboundContainerNear(spawn);
  
  if(container.room.name == spawn.room.name) {
    myBody = {move:3,carry:5,work:1}
  }
  else
  {
    myBody = {move:6,carry:11,work:1}
  }

  return Designer.design(
    {move:2,carry:2,work:1},
    myBody,
    budget
  )
}

module.exports = {
  name: CREEP_ROLE,
  body: body,
  tasks: [go, transfer, repair, build, goHome, store],
  options: remember,
  spawn: spawn
}

// misc
function getUnboundContainerNear(spawn) {
  let roomNames = adjRoomNames(spawn.room);

  for(let i = 0; i < roomNames.length; i++) {
    let roomName = roomNames[i];
    let room = Game.rooms[roomName];
    // don't succ from my own rooms
    if(room == undefined || (i > 0 && room.controller.my)) continue;
    if(room) {
      let x = room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_CONTAINER
          && nobodyOn(s.id, (i>0))
      });

      if(x && x.length > 0)
        return x[0];
    }
  }
}

function nobodyOn(containerId, remote) {
  let max = 1;//remote ? 2 : 1;
  let on = _.filter(Game.creeps, c => 
    c.memory.role == CREEP_ROLE
    && c.memory[CONTAINER_ID_MEM_ADDR] == containerId);
  
  return on.length < max;
}


function adjRoomNames(room) {
  let exits = Game.map.describeExits(room.name);
  let names = [room.name];
  if(!exits) return names;

  _.forEach(['1', '3', '5', '7'], i => {
    if(exits[i] != undefined)
      names.push(exits[i]);
  });

  return names;
}