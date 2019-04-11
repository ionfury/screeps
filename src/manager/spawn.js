let process = require('system.process');

let dependency = require('system.dependency');
let logger = require('constant.logger');
let roles = require('creep.roles');
const debug = false;

const PROCESS_NAME = 'Spawn.Run';
const PRIORITY = 10;

module.exports = {
  run: run,
  tasks: tasks
};

function tasks() {
  let processes = [];

  for(let n in Game.spawns) {
    let spawn = Game.spawns[n];
    processes.push(process(PROCESS_NAME, PRIORITY, () => handle(spawn)));
  }

  return processes;
}

function run() {
  for(let n in Game.spawns) {
    let spawn = Game.spawns[n];
    handle(spawn);
  }
}

function handle(self) {
  if(self.spawning) return;
  if(self.room.energyAvailable < 300) return;
  if(self.memory.queue == undefined) self.memory.queue = [];

  roles.types.forEach(type => {
    if(self.name == 'Spawn3' && type=='remoteDefender'){
    }
    else {
      
      let role = dependency.roleFactory.create(type);
      if(role.spawn({spawnId: self.id})) {
        let name = `${type}_${Math.random().toString(26).slice(2)}`;
        let code = self.spawnCreep(
          role.body(self.room.energyAvailable, self),
          name,
          role.options({spawnId: self.id}));
          
        switch(code) 
        {
          case OK:
            logger.notify(`${self.name} spawning ${name}`,{write:debug});
            break;
          case ERR_NOT_ENOUGH_ENERGY:
            logger.notify(`${self.name} not enough energy to spawn`,{write:debug});
            break;
          default:
          console.log(type);
            logger.notify(`${self.name}: `, {code: code})
            break;
        }
      }
    }
  });
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