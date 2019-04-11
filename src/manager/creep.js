let process = require('system.process');
let dependency = require('system.dependency');

const PRIORITY = 30;
const PROCESS_NAME = 'Creep.Run';

module.exports = {
  run: run,
  tasks: tasks
}

function tasks() {
  let processes = [];

  let creeps = Game.creeps;
  for(let n in creeps) {
    let creep = creeps[n];
    let process = handle(creep);
    if(process) {
      processes.push(process);
    }
  }

  return processes;
}

function run() {
  let creeps = Game.creeps;
  for(let n in creeps) {
    let creep = creeps[n];
    handle(creep);
  }
}

function handle(creep) {
  let taskId = creep.memory.task;
  let roleName = creep.memory.role;
  let options = creep.memory.options;

  if(!roleName) {
    creep.say(`no role`);
    console.log(`${creep.name} missing role!`);
    return;
  }

  let role = dependency.roleFactory.create(creep.memory.role);
  let task = role.tasks.find(t => t.id === taskId);

  //check task
  if(taskId) {
    if(task.end(creep)) {
      creep.memory.task = undefined;
      taskId = undefined;
      task = undefined;
      options = undefined;
    }
  }

  //start task
  if(!taskId) {
    task = role.tasks.find(t => t.ready(creep));
    if(task) {
      taskId = task.id;
      options = task.options;
      creep.memory.task = task.id;
      creep.memory.options = task.options;
    }
  }

  //run task
  if(taskId) {
    let execution =  dependency.taskFactory.create(task.name);
    return process(task.name, PRIORITY, () => execution.run(creep, options), () => abort(creep));
  }
  else {
    creep.say("Idle");
    return undefined;
  }
}

function abort(creep) {
  console.log(`"${creep.name}" error!`);
  creep.say("Ex!");
  creep.memory.task = undefined;
  creep.memory.options = undefined;  
}