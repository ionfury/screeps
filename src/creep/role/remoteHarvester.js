let Task = require('task');
let utils = require('constant.utilities');
let Designer = require('constant.creepDesigner');

const name = 'remoteHarvester';
const countPerSpawnAdjSrc = 4;

let go = new Task(1, 'goToRoom', {destination: 'target'})
  .when(s=> s.carry.energy < s.carryCapacity && s.room.name == s.memory['home'])
  .until(s=> s.room.name == s.memory['target']);

let harvest = new Task(2, 'getEnergy', {useContainer: false, useSource: true})
  .when(s=> s.carry.energy < s.carryCapacity && s.room.name == s.memory['target'])
  .until(s=> s.carry.energy == s.carryCapacity);

let build = new Task(5, 'build')
  .when(s => s.carry.energy == s.carryCapacity 
    && s.room.find(FIND_CONSTRUCTION_SITES).length > 0
    && s.room.name == s.memory['target'])
  .until(s => s.carry.energy == 0 
    || s.room.find(FIND_CONSTRUCTION_SITES).length == 0)

let ret = new Task(3, 'goToRoom', {destination: 'home'})
  .when(s=> s.carry.energy == s.carryCapacity && s.room.name != s.memory['home'])
  .until(s=> s.room.name == s.memory['home']);

let store = new Task(4, 'storeEnergy', {structureTypes: [STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_TOWER,STRUCTURE_CONTAINER]})
  .when(s=> s.carry.energy == s.carryCapacity && s.room.name == s.memory['home'])
  .until(s=> s.carry.energy ==0);


module.exports = {
  name: name,
  body: body,
  tasks: [go, harvest, build, ret, store],
  options: memory,
  spawn: spawn
};

function body(budget) {
  return Designer.design(
    {move:1,carry:1,work:1},
    {move:3,carry:3,work:3},
    budget
  );
}


function memory(options) {
  let spawnId = options.spawnId;
  let spawn = Game.getObjectById(spawnId);
  let room = spawn.room;

  return { memory: 
  {
    role: name,
    spawnId: spawnId,
    home: room.name,
    target: getHarvestableAdjacentRoom(spawn)
  }};
}

function spawn(options) {
  let spawnId = options.spawnId;
  let spawn = Game.getObjectById(spawnId);
  return getHarvestableAdjacentRoom(spawn);
}

function getHarvestableAdjacentRoom(spawn) {
  let room = spawn.room;
  let adjNames = adjRoomNames(room);

  for(let i = 0; i < adjNames.length; i++) {
    let name = adjNames[i];
    if(roomHasSources(name)) {
      if(roomHarvestable(name, spawn.id)) {
        return name;
      }
    }
  }

  return false;
}

function roomHarvestable(roomName, spawnId) {
  if(Game.rooms[roomName] != undefined 
    && Game.rooms[roomName].controller != undefined
    && Game.rooms[roomName].controller.my) return false;
  
  let harvesters = _.filter(Game.creeps, c => {
    return (
      c.memory.role === name
      && c.memory.spawnId === spawnId
    )
  });

  return harvesters.length < countPerSpawnAdjSrc;
}

function roomHasSources(name) {
  if(Memory.explore.sources[name]) {
    if(Memory.explore.sources[name].length > 0) {
      return true;
    }
  }
  return false;
}



function adjRoomNames(room) {
  let exits = Game.map.describeExits(room.name);

  let names = [];

  _.forEach(['1', '3', '5', '7'], i => {
    if(exits[i] != undefined)
      names.push(exits[i]);
  });


  return names;
}
