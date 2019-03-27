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
		constructionManager.run(room);
	}
	let d = new Date();
	
	console.log(Game.time, b-a, c-b, d-c)
}