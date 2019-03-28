let Task = require('task');
let utils = require ('constant.utilities');

const name = 'builder';

let get = new Task(1,'getEnergy', {useContainer: true, useSource: true})
  .while(c => c.carry.energy < c.carryCapacity);
  
let build = new Task(2, 'build')
  .when(s => s.carry.energy == s.carryCapacity && s.room.find(FIND_CONSTRUCTION_SITES).length > 0)
  .until(s => s.carry.energy == 0 || s.room.find(FIND_CONSTRUCTION_SITES).length == 0)

let repair = new Task(3, 'repair', {types: [STRUCTURE_ROAD]})
  .when(s => s.carry.energy == s.carryCapacity && s.room.find(FIND_STRUCTURES, { filter: o => o.structureType === STRUCTURE_ROAD && (o.hits < o.hitsMax / 3)}))
  .until(s => s.carry.energy == 0 || !s.room.find(FIND_STRUCTURES, { filter: o => o.structureType === STRUCTURE_ROAD && (o.hits < o.hitsMax / 3)}));

let upgrade = new Task(4, 'upgrade')
  .when(s => s.carry.energy == s.carryCapacity && !s.room.find(FIND_CONSTRUCTION_SITES))
  .until(s => s.carry.energy == 0);

module.exports = {
  name: name,
  body: body,
  tasks: [get, build, repair, upgrade],
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
      spawnId: options.spawnId,
      working: false
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