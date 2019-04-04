let Task = require('task');
let Designer = require('constant.creepDesigner');

const CREEP_ROLE = 'harasser';
const TARGET_ROOM_NAME_ADDR = 'harassRoom';
const FLAG_NAME = 'Harass';


let go = new Task(10, 'goToRoom', {destination: TARGET_ROOM_NAME_ADDR})
  .while(s => s.room.name != s.memory[TARGET_ROOM_NAME_ADDR]);

let attack = new Task(20, 'defendRoom')
  .while(s => s.room.name === s.memory[TARGET_ROOM_NAME_ADDR]);

function remember(options) {
  let spawn = Game.getObjectById(options.spawnId);
  console.log(`${spawn.name} spawning harasser to hit ${Game.flags[FLAG_NAME].pos.roomName}`);
  let opts = {memory: {
    role: CREEP_ROLE,
    spawnId: options.spawnId
  }};

  opts.memory[TARGET_ROOM_NAME_ADDR] = Game.flags[FLAG_NAME].pos.roomName;

  return opts;
}

function spawn(options) {
  return shouldBeHarassing();
}

function body(budget) {
  return Designer.design(
    {move:6,attack:3},
    {move:6,attack:3},
    budget
  );
}
  
module.exports = {
  name: CREEP_ROLE,
  body: body,
  tasks: [go, attack],
  options: remember,
  spawn: spawn
}

function shouldBeHarassing() {
  let flagExists = Game.flags[FLAG_NAME] != undefined;

  if(flagExists) {
    let harassers = _.filter(Game.creeps, c =>
      c.memory.role == CREEP_ROLE
      && c.memory[TARGET_ROOM_NAME_ADDR] == Game.flags[FLAG_NAME].pos.roomName
      );

    return harassers < 1;
  }
  else {
    return false;
  }
}