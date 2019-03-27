let spawnManager = require('manager.spawn');
let creepManager = require('manager.creep');
let constructionManager = require('manager.construction');

let utils = require('constant.utilities');

const debug = true;

module.exports.loop = function () {

  if(Game.time % 100 == 0) {
    utils.cleanMemory();
  }

	let a = new Date();
	for(let name in Game.spawns){
		let spawn = Game.spawns[name];
		spawnManager.run(spawn);
	}
	let b = new Date();

	for(let n in Game.creeps) {
		let creep = Game.creeps[n];	
		creepManager.run(creep);
	}
	let c = new Date();

	for(let n in Game.rooms) {
		let room = Game.rooms[n];
    planRoadsOnStartup(room);
		constructionManager.run(room);
	}
	let d = new Date();
	
	console.log(Game.time, b-a, c-b, d-c)
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
  
  extensions.forEach(planRoadAround);
  
  let uniquePositions = [...new Set(paths.map(p => { return {x:p.x, y:p.y}}))];
  
  uniquePositions.forEach(p => room.createConstructionSite(p.x, p.y, STRUCTURE_ROAD));

  room.memory.roadsPlanned = true;
}