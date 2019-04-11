let process = require('system.process');
let bus = require('messaging.bus');

const PRIORITY = 10;
const PROCESS_NAME = 'Tower.Run';

module.exports = {
  tasks: tasks
}

function tasks() {
  let processes = [];

  for(let t in Game.structures) {
    let structure = Game.structures[t];
    if(structure.structureType === STRUCTURE_TOWER) {
      processes.push(process(PROCESS_NAME, PRIORITY, () => handle(structure)));
    }
  }

  return processes;
}

function repair(context, options) {
  let target = Game.getObjectById(context.target);
  options.self.repair(target);
}

function attack(context, options) {
  let target = Game.getObjectById(context.target);
  options.self.attack(target);
}

function handle(tower)  {
  var hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  
  if(hostile) {
    tower.attack(hostile);
    return;
  }

  bus.bind(`colony/${tower.room.name}/repair`, repair, {self:tower});




  if(tower.energy > tower.energyCapacity / 2) {
    let ramparts = tower.room.find(FIND_STRUCTURES, {
      filter: s => s.structureType == STRUCTURE_RAMPART
        && s.hits < 100000
    });

    if(ramparts) {
      tower.repair(ramparts[0]);
    }
/*
    let roomStructures = tower.room.find(FIND_STRUCTURES, {
      filter: s => s.structureType != STRUCTURE_WALL
        && s.structureType != STRUCTURE_CONTROLLER
        && s.structureType != STRUCTURE_RAMPART
    });

    let damaged = _.min(roomStructures, s => s.hits / s.hitsMax);
  
    if(damaged) {
      tower.repair(damaged);
    }
    */
  }
}