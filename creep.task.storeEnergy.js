let utilities = require('constant.utilities');
let logger = require('constant.logger')

module.exports = {
  run: taskStoreEnergy
}

function taskStoreEnergy(creep, options) {
  let defaults = {
    structureTypes: [STRUCTURE_SPAWN]
  }

  utilities.setDefaults(options, defaults);

  let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (s) => filterHasCapacity(s, options)
  });

  

  if(structure == undefined) {
    structure = creep.room.storage;
  }

  if(structure != undefined) {
    let code = creep.transfer(structure, RESOURCE_ENERGY);
    switch(code){
      case ERR_NOT_IN_RANGE:
        creep.moveTo(structure);
        break;
    }
  }
}

function filterHasCapacity(s, options) {
  return options.structureTypes.includes(s.structureType)
  && (
    (s.energy < s.energyCapacity) 
    || (s.store !== undefined ? s.store[RESOURCE_ENERGY] : 0) < s.storeCapacity
    )
}