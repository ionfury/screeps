module.exports = {
  run: build
}

function build(self, options) {
  if(options.buildId) {
    self.memory.buildTarget = self.memory[options.buildId];
  }

  if(self.memory.buildTarget == undefined) {
    let site = self.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    if(site != undefined) {
      self.memory.buildTarget = site.id;
    }
  }

  let site = Game.getObjectById(self.memory.buildTarget);
  if(site != undefined) {
    
    let code = self.build(site);

    switch(code) {
      case ERR_NOT_IN_RANGE:
        self.moveTo(site);
        break;
      case ERR_INVALID_TARGET:
        self.memory.buildTarget = undefined;
        if(options.buildId) {
          self.memory[options.buildId] = undefined;
        }
        break;
    }
  }
  else {
    self.memory.buildTarget = undefined;
    if(options.buildId) {
      self.memory[options.buildId] = undefined;
    }
  }
}