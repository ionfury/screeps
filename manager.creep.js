let roleFactory = require('creep.roleFactory');
let executionFactory = require('creep.task.executionFactory')
let logger = require('constant.logger');

const say = false;

module.exports = {
  run: run
}

function run(creep) {
  let taskName = creep.memory.task;
  let options = creep.memory.options;
  if(say) creep.say(`${taskName}`);

  let role = roleFactory.create(creep.memory.role);
  
  if(taskName) {
    if(role.tasks.find(t => t.name === taskName).end(creep)) {
      creep.memory.task = role.tasks.find(t => t.ready(creep)).name;
    }
    else {
      let execution = executionFactory.create(taskName);
      execution.run(creep, options);
    }
  }
  else {
    let task = role.tasks.find(t => t.ready(creep));
    creep.memory.task = task.name;
    creep.memory.options = task.options;
  }
}