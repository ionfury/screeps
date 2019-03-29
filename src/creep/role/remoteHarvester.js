let Task = require('task');
let utils = require('constant.utilities');

const name = 'remoteHarvester';

let go = new Task(1, 'goToRoom', {destination: 'target'})
  .when(s=> s.carry.energy < s.carryCapacity && s.room.name == s.memory['home'])
  .until(s=> s.room.name == s.memory['target']);

let harvest = new Task(2, 'getEnergy', {useContainer: false, useSource: true})
  .when(s=> s.carry.energy < s.carryCapacity && s.room.name == s.memory['target'])
  .until(s=> s.carry.energy == s.carryCapacity);

let ret = new Task(3, 'goToRoom', {destination: 'home'})
  .when(s=> s.carry.energy == s.carryCapacity && s.room.name != s.memory['home'])
  .until(s=> s.room.name == s.memory['home']);

let store = new Task(4, 'storeEnergy', {structureTypes: [STRUCTURE_SPAWN,STRUCTURE_EXTENSION,STRUCTURE_TOWER,STRUCTURE_CONTAINER]})
  .when(s=> s.carry.energy == s.carryCapacity && s.room.name == s.memory['home'])
  .until(s=> s.carry.energy ==0);

let build = new Task(5, 'build')
  .when(s => s.carry.energy == s.carryCapacity 
    && s.room.find(FIND_CONSTRUCTION_SITES).length > 0
    && s.room.name == s.memory['target'])
  .until(s => s.carry.energy == 0 
    || s.room.find(FIND_CONSTRUCTION_SITES).length == 0)

module.exports = {
  name: name,
  body: body,
  tasks: [go, harvest, ret, store, build],
  options: memory,
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

function roomExits(room) {
  
  let exits = Game.map.describeExits(room.name);

  let dests = [];
  if(exits["1"] != undefined)
    dests.push(exits["1"]);
  if(exits["3"] != undefined)
    dests.push(exits["3"]);
  if(exits["5"] != undefined)
    dests.push(exits["5"]);
  if(exits["7"] != undefined)
    dests.push(exits["7"]);

  return dests;
}

function memory(options) {
  let spawnId = options.spawnId;
  let spawn = Game.getObjectById(spawnId);
  let home = spawn.room;
  let dests = roomExits(spawn.room);

  let remoteHarvesters = _.filter(Game.find(FIND_MY_CREEPS), c => 
    c.memory.role == name 
    && c.memory.spawnId == spawnId
  );

  //let freeRooms





  return { memory: 
  {
    role: name,
    spawnId: spawnId,
    home: home.name,
    target: dests[Game.time%dests.length] //get random remote room
  }};
}

function spawn(options) {
  let spawn = Game.getObjectById(options.spawnId);
  let creeps = _.filter(Memory.creeps, c => c.role === name).length;
  let adjRooms = roomExits(spawn.room);

  return creeps < adjRooms.length * 3;
}