module.exports = {
  run: run
}

function run() {
  for(let t in Game.structures) {
    let structure = Game.structures[t];
    if(structure.structureType === STRUCTURE_TOWER) {
      handle(structure);
    }
  }
}

function handle(tower)  {
  var hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  
  if(hostile) {
    tower.attack(hostile);
    return;
  }

  if(tower.energy > tower.energyCapacity / 2) {
    let ramparts = tower.room.find(FIND_STRUCTURES, {
      filter: s => s.structureType == STRUCTURE_RAMPART
        && s.hits < 300000
    });

    if(ramparts) {
      tower.repair(ramparts[0]);
    }

    let roomStructures = tower.room.find(FIND_STRUCTURES, {
      filter: s => s.structureType != STRUCTURE_WALL
        && s.structureType != STRUCTURE_CONTROLLER
        && s.structureType != STRUCTURE_RAMPART
    });

    let damaged = _.min(roomStructures, s => s.hits / s.hitsMax);
  
    if(damaged) {
      tower.repair(damaged);
    }
  }
}