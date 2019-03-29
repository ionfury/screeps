let Task = require('task');
let Designer = require('constant.creepDesigner');
let utils = require('constant.utilities');

const name = 'harvester';

let get = new Task(1, 'getEnergy', {useContainer: false, useSource: true, source: 'source'})
  .while(c => c.carry.energy < c.carryCapacity);
  
let fill = new Task(2, 'storeEnergy', {structureTypes: [STRUCTURE_CONTAINER, STRUCTURE_SPAWN]})
  .while(c => c.carry.energy > 0);

module.exports = {
  name: name,
  body: body,
  tasks: [get, fill],
  options: memory,
  spawn: spawn
};

function body(budget) {
  return Designer.design(
    {move:1,carry:1,work:2},
    {move:1,carry:1,work:7},
    budget
  );
}

function memory(options){
  let spawn = Game.getObjectById(options.spawnId);
  let room = spawn.room;

  let sources = room.find(FIND_SOURCES).map(s => s.id);

  let roomHarvesters = _.filter(room.find(FIND_MY_CREEPS), c => c.memory.role == name);

  let claimedSources = roomHarvesters.map(c => c.memory.source);
  
  let source = _.difference(sources, claimedSources)[0];

  return { memory: 
    { 
      role: name, 
      spawnId: options.spawnId,
      source: source
    }};
};

function spawn(options){
  let spawn = Game.getObjectById(options.spawnId);
  let room = spawn.room;
  let creeps = room.find(FIND_MY_CREEPS);
  let creepsInRoom = creeps
    .map(c => c.memory.role)
    .reduce((acc, role) => (acc[role] = (acc[role] || 0) + 1, acc), {});
  let harvesterCount = creepsInRoom[name] || 0;
  return harvesterCount < room.find(FIND_SOURCES).length;
}