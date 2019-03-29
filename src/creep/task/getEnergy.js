module.exports = {
  run: taskGetEnergy
}

function getFullestContainer(self, containerTypes) {
  return self.room
    .find(FIND_STRUCTURES, {
      filter: s => containerTypes.includes(s)
        && s.store[RESOURCE_ENERGY] > 0
    })
    .sort((a, b) => a.store[RESOURCE_ENERGY] < b.store[RESOURCE_ENERGY])
    [0];
}

function getClosestContainer(self, containerTypes) {
  return self.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: s => containerTypes.includes(s)
      && s.store[RESOURCE_ENERGY] > 0
  });
}

function taskGetEnergy(self, options) {
  let useContainer = options.useContainer || false;
  let useSource = options.useSource || true;
  let sourceId = options.source || false;
  let priority = options.priority || 'closest';
  let containerTypes = options.containerTypes || [STRUCTURE_CONTAINER];
  let container;  
  
  let targetSource = self.memory[sourceId];
  
  if(useContainer) {
    let container;

    if(priority == 'fullest') {
      container = getFullestContainer(self, containerTypes);
    } else {
      container = getClosestContainer(self, containerTypes);
    }

    if (container != undefined) {
      if (self.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        self.moveTo(container);
      }
    }
  }
  
  if(container == undefined && useSource) {
    if(targetSource) {
      let source = Game.getObjectById(targetSource);

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