let Task = require('task');
let utils = require('constant.utilities');

const name = 'upgrader';

let get = new Task('getEnergy', 'getEnergy', {useContainer: true, useSource:true})
  .while(c => c.carry.energy < c.carryCapacity);

let upgrade = new Task('upgrade', 'upgrade')
  .while(c => c.carry.energy > 0);

module.exports = {
  name: name,
  body: body,
  tasks: [get, upgrade],
  options: options,
  spawn: spawn
};

function body(budget) {
  let body = [WORK, MOVE, CARRY];
  
  while(utils.cost(body)+ BODYPART_COST[CARRY] + BODYPART_COST[MOVE] + BODYPART_COST[WORK] <= budget){
    body.push(CARRY);
    body.push(MOVE);
    body.push(WORK);
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
  return count < 2;
}