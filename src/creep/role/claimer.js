let Task = require('creep.task');
let utils = require ('constant.utilities');

const name = 'claimer';

let go = new Task(10, 'goToRoom', {destination: 'target'})
  .when(c => c.room.name != c.memory['target'])
  .until(c => c.room.name == c.memory['target']);

let claim = new Task(3, 'claim')
  .when(c=> c.room.name == c.memory['target'] && !c.room.controller.my)
  .until(c=> c.room.controller.my);


let getEnergy = new Task(1, 'getEnergy', {useContainer: true, useSource: true})
  .when(c => c.carry.energy < c.carryCapacity && c.room.name == c.memory['target'])
  .until(c => c.carry.energy == c.carryCapacity);
  
let build = new Task(2, 'build')
  .when(s => s.carry.energy == s.carryCapacity 
    && s.room.find(FIND_CONSTRUCTION_SITES).length > 0
    && s.room.name == s.memory['target']) 
  .until(s => s.carry.energy == 0 
    || s.room.find(FIND_CONSTRUCTION_SITES).length == 0);




module.exports = {
  name: name,
  body: body,
  tasks: [go, claim, getEnergy, build],
  options: options,
  spawn: spawn
}

function body(budget) {
  let room = Game.rooms[Game.flags.Claim.pos.roomName];
  let body = [WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, CARRY,CARRY,CARRY];
  
  if(!room.controller.my) 
  {
    console.log('spawning claimer')
  }
  else
  {
    console.log('spawning claim builder');
  }


  return body;
}

function options(options) {
  let spawn = Game.getObjectById(options.spawnId);
  let home = spawn.room;
  
  return {memory:
  {
    role: name,
    spawnId: options.spawnId,
    home: home.name,
    target: Game.flags.Claim.pos.roomName
  }};
}

function spawn(options) {
  if(!Game.flags.Claim)
    return false;
  
  let creeps = Game.creeps;
  let claimers = _.filter(creeps, c => c.memory.role === 'claimer');
  
  return claimers.length < 1;
}

