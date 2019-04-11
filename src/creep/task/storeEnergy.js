module.exports = {
  run: storeEnergy
}

function storeEnergy(creep, options) {
  creep.say('⚡');
  let structureTypes = options.structureTypes || [STRUCTURE_SPAWN];
  let container;

  if(options.containerId) {
    container = Game.getObjectById(creep.memory[options.containerId]);
  }
  else {
    
    let c = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => (s.energy < s.energyCapacity
        || (s.store !== undefined ? s.store[RESOURCE_ENERGY] : 0) < s.storeCapacity)
        && _.includes(structureTypes, s.structureType)
    });
    /*
    let containers = creep.room.find(FIND_STRUCTURES, {
      filter: s => _.includes(structureTypes, s.structureType)
    });

    let filteredContainers = _.filter(containers, container => 
      container.energy < container.energyCapacity
      || (container.store !== undefined ? container.store[RESOURCE_ENERGY] : 0) < container.storeCapacity);
    
    if(filteredContainers.length > 0)
    {
      c = _.min(filteredContainers, container => creep.pos.getRangeTo(container));
    }
*/
    if(c != undefined) {
      container = c;
    }
  }

  if(container != undefined) {
    let code = creep.transfer(container, RESOURCE_ENERGY);
    
    switch(code){
      case ERR_NOT_IN_RANGE:
        creep.moveTo(container, {reusePath:25});
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        break;
      case ERR_INVALID_TARGET:
        break;
    }
  }
}
/*
function taskStoreEnergy(creep, options) {
  let structureTypes = options.structureTypes || [STRUCTURE_SPAWN];

  if(options.containerId) {
    creep.memory.structureCache = creep.memory[options.containerId];
  } 
  else {
    let c = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => (s.energy < s.energyCapacity
        || (s.store !== undefined ? s.store[RESOURCE_ENERGY] : 0) < s.storeCapacity)
        && _.includes(structureTypes, s.structureType)
    });

    if(c != undefined) {
      creep.memory.structureCache = c.id;
    }
  }

  let structure = Game.getObjectById(creep.memory.structureCache)
  if(structure != undefined) {
    let code = creep.transfer(structure, RESOURCE_ENERGY);
    
    switch(code){
      case ERR_NOT_IN_RANGE:
        creep.moveTo(structure);
        break;
      case ERR_NOT_ENOUGH_RESOURCES:
        creep.memory.structureCache = null;
        break;
      case ERR_INVALID_TARGET:
        creep.memory.structureCache = null;
        break;
    }
  }
}*/