module.exports = {
  create: create
}

function create(name) {
  let role = require(`creep.role.${name}`);
  return new role();
}