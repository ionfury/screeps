let spawnManager = require('manager.spawn');
let creepManager = require('manager.creep');
let constructionManager = require('manager.construction');
let performance = require('constant.performance');
let roomMemory = require('constant.staticRoomMemory')

let utils = require('constant.utilities');
let RoleFactory = require('creep.roleFactory');

module.exports.loop = function () {
  let factory = new RoleFactory();

  if(Game.time % 100 == 0)
    performance.report();

  utils.cleanMemory();
  
	for(let n in Game.rooms) {
		let room = Game.rooms[n];
   // planRoadsOnStartup(room);
    roomMemory.save(room);
		//constructionManager.run(room);
  }
  
	for(let name in Game.spawns){
		let spawn = Game.spawns[name];
    spawnManager.run(spawn, factory);
    
    if(Game.time % 100 == 0)
      planRoads(spawn.room, true);
  }
  
  creepManager.run(Game.creeps, factory);
  
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
    let roomStructures = tower.room.find(FIND_STRUCTURES, {
      filter: s => s.structureType != STRUCTURE_WALL
        && s.structureType != STRUCTURE_CONTROLLER
    });

    let damaged = _.min(roomStructures, s => s.hits / s.hitsMax);
  
    if(damaged) {
      tower.repair(damaged);
    }
  }
}



function planRoads(home, create) {
  console.log('planning roads for:', home.name)
  //if(home.memory.routesPlanned && create) return;
  let spawn = home.find(FIND_MY_SPAWNS)[0];
  let homeController = home.controller;
  let homeSources = home.find(FIND_SOURCES);

  let homePaths = [];
  homePaths.push(spawn.pos.findPathTo(homeController.pos, {ignoreCreeps:true,ignoreRoads:true,swampCost:1}));
  homeSources.forEach(s => homePaths.push(spawn.pos.findPathTo(s.pos, {ignoreCreeps:true,ignoreRoads:true,swampCost:1})));
  

  let roomNames = findRoomExits(home);

  roomNames.forEach(roomName => {
    let room = Game.rooms[roomName];
    if(!room) return;
    if(room.controller != undefined && (!room.controller.my || roomName == home.name)) {
      let remotePaths = [];

      //let remoteController = room.controller;
      let remoteSources = room.find(FIND_SOURCES);

     // homePaths.push(spawn.pos.findPathTo(remoteController.pos, {ignoreCreeps:true,ignoreRoads:true,swampCost:1}));
     // remotePaths.push(remoteController.pos.findPathTo(spawn.pos, {ignoreCreeps:true,ignoreRoads:true,swampCost:1}));

      remoteSources.forEach(s => {
        homePaths.push(spawn.pos.findPathTo(s.pos, {ignoreCreeps:true}));
        remotePaths.push(s.pos.findPathTo(spawn.pos, {ignoreCreeps:true}));
      });

      if(create) {
        remotePaths.forEach(path => {
          path.pop();path.shift();//trim ends
          path.forEach(point => room.createConstructionSite(point.x, point.y, STRUCTURE_ROAD));
        });
      
        remotePaths.forEach(p => {
          new RoomVisual(roomName).poly(p, {stroke:'green'})
        });
      }
      else {
        remotePaths.forEach(p => {
          new RoomVisual(roomName).poly(p, {stroke:'red'})
        });
      }
    }
  });

  if(create) {
    homePaths.forEach(path => {
      path.pop();path.shift();//trim ends
      path.forEach(point => home.createConstructionSite(point.x, point.y, STRUCTURE_ROAD));
    });
    homePaths.forEach(p => {
      new RoomVisual(home.name).poly(p, {stroke:'green'});
    });
  }
  else {
    homePaths.forEach(p => {
      new RoomVisual(home.name).poly(p, {stroke:'red'});
    });
  }
}



function findRoomExits(room) {
  let exits = Game.map.describeExits(room.name);

  let names = [];

  _.forEach(['1', '3', '5', '7'], i => {
    if(exits[i] != undefined)
      names.push(exits[i]);
  });


  return names;
}