class RoleFactory {
  constructor(){
    this._roleCache = {};
  }

  create(roleName) {
    if(this._roleCache[roleName] == undefined) {
      let role = require(`creep.role.${roleName}`)
      this._roleCache[roleName] = new Role(roleName, role.tasks, role.body, role.spawn, role.options);
    }

    return this._roleCache[roleName];
  }
}

class Role {
  constructor(name, tasks, body, spawn, options) {
    this.name = name;
    this.tasks = tasks;
    this.body = body;
    this.spawn = spawn;
    this.options = options;
  }
}

module.exports = RoleFactory;