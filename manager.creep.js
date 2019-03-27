let roleFactory = require('creep.roleFactory');
let executionFactory = require('creep.task.executionFactory')
let logger = require('constant.logger');

const say = false;

const debugName = 'claimer_1lk95h5amgng';

module.exports = {
  run: run
}

function run(creep) {
  let taskName = creep.memory.task;
  let options = creep.memory.options;
  if(say) creep.say(`${taskName}`);


  try {
    if(debugName == creep.name)
      console.log(`Debugging ${creep.name}`)

    let role = roleFactory.create(creep.memory.role);
    
    if(taskName) {
      if(debugName == creep.name)
        console.log(`  task:${taskName}`)
      if(role.tasks.find(t => t.name === taskName).end(creep)) {
        
        if(debugName == creep.name)
          console.log(`  ending task:${taskName}`)
        creep.memory.task = undefined;
      }
      else {
        if(debugName == creep.name)
          console.log(`  executing...`)
        let execution = executionFactory.create(taskName);
        execution.run(creep, options);
      }
    }
    else {
      if(debugName == creep.name)
        console.log(`  finding new task`)
      let task = role.tasks.find(t => t.ready(creep));
      if(task) {
        if(debugName == creep.name)
          console.log(`  task found: ${task.name}`)
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