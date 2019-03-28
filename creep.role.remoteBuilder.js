let Task = require('task');
let utils = require ('constant.utilities');

const name = 'remoteBuilder';

let go = new Task(1, 'goToRoom', {destination: 'target'})
  .when(s.room.name == s.memory['home'])
  .until(s=> s.room.name == s.memory['target']);

let get = new Task(1,'getEnergy', {useContainer: true, useSource: true})
  .while(c => c.carry.energy < c.carryCapacity);
  
let build = new Task(2, 'build')
  .when(s => s.carry.energy == s.carryCapacity && s.room.find(FIND_CONSTRUCTION_SITES).length > 0)
  .until(s => s.carry.energy == 0 || s.room.find(FIND_CONSTRUCTION_SITES).length == 0)


module.exports = {
  name: name,
  body: body,
  tasks: [go, get, build],
  options: options,
  spawn: spawn
};

function body(budget) {
  let body = [WORK, MOVE, CARRY];
  
  while(utils.cost(body)+ BODYPART_COST[CARRY] + BODYPART_COST[MOVE] + BODYPART_COST[WORK] <= budget){
    body.push(CARRY);
    body.push(MOVE);
    body.push(WORK);
  }

  return body;
}

function options(options){
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

function spawn(options){
  if(!Game.flags.Claim)
    return false;
  
  let creeps = Game.creeps;
  let rbs = _.filter(creeps, c => c.memory.role === name);
  
  return count < rbs;
}