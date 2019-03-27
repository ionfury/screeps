module.exports = {
  run: repair
}

function repair(self, options) {
  let repair = self.pos.findClosest(FIND_STRUCTURES, {
    filter: o => o.structureType === STRUCTURE_ROAD && (o.hits > o.hitsMax / 3)
  });

  if(repair) {
    self.moveTo(repair);
    self.repair(repair);
  }
}