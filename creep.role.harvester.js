let Task = require('task');
let utils = require('constant.utilities');

const name = 'harvester';

function creepEnergyAtCapacity(creep) {
  return creep.carry.energy == creep.carrycapacity;
}


let get = new Task('getEnergy', 'getEnergy', {useContainer: false, useSource: true})
  .while(c => c.carry.energy < c.carryCapacity);
  
let fill = new Task('storeEnergy', 'storeEnergy', {structureTypes: [STRUCTURE_CONTAINER, STRUCTURE_SPAWN]})
  .while(c => c.carry.energy > 0);

module.exports = {
  name: name,
  body: body,
  tasks: [get, fill],
  options: options,
  spawn: spawn
};

function body(budget) {
  let body = [CARRY, MOVE, WORK];

  while(utils.cost(body)+ BODYPART_COST[WORK] <= budget){
    body.push(WORK);
  }

  return body;
}

function options(options){
  return { memory: 
    { 
      role: name, 
      spawnId: options.spawnId
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