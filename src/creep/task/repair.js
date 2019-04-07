module.exports = {
  run: repair
}

function repair(self, options) {
  self.say('🛠️')
  let repair;

  if(options.repairId) {
    repair = Game.getObjectById(self.memory[options.repairId]);
  }
  else {
    repair = self.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: s => s.hits < s.hitsMax/2
    });
  }

  if(repair) {
    let code = self.repair(repair)
    if(code == ERR_NOT_IN_RANGE) {
      self.moveTo(repair);
    }
  }
}