let Task = require('task');
let utils = require('constant.utilities');

class Harvester extends Role {
  design(budget) {
    let body = [MOVE, CARRY];
    
    while(utils.cost(body)+ BODYPART_COST[CARRY] + BODYPART_COST[MOVE] <= budget){
      body.push(CARRY);
      body.push(MOVE);
    }
  
    return body;
  }

  tasks() {
    let get = new Task('getEnergy', {useContainer: true, useSource:false})
      .when(s => s.carry.energy < s.carryCapacity)
      .until(s => s.carry.energy == s.carryCapacity);
    
    let store = new Task('storeEnergy', {structureTypes: [STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_TOWER]})
      .when((s) => s.carry.energy == s.carryCapacity)
      .until((s) => s.carry.energy == 0);
    
    return [get, store];
  }

  spawn(options) {
    let spawn = Game.getObjectById(options.spawnId);
    let room = spawn.room;
    let creeps = room.find(FIND_MY_CREEPS);
    let creepsInRoom = creeps
      .map(c => c.memory.role)
      .reduce((acc, role) => (acc[role] = (acc[role] || 0) + 1, acc), {});
    let count = creepsInRoom[name] || 0;
    return count < 3;
  }
}

module.exports = Hauler;