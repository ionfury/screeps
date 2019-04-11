let RoleFactory = require('creep.roleFactory');
let TaskFactory = require('creep.taskFactory');

let role = new RoleFactory();
let task = new TaskFactory();

module.exports = {
  roleFactory: role,
  taskFactory: task
};