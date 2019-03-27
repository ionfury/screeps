let Task = require('task');
let utils = require('constant.utilities');

class Harvester extends Role {
  design(budget) {
    let body = [CARRY, MOVE, WORK];
  
    while(utils.cost(body)+ BODYPART_COST[WORK] <= budget){
      body.push(WORK);
    }
  
    return body;
  }

  tasks() {
    let get = new Task('getEnergy', {useContainer: false, useSource: true})
      .when((s) => s.carry.energy < s.carryCapacity)
      .until((s) => s.carry.energy == s.carryCapacity);
  
    let store = new Task('storeEnergy', {structureTypes: [STRUCTURE_CONTAINER]})
      .when((s) => s.carry.energy == s.carryCapacity 
        && s.room.find(FIND_MY_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER}).length > 0)
      .until((s) => s.carry.energy == 0);
      
    let fill = new Task('storeEnergy', {structureTypes: [STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_TOWER]})
      .when((s) => s.carry.energy == s.carryCapacity 
        && s.room.energyAvailable < s.room.energyCapacityAvailable)
      .until((s) => s.carry.energy == 0 
        || s.room.energyAvailable == s.room.energyCapacityAvailable);
    
    let build = new Task('build')
      .when(s => s.carry.energy == s.carryCapacity 
        && s.room.find(FIND_CONSTRUCTION_SITES))
      .until(s => s.carry.energy == 0 
        || !s.room.find(FIND_CONSTRUCTION_SITES))
    
    let upgrade = new Task('upgrade')
      .when(s => s.carry.energy == s.carryCapacity && !s.room.find(FIND_CONSTRUCTION_SITES))
      .until(s => s.carry.energy == 0);

    return [get, store, fill, build, upgrade];
  }

  spawn(){
    let spawn = Game.getObjectById(options.spawnId);
    let room = spawn.room;
    let creeps = room.find(FIND_MY_CREEPS);
    let creepsInRoom = creeps
      .map(c => c.memory.role)
      .reduce((acc, role) => (acc[role] = (acc[role] || 0) + 1, acc), {});
    let harvesterCount = creepsInRoom[name] || 0;
    return harvesterCount < room.find(FIND_SOURCES).length;
  }
}

module.exports = Harvester;