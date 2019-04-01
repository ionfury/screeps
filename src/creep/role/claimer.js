let Task = require('task');
let utils = require ('constant.utilities');

const name = 'claimer';

let getEnergy = new Task(1, 'getEnergy', {useContainer: true, useSource: true})
  .when(c => c.carry.energy < c.carryCapacity && c.room.name == c.memory['home'])
  .until(c => c.carry.energy == c.carryCapacity);

let go = new Task(2, 'goToRoom', {destination: 'target'})
  .when(c => c.carry.energy == c.carryCapacity && c.room.name != [c.memory['target']])
  .until(c => c.room.name == c.memory['target']);
  //.until(c => c.pos.findPathTo(Game.rooms[c.memory['target']].controller).length > 0)

let claim = new Task(3, 'claim')
  .when(c => c.carry.energy == c.carryCapacity 
    && c.room.name == c.memory['target'])
  .until(c => c.carry.energy == 0
    || Game.rooms[c.memory['target']].my)

let home = new Task(4, 'goHome')
  .when(c => c.carry.energy == 0
    && c.room.name == c.memory['target'])
  .until(c => c.room.name == Game.getObjectById(self.memory.spawnId).room.name)

module.exports = {
  name: name,
  body: body,
  tasks: [getEnergy, go, claim, home],
  options: options,
  spawn: spawn
}

function body(budget) {
  let body = [WORK, MOVE, CARRY, CLAIM];
  

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
  
  return false//claimers.length < 1;
}

