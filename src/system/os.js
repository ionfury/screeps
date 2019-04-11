let process = require('system.process');

let empire = require('manager.empire');
let colony = require('manager.colony');
let spawn = require('manager.spawn');
let creep = require('manager.creep');
let tower = require('manager.tower');
let bus = require('messaging.bus');

module.exports = {
  run: () => {
    bus.init();

    let pids = [].concat(
      tower.tasks(),
      creep.tasks(),
      spawn.tasks(),
      colony.tasks()
      //empire.tasks()
    );

    pids.sort((p1,p2) => p1.priority < p2.priority);
    pids.forEach(p => p.run());
    
    bus.teardown();
  }
};