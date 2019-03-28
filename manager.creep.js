let roleFactory = require('creep.roleFactory');
let executionFactory = require('creep.task.executionFactory')
let logger = require('constant.logger');

module.exports = {
  run: run
}

function run(creep) {
  let taskName = creep.memory.task;
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

    //check task
    if(taskName) {
      let task = role.tasks.find(t => t.name === taskName);

      if(task.end(creep)) {
        creep.memory.task = undefined;
        taskName = undefined;
        task = undefined;
        options = undefined;
      }
    }

    //start task
    if(!taskName) {
      task = role.tasks.find(t => t.ready(creep));
      taskName = task.name;
      options = task.options;
      if(task) {
        creep.memory.task = task.name;
        creep.memory.options = task.options;
      }
    }

    //run task
    if(taskName) {
      let execution = executionFactory.create(taskName);
      execution.run(creep, options);
    }
    else {
      creep.say("Idle");
    }
  }
  catch (ex) {
    creep.say("Ex!");
    console.log(`"${creep.name}" error while running "${taskName}":`, ex);
  }
}


/* break glass in case of emergency
function run2(creep) {
  let taskName = creep.memory.task;
  let options = creep.memory.options;
  if(say) creep.say(`${taskName}`);


  try {

    let role = roleFactory.create(creep.memory.role);
    
    if(taskName) {
      if(role.tasks.find(t => t.name === taskName).end(creep)) {
        creep.memory.task = undefined;
      }
      else {
        let execution = executionFactory.create(taskName);
        execution.run(creep, options);
      }
    }
    else {
      let task = role.tasks.find(t => t.ready(creep));
      if(task) {
        creep.memory.task = task.name;
        creep.memory.options = task.options;
      }
      else {
        creep.say("Idle");
      }
    }
  }
  catch (ex) {
    console.log(`"${creep.name}" error while running "${taskName}":`, ex);
  }
}
*/