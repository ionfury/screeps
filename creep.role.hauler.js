let Task = require('task');
let utils = require('constant.utilities');

const name = 'hauler';

let get = new Task('getEnergy', {useContainer: true, useSource:false})
  .when(s => s.carry.energy < s.carryCapacity)
  .until(s => s.carry.energy == s.carryCapacity);

let store = new Task('storeEnergy', {structureTypes: [STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_TOWER]})
  .when((s) => s.carry.energy == s.carryCapacity)
  .until((s) => s.carry.energy == 0);

module.exports = {
  name: name,
  body: body,
  tasks: [get, store],
  options: options,
  spawn: spawn
};

function body(budget) {
  let body = [MOVE, CARRY];
  
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
  return count < room.find(FIND_SOURCES).length * 2;
}