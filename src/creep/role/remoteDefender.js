let Task = require('task');
let Designer = require('constant.creepDesigner');

const CREEP_ROLE = 'remoteDefender';
const TARGET_ROOM_NAME_ADDR = 'defenderRoom';

let go = new Task(10, 'goToRoom', {destination: TARGET_ROOM_NAME_ADDR})
  .while(s => s.room.name != s.memory[TARGET_ROOM_NAME_ADDR]);

let defend = new Task(20, 'defendRoom')
  .while(s => s.room.name === s.memory[TARGET_ROOM_NAME_ADDR]);

function remember(options) {
  let spawn = Game.getObjectById(options.spawnId);
  let undefendedRoom = getUndefendedRoomNear(spawn.room);

  let opts = {memory: {
    role: CREEP_ROLE,
    spawnId: options.spawnId
  }};

  opts.memory[TARGET_ROOM_NAME_ADDR] = undefendedRoom;

  return opts;
}

function spawn(options) {
  let spawn = Game.getObjectById(options.spawnId);
  let undefendedRoom = getUndefendedRoomNear(spawn.room);
  return undefendedRoom != undefined;
}

function body(budget) {
  return Designer.design(
    {tough:8,move:4,attack:3,heal:1},
    {tough:8,move:4,attack:3,heal:1},
    budget
  );
}

module.exports = { 
  name: CREEP_ROLE,
  body: body,
  tasks: [go, defend],
  options: remember,
  spawn: spawn
}

function getUndefendedRoomNear(room) {
  let roomNames = adjRoomNames(room);

  for(let i = 0; i < roomNames.length; i++) {
    let roomName = roomNames[i];
    let room = Game.rooms[roomName];

    if(room == undefined || room.controller.my) continue;

    if(room) {
      if(nobodyDefending(room.name)){
        return roomName;
      }
    }
  }
}

function nobodyDefending(roomName) {
  let defended = _.filter(Game.creeps, c => 
    c.memory.role == CREEP_ROLE
    && c.memory[TARGET_ROOM_NAME_ADDR] == roomName
  );

  return defended.length < 1;
}

function adjRoomNames(room) {
  let exits = Game.map.describeExits(room.name);
  let names = [];
  if(!exits) return names;

  _.forEach(['1', '3', '5', '7'], i => {
    if(exits[i] != undefined)
      names.push(exits[i]);
  });

  return names;
}