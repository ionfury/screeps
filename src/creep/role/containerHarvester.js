let Task = require('task');
let Designer = require('constant.creepDesigner');
let roomMemory = require('constant.staticRoomMemory');

// My role
const CREEP_ROLE = 'containerHarvester';

// Constructed memory locations
const SOURCE_ROOM_NAME_ADDR = 'sourceRoom';
const SOURCE_ID_MEM_ADDR = 'sourceId';
const X_ADDR = 'sourceX';
const Y_ADDR = 'sourceY';

// Dynamic memory locations
const CONTAINER_ID_MEM_ADDR = 'containerId';
const CONTAINER_CONST_ID_MEM_ADDR = 'constId';

// Constants
const BIND_STRUCTURE_TYPES = [STRUCTURE_CONTAINER, STRUCTURE_LINK];
const BIND_CONTAINER_CONSTRUCTION_EXPR = (c) => {
  let x = c.pos.findInRange(FIND_CONSTRUCTION_SITES, 2, {
    filter: s => _.includes(BIND_STRUCTURE_TYPES, s.structureType)
  })[0];
  if(!x) return undefined;
  else return x.id;
}
const BIND_CONTAINER_EXPR = (c) => {
  let x = c.pos.findInRange(FIND_STRUCTURES, 2, {
    filter: s => _.includes(BIND_STRUCTURE_TYPES, s.structureType)    
  })[0];
  if(!x) return undefined;
  else return x.id;
}
const OBJ = (id) => Game.getObjectById(id);
  
// Task definitions
let go = new Task(10, 'goToRoom', {destination: SOURCE_ROOM_NAME_ADDR,x:X_ADDR, y:Y_ADDR})
  .while(s => s.room.name != s.memory[SOURCE_ROOM_NAME_ADDR]);

let harvest = new Task(20, 'getEnergy', {source: SOURCE_ID_MEM_ADDR, useContainer: false, useSource: true})
  .while(c => c.carry.energy < c.carryCapacity);

let build = new Task(30, 'build', {buildId: CONTAINER_CONST_ID_MEM_ADDR})
  .while(c => 
    c.memory[CONTAINER_CONST_ID_MEM_ADDR] != undefined
    && c.carry.energy > 0);

let repair = new Task(40, 'repair', {repairId: CONTAINER_ID_MEM_ADDR})
  .when(c =>
    c.memory[CONTAINER_ID_MEM_ADDR] != undefined
    && c.carry.energy > 0
    && OBJ(c.memory[CONTAINER_ID_MEM_ADDR]).hits < OBJ(c.memory[CONTAINER_ID_MEM_ADDR]).hitsMax)
  .until(c =>
    c.carry.energy == 0
    || OBJ(c.memory[CONTAINER_ID_MEM_ADDR]).hits == OBJ(c.memory[CONTAINER_ID_MEM_ADDR]).hitsMax);

let store = new Task(50, 'storeEnergy', {containerId: CONTAINER_ID_MEM_ADDR})
  .while(c => 
    c.memory[CONTAINER_ID_MEM_ADDR] != undefined 
    && c.carry.energy > 0)
 
let bindConstruction = new Task(60, 'bindMemory', {
    addr: CONTAINER_CONST_ID_MEM_ADDR,
    expr: BIND_CONTAINER_CONSTRUCTION_EXPR
  })
  .while(c => c.memory[CONTAINER_ID_MEM_ADDR] == undefined
    && c.memory[CONTAINER_CONST_ID_MEM_ADDR] == undefined
    && BIND_CONTAINER_CONSTRUCTION_EXPR(c));

let bindContainer = new Task(70, 'bindMemory', { 
    addr: CONTAINER_ID_MEM_ADDR, 
    expr: BIND_CONTAINER_EXPR
  })
  .while(c => c.memory[CONTAINER_ID_MEM_ADDR] == undefined
    && c.memory[CONTAINER_CONST_ID_MEM_ADDR] == undefined
    && BIND_CONTAINER_EXPR(c));

function remember(options) {
  let spawn = OBJ(options.spawnId);
  let unboundSource = getUnboundSourceNear(spawn);
  
  let opts = { memory: {
    role: CREEP_ROLE,
    spawnId: options.spawnId
  }}
  
  opts.memory[SOURCE_ID_MEM_ADDR] = unboundSource.id;
  opts.memory[SOURCE_ROOM_NAME_ADDR] = unboundSource.pos.roomName || 'err'
  opts.memory[X_ADDR] = unboundSource.pos.x;
  opts.memory[Y_ADDR] = unboundSource.pos.y;

  return opts;
}

function spawn(options) {
  let spawn = OBJ(options.spawnId);
  let unboundSource = getUnboundSourceNear(spawn);
  return unboundSource != undefined;
}

function body(budget) {
  return Designer.design(
    {move:1,carry:1,work:2},
    {move:1,carry:1,work:6},
    budget
  );
}

module.exports = {
  name: CREEP_ROLE,
  body: body,
  tasks: [go, harvest, build, repair, store, bindConstruction, bindContainer],
  options: remember,
  spawn: spawn
}

// Misc functions
function getUnboundSourceNear(spawn) {
  let roomNames = adjRoomNames(spawn.room);

  for(let i = 0; i < roomNames.length; i++) {
    let roomName = roomNames[i];
    let staticData = roomMemory.get(roomName);
    // someone owns the room, and it's not the home room.
    if(staticData == undefined || staticData.owner != undefined && i > 0) continue;
    
    for(let j = 0; j < staticData.sources.length; j++) {
      let sourceData = staticData.sources[j];

      if(nobodyOn(sourceData.id)){
        return sourceData;
      }
    }
  }
}

function nobodyOn(sourceId) {
  let on = _.filter(Game.creeps, c => 
    c.memory.role == CREEP_ROLE 
    && c.memory[SOURCE_ID_MEM_ADDR] == sourceId);
  return on.length == 0;
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