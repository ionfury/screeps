let spawnManager = require('manager.spawn');
let creepManager = require('manager.creep');
let towerManager = require('manager.tower');
let roomMemory = require('constant.staticRoomMemory');
let stats = require('stats.grafana');

let bus = require('messaging.bus');

let commands = require('commands.setup');
let empireManager = require('manager.empire');

let utils = require('constant.utilities');
let RoleFactory = require('creep.roleFactory');
let TaskFactory = require('creep.taskFactory');
const profiler = require('profiler');
profiler.enable();

module.exports.loop = function () {
  if(Game.cpu.bucket < 9000) {
    console.log('!!!WARNING!!! BUCKET DEPLETING!!!');
  }
  commands.enable();
  bus.init();
  profiler.wrap(() => {

    let roleFactory = new RoleFactory();
    let taskFactory = new TaskFactory();
  
    utils.cleanMemory();
    
    for(let n in Game.rooms) {
      let room = Game.rooms[n];
      roomMemory.save(room);;
    }  
    
    spawnManager.run(roleFactory);
    creepManager.run(roleFactory, taskFactory);
    towerManager.run();
    empireManager.run();
    
    stats.gather();
  });
  bus.teardown();
}