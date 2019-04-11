let Task = require('creep.task');
let utils = require('constant.utilities');
let Designer = require('constant.creepDesigner');

const name = 'upgrader';

let get = new Task(1, 'getEnergy', {useContainer: true, useSource:true})
  .while(c => c.carry.energy < c.carryCapacity);

let upgrade = new Task(2, 'upgrade')
  .while(c => c.carry.energy > 0);

module.exports = {
  name: name,
  body: body,
  tasks: [get, upgrade],
  options: options,
  spawn: spawn
};

function body(budget) {
  return Designer.design(
    {move:1,carry:1,work:2},
    {move:5,carry:5,work:5},
    budget
  );
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
  return count < 1;
}