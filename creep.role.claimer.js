let Task = require('task');
let utils = require ('constant.utilities');

const name = 'claimer';

let getEnergy = new Task('getEnergy', {useContainer: true, useSource: true})
  .when(c => c.carry.energy < c.carryCapacity && c.room.name == c.memory['home'])
  .until(c => c.carry.energy == c.carryCapacity);

let go = new Task('goToRoom', {destination: 'target'})
  .when(c => c.carry.energy < c.carry.capacity && !Game.rooms[c.memory['target']].my)
  .until(c => c.room.name != c.memory['target']);

let claim = new Task('claim')
  .when(c => c.carry.energy == c.carry.capacity 
    && c.room.name == c.memory['target'])
  .until(c => c.carry.energy == 0
    || Game.rooms[c.memory['target']].my)

let home = new Task('goHome')
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
  let body = [WORK, MOVE, CARRY];
  
/*  while(utils.cost(body)+ BODYPART_COST[CARRY] + BODYPART_COST[MOVE] + BODYPART_COST[WORK] <= budget){
    body.push(CARRY);
    body.push(MOVE);
    body.push(WORK);
  }
*/
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
    target: unclaimedRooms()
  }};
}

function spawn(options) {
  let flags = Game.flags;
  let claims = flags.filter(f => f.name === 'Claim');
  let creeps = Game.creeps;
  let claimers = creeps.filter(c => c.memory.role === 'claimer');
  
  return claims.length < claimers.length;
}

function unclaimedRoom() {
  let flags = Game.flags;
  let claims = flags.filter(f => f.name === 'Claim');
  let creeps = Game.creeps;
  let claimers = creeps.filter(c => c.memory.role === 'claimer');

  let unclaimed = _.difference(claims.map(c => c.room), claimers.map(c => c.memory.target));

  if(unclaimed.length > 0)
    return unclaimed[0];
  else return []; 
}

