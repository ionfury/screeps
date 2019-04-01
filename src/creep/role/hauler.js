let Task = require('task');
let Designer = require('constant.creepDesigner');

const name = 'hauler';

let salvage = new Task(1, 'salvage', {})
  .while(c => c.carry.energy < c.carryCapacity 
    && c.room.find(FIND_DROPPED_RESOURCES).length > 0);

let get = new Task(2, 'getEnergy', {useContainer: true, useSource:false, structureTypes: [STRUCTURE_CONTAINER]})
  .when(s => s.carry.energy < s.carryCapacity
    && s.room.find(FIND_DROPPED_RESOURCES).length == 0
    )
  .until(s => s.carry.energy == s.carryCapacity);

let storeSpawn = new Task(3, 'storeEnergy', {structureTypes: [STRUCTURE_SPAWN,STRUCTURE_EXTENSION]})
  .while(c => c.carry.energy > 0 && c.room.energyAvailable < c.room.energyCapacityAvailable);

let storeContainer = new Task(5, 'storeEnergy', {structureTypes: [STRUCTURE_TOWER,STRUCTURE_STORAGE]})
  .while(c => c.carry.energy > 0 && c.room.energyAvailable == c.room.energyCapacityAvailable);

module.exports = {
  name: name,
  body: body,
  tasks: [salvage, get, storeSpawn, storeContainer],
  options: memory,
  spawn: spawn
};

function body(budget) {
  return Designer.design(
    {move:1,carry:1,work:1},
    {move:5,carry:5,work:1},
    budget
  );
}

function memory(options){
  //let spawn = Game.getObjectById(options.spawnId);
  
  return { 
    memory: {
      role: name,
      spawnId: options.spawnId
    }
  };
}
function spawn(options){
  let spawn = Game.getObjectById(options.spawnId);
  let room = spawn.room;
  let creeps = room.find(FIND_MY_CREEPS);
  let creepsInRoom = creeps
    .map(c => c.memory.role)
    .reduce((acc, role) => (acc[role] = (acc[role] || 0) + 1, acc), {});
  let count = creepsInRoom[name] || 0;
  let containers = room.find(FIND_STRUCTURES, {
    filter: o=>o.structureType==STRUCTURE_CONTAINER
  }).length;
  return count < containers;
}