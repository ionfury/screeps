module.exports = {
  run: salvage
}

function salvage(self, options) {
  let droppedEnergy = self.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
    filter: e => e.resourceType == RESOURCE_ENERGY
  });

  if(self.pickup(droppedEnergy == ERR_NOT_IN_RANGE) {
    self.moveTo(droppedEnergy);
  }
}