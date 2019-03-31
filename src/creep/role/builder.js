let Task = require('task');
let utils = require ('constant.utilities');
let Designer = require('constant.creepDesigner');

const name = 'builder';

let get = new Task(1,'getEnergy', {useContainer: true, useSource: true})
  .while(c => c.carry.energy < c.carryCapacity);
  
let build = new Task(2, 'build')
  .when(s => s.carry.energy == s.carryCapacity && s.room.find(FIND_CONSTRUCTION_SITES).length > 0)
  .until(s => s.carry.energy == 0 || s.room.find(FIND_CONSTRUCTION_SITES).length == 0)

const repairStructureTypes = [STRUCTURE_ROAD, STRUCTURE_TOWER, STRUCTURE_CONTAINER];
let repair = new Task(3, 'repair', {types: repairStructureTypes})
  .while(s => s.carry.energy > 0 
    && s.room.find(FIND_STRUCTURES, { 
      filter: o => _.includes(repairStructureTypes, o.structureType) 
      && (o.hits < o.hitsMax / 3)
    }).length > 0);

let upgrade = new Task(4, 'upgrade')
  .when(s => s.carry.energy == s.carryCapacity && s.room.find(FIND_CONSTRUCTION_SITES).length == 0)
  .until(s => s.carry.energy == 0);

module.exports = {
  name: name,
  body: body,
  tasks: [get, build, repair, upgrade],
  options: options,
  spawn: spawn
};

function body(budget) {
  return Designer.design(
    {move:1,carry:1,work:1},
    {move:5,carry:5,work:5},
    budget
  );
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