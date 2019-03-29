let spawnManager = require('manager.spawn');
let creepManager = require('manager.creep');
let constructionManager = require('manager.construction');

let utils = require('constant.utilities');


module.exports.loop = function () {
  utils.cleanMemory();
  
hello world
	for(let name in Game.spawns){
		let spawn = Game.spawns[name];
		spawnManager.run(spawn);
	}

	for(let n in Game.creeps) {
		let creep = Game.creeps[n];	
		creepManager.run(creep);
	}

	for(let n in Game.rooms) {
		let room = Game.rooms[n];
    planRoadsOnStartup(room);
		constructionManager.run(room);
  }
  
  for(let n in Game.structures) {
    let structure = Game.structures[n];
    if(structure.structureType === STRUCTURE_TOWER) {
      runTower(structure)
    }
  }
}

function runTower(tower) {
  var hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  
  if(hostile) {
    tower.attack(hostile);
    return;
  }

  if(tower.energy > tower.energyCapacity / 2) {
    let damaged = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: s => s.hits < s.hitsMax
        && s.structureType != STRUCTURE_WALL 
        && s.structureType != STRUCTURE_RAMPART
    });
    
    if(damaged){
      tower.repair(damaged);
    }
  }

}

function planRoadsOnStartup(room) {
  if(room.memory.roadsPlanned == true) return;

  let controller = room.controller;
  let spawns = room.find(FIND_MY_SPAWNS);
  let sources = room.find(FIND_SOURCES);
  let extensions = room.find(FIND_MY_STRUCTURES, {
    filter: s=>s.structureType == STRUCTURE_EXTENSION
  });

  let paths = [];

  spawns.forEach(spawn => {
    Array.prototype.push.apply(paths, (spawn.pos.findPathTo(controller.pos)));

    Array.prototype.push.apply(paths, sources.forEach(source => spawn.pos.findPathTo(source.pos)));
  });
  
  let uniquePositions = [...new Set(paths.map(p => { return {x:p.x, y:p.y}}))];
  
  uniquePositions.forEach(p => room.createConstructionSite(p.x, p.y, STRUCTURE_ROAD));

  room.memory.roadsPlanned = true;
}