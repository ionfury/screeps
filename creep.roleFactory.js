module.exports = {
  create: create
}

function Role(name, tasks, body, spawn, options) {
  this.name = name;
  this.tasks = tasks;
  this.body = body;
  this.spawn = spawn;
  this.options = options;
}

function create(name) {
  let role = require(`creep.role.${name}`);
  return new Role(name, role.tasks, role.body, role.spawn, role.options);
}