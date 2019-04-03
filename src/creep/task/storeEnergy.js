module.exports = {
  run: taskStoreEnergy
}

function taskStoreEnergy(creep, options) {
  let structureTypes = options.structureTypes || [STRUCTURE_SPAWN];
  
  let structure;
  if(options.containerId) {
    structure = Game.getObjectById(creep.memory[options.containerId]);
  } 
  else {
    structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => (s.energy < s.energyCapacity
        || (s.store !== undefined ? s.store[RESOURCE_ENERGY] : 0) < s.storeCapacity)
        && _.includes(structureTypes, s.structureType)
    });
  }

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