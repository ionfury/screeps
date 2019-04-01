let Task = require('task');
let Designer = require('constant.creepDesigner');

const name = 'explorer';

let search = new Task(1, 'findUnexplored')
  .while(c => c.memory.target == undefined);

let go = new Task(2, 'goToRoom', {destination: 'target'})
  .while(c => c.room.name != c.memory.target);

let explore = new Task(3, 'explore')
  .while(c => c.room.name == c.memory.target);

module.exports = {
  name: name,
  body: body,
  tasks: [search, go, explore],
  options: memory,
  spawn: spawn
};

function body(budget) {
  return Designer.design(
    {move:2},
    {move:2},
    budget
  );
}

function memory(options) {
  let spawnId = options.spawnId;

  return { memory: 
  {
    role: name,
    spawnId: spawnId
  }};
}

function spawn(options) {
  let explorers = _.filter(Game.creeps, c => c.memory.role == name);

  return explorers.length < 1;
}