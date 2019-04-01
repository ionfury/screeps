module.exports = {
  run: explore
}

function explore(self, options) {
  initMemory();

  self.moveTo(self.room.controller);

  if(Memory.explore.sources[self.room.name] == undefined) {
    
    Memory.explore.sources[self.room.name] = self.room.find(FIND_SOURCES).map(s => s.id);
  }

  self.memory.target = undefined;
}

function initMemory() {
  if(Memory.explore == undefined) {
    Memory.explore = {};
  }

  if(Memory.explore.sources == undefined) {
    Memory.explore.sources = {};
  }
}