let spawnManager = require('manager.spawn');
let creepManager = require('manager.creep');
let towerManager = require('manager.tower');
let roomMemory = require('constant.staticRoomMemory')

let utils = require('constant.utilities');
let RoleFactory = require('creep.roleFactory');
let TaskFactory = require('creep.taskFactory');
const profiler = require('profiler');

function f(d) {
  return parseFloat(Math.round(d * 100) / 100).toFixed(2);
}

//profiler.enable();
module.exports.loop = function () {
  profiler.wrap(() => {

    let zero =Game.cpu.getUsed();


    let roleFactory = new RoleFactory();
    let taskFactory = new TaskFactory();
  
    utils.cleanMemory();
    
    for(let n in Game.rooms) {
      let room = Game.rooms[n];
     // planRoadsOnStartup(room);
      roomMemory.save(room);
      //constructionManager.run(room);
    }  
  let a = Game.cpu.getUsed();
    spawnManager.run(roleFactory);
  let b = Game.cpu.getUsed();
    creepManager.run(roleFactory, taskFactory);
  let c = Game.cpu.getUsed();
    towerManager.run();
  let d = Game.cpu.getUsed();
    
    console.log(f(d-zero),'startup:',f(a-zero),'spawn:',f(b-a),'creep:',f(c-b),'tower:',f(d-c))
  });
}

function log() {
  let t = Game.cpu.getUsed();
  console.log(`hey ${t}`)
  if(Memory.performance.cpu == undefined)
    {Memory.performance.cpu = [];}

  if(Memory.performance.cpu.length > 50)
    {Memory.performance.cpu.shift();}

  Memory.performance.cpu.push(t);

  if(t > 10)
    console.log(`${t} spike @ ${Game.tick} (avg:${avg()})`);
}

function avg() {
  let arr = Memory.performance.cpu;
  let sum = arr.reduce((a,b) => a+b);
  let avg = sum / arr.length;
  return avg;
}