let logger = require('constant.logger');
let roles = require('creep.roles');
let roleFactory = require('creep.roleFactory');

const debug = true;

module.exports = {
  run: spawn  
};

function spawn(self) {
  if(self.spawning) return;
  if(self.energy < self.energyCapacity) return;

  roles.types.forEach(type => {
    logger.notify(`${type} spawning...`, {write:debug})
    let role = roleFactory.create(type);
    if(role.spawn({spawnId: self.id})) {
      let name = `${type}_${Math.random().toString(26).slice(2)}`;
      let code = self.spawnCreep(
        role.body(self.energy),
        name,
        role.options({spawnId: self.id}));
        
      switch(code) 
      {
        case OK:
          logger.notify(`${self.name} spawning ${name}`);
          break;
        case ERR_NOT_ENOUGH_ENERGY:
          logger.notify(`${self.name} not enough energy to spawn`,{write:debug});
          break;
        default:
          logger.notify(`${self.name}: `, {code: code})
          break;
      }
    }
  });
}