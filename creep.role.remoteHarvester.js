let Task = require('task');
let utils = require('constant.utilities');

const name = 'remoteHarvester';

let go = new Task('goToRoom', {destination: 'target'})
  .when(s=> s.carry.energy < s.carry.capacity)
  .until(s=> s.room.id != s.memory['target']);

let harvest = new Task('getEnergy', {useContainer: false, useSource: true})
  .when(s=> s.carry.energy < s.carryCapacity && s.room.id == s.memory['target'])
  .until(s=> s.carry.energy == s.carryCapacity);

let ret = new Task('goToRoom', {destination: 'home'})
  .when(s=> s.carry.energy == s.carry.capacity)
  .until(s=> s.room.id == s.memory['home']);

let store = new Task('storeEnergy', {structureTypes: [STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_TOWER]})
  .when(s=> s.carry.energy == s.carryCapacity && s.room.id == s.memory['home'])
  .until(s=> s.carry.energy ==0);

module.exports = {
  name: name,
  body: body,
  tasks: [go, harvest, ret, store],
  options: options,
  spawn: spawn
};

function body(budget) {
  let body = [CARRY, MOVE, WORK];
  let cost = utils.cost(body)

  while(utils.cost(body) + cost <= budget) {
    body.push(CARRY);
    body.push(MOVE);
    body.push(WORK);
  }

  return body;
}

function adjRooms(room) {
  
  let exits = Game.map.describeExits(spawn.room.name);

  let dests = [];
  if(exits["1"] != undefined)
    dests.push(exit["1"]);
  if(exits["3"] != undefined)
    dests.push(exit["3"]);
  if(exits["5"] != undefined)
    dests.push(exit["5"]);
  if(exits["7"] != undefined)
    dests.push(exit["7"]);

    return dests;
}

function options(options) {
  let spawn = Game.getObjectById(options.spawnId);
  let home = spawn.room;
  let dests = adjRooms(spawn.room.name);

  return { memory: 
  {
    role: name,
    spawnId: options.spawnId,
    home: home.id,
    target: dests[Game.time%dests.length] //get random remote room
  }};
}

function spawn(options) {
  let spawn = Game.getObjectById(options.spawnId);
  let creeps = Memory.creeps.filter(c => c.role === name).length;
  let adjRooms = adjRooms(spawn.room);

  return creeps < adjRooms.length;
}