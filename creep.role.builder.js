let Task = require('task');

class Builder extends Role {
  design(budget) {
    return [WORK,CARRY,CARRY,CARRY,MOVE];
  }

  tasks() {
    let get = new Task('getEnergy', {useContainer: true, useSource: true})
      .when((s) => s.carry.energy < s.carryCapacity)
      .until((s) => s.carry.energy == s.carryCapacity);
    
    let build = new Task('build')
      .when(s => s.carry.energy == s.carryCapacity && s.room.find(FIND_CONSTRUCTION_SITES))
      .until(s => s.carry.energy == 0 || !s.room.find(FIND_CONSTRUCTION_SITES))
    
    let upgrade = new Task('upgrade')
      .when(s => s.carry.energy == s.carryCapacity && !s.room.find(FIND_CONSTRUCTION_SITES))
      .until(s => s.carry.energy == 0);

    return [get, build, upgrade];
  }

  spawn(options) {
    let spawn = Game.getObjectById(options.spawnId);
    let room = spawn.room;
    let creeps = room.find(FIND_MY_CREEPS);
    let creepsInRoom = creeps
      .map(c => c.memory.role)
      .reduce((acc, role) => (acc[role] = (acc[role] || 0) + 1, acc), {});
    let count = creepsInRoom[name] || 0;
    return count < 2;
  }
}

module.exports = Builder;