module.exports = {
  run: taskGetEnergy
}

function taskGetEnergy(self, options) {
  let useContainer = options.useContainer || false;
  let useSource = options.useSource || true;
  let sourceId = options.source || false;
  let containerId = options.container || false;
  let structureTypes = options.structureTypes || [STRUCTURE_STORAGE,STRUCTURE_CONTAINER];
  let container;  

  let targetSource = self.memory[sourceId];
  
  if(useContainer) {
    if(containerId) {
      self.memory.getEnergyContainer = self.memory[containerId];
    }

    if(self.memory.getEnergyContainer == undefined) {
      let c = self.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => _.includes(structureTypes, s.structureType)
          && s.store[RESOURCE_ENERGY] > 0
      });
  
      if(c != undefined) {
        self.memory.getEnergyContainer = c.id;
      }
    }
  
    container = Game.getObjectById(self.memory.getEnergyContainer);
    if(container != undefined) {
      let code = self.withdraw(container, RESOURCE_ENERGY);
  
      switch(code) {
        case ERR_NOT_IN_RANGE:
          self.moveTo(container);
          break;
        case ERR_NOT_ENOUGH_RESOURCES:
          self.memory.getEnergyContainer = null;
          break;
        case ERR_INVALID_TARGET:
          self.memory.getEnergyContainer = null;
          break;
      }
    }
  }

  if(container == undefined && useSource) {
    if(targetSource) {
      let source = Game.getObjectById(targetSource);

      let code = self.harvest(source);
      switch(code) {
        case ERR_NOT_IN_RANGE:
          self.moveTo(source);
          break;
      }
    } 
    else {
      let source = self.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    
      let code = self.harvest(source);
      switch(code) {
        case ERR_NOT_IN_RANGE:
          self.moveTo(source);
          break;
      }
    }  
  }
}