module.exports = {
  run: repair
}

function repair(self, options) {
  let repair = self.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: o => (o.hits < o.hitsMax / 3)
  });

  if(repair) {
    let code = self.repair(repair)
    if(code == ERR_NOT_IN_RANGE) {
      self.moveTo(repair);
    }
  }
}