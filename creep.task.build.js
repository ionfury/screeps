module.exports = {
  run: build
}

function build(self, options) {
  if(self.memory.target == undefined) {
    let site = self.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    if(site != undefined) {
      self.memory.target = site.id;
    }
  }

  let site = Game.getObjectById(self.memory.target);
  if(site != undefined) {
    let code = self.build(site);
    switch(code) {
      case ERR_NOT_IN_RANGE:
        self.moveTo(site);
        break;
      case ERR_INVALID_TARGET:
        self.memory.target = null;
    }
  }
  else {
    self.memory.target = undefined;
  }
}