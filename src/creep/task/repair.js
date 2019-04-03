module.exports = {
  run: repair
}

function repair(self, options) {
  let repair;

  if(options.repairId) {
    repair = Game.getObjectById(self.memory[options.repairId]);
  }
  else {
    repair = self.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: o => options.types.includes(o.structureType) && (o.hits < o.hitsMax / 3)
    });
  }

  if(repair) {
    let code = self.repair(repair)
    if(code == ERR_NOT_IN_RANGE) {
      self.moveTo(repair);
    }
  }
}