module.exports = {
  create: create
}

function TaskExecution(name, run) {
  this.name = name;
  this.run = run;
}

function create(name) {
  let task = require(`creep.task.${name}`);
  return new TaskExecution(name, task.run);
}