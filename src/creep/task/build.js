module.exports = {
  run: build
}

function build(self, options = {}) {
  let buildFilter = options.buildFilter || ((s) => true);
  let site;

  self.say('⚒️')
  if(options.buildId) {
    site = Game.getObjectById(self.memory[options.buildId]);
  }

  if(site == undefined) {
    site = self.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
      filter: buildFilter
    });
  }
  
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
    if(options.buildId) {
      self.memory[options.buildId] = undefined;
    }
  }
}