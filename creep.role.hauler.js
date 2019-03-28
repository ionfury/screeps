let Task = require('task');
let utils = require('constant.utilities');

const name = 'hauler';

let salvage = new Task(1, 'salvage', {})
  .while(c => c.carry.energy < c.carryCapacity 
    && c.room.find(FIND_DROPPED_RESOURCES).length > 0);

let get = new Task(2, 'getEnergy', {useContainer: true, useSource:false})
  .when(s => s.carry.energy < s.carryCapacity
    && s.room.find(FIND_DROPPED_RESOURCES).length == 0)
  .until(s => s.carry.energy == s.carryCapacity);

let store = new Task(3, 'storeEnergy', {structureTypes: [STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_TOWER]})
  .while(c => c.carry.energy > 0 && c.room.energyAvailable < c.room.energyCapacityAvailable);

let upgrade = new Task(2, 'upgrade')
  .while(c => c.carry.energy > 0 && c.room.energyAvailable == c.room.energyCapacityAvailable);

module.exports = {
  name: name,
  body: body,
  tasks: [salvage, get, store, upgrade],
  options: options,
  spawn: spawn
};

function body(budget) {
  let body = [WORK, MOVE, CARRY];
  
  while(utils.cost(body)+ BODYPART_COST[CARRY] + BODYPART_COST[MOVE] <= budget){
    body.push(CARRY);
    body.push(MOVE);
  }

  return body;
}

function options(options){
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