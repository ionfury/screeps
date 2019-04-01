let TaskFactory = require('creep.taskFactory')
let performance = require('constant.performance');

module.exports = {
  run: run
}

function run(creeps, roleFactory) {
  let taskFactory = new TaskFactory();
  for(let n in creeps) {
    let creep = creeps[n];
    handle(creep, roleFactory, taskFactory);
  }
}

function handle(creep, roleFactory, taskFactory) {
  let taskId = creep.memory.task;
  let roleName = creep.memory.role;
  let options = creep.memory.options;

  if(!roleName) {
    creep.say(`no role`);
    console.log(`${creep.name} missing role!`);
    return;
  }

  try
  {
    let role = roleFactory.create(creep.memory.role);
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
      let execution = taskFactory.create(task.name);
      let start = Game.cpu.getUsed();
      execution.run(creep, options);
      let finish = Game.cpu.getUsed();

      performance.log(task.name, (finish-start));
    }
    else {
      creep.say("Idle");
    }
  }
  catch (ex) {
    creep.say("Ex!");
    console.log(`"${creep.name}" error while running taskId:"${taskId}":`, ex);
    creep.memory.task = undefined;
    creep.memory.options = undefined;
  }
}