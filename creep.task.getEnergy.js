module.exports = {
  run: taskGetEnergy
}

function taskGetEnergy(self, options) {
  let useContainer = options.useContainer || false;
  let useSource = options.useSource || true;
  let sourceId = options.source || false;
  let container;  
  
  if(useContainer) {
    container = self.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => (
        s.structureType == STRUCTURE_CONTAINER 
        || s.structureType == STRUCTURE_STORAGE) 
        && s.store[RESOURCE_ENERGY] > 0
    });
    
    if (container != undefined) {
      if (self.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        self.moveTo(container);
      }
    }
  }
  
  if(container == undefined && useSource) {
    if(sourceId) {
      let source = Game.getObjectById(sourceId);

      if(self.harvest(source) == ERR_NOT_IN_RANGE) {
        self.moveTo(source);
      }

    } else {
      let source = self.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    
      if(self.harvest(source) == ERR_NOT_IN_RANGE) {
        self.moveTo(source);
      }
    }  
  }
}