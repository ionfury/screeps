module.exports = {
  run: claim
}

function claim(self, options) {
  if(self.claimController(self.room.controller) ==  ERR_NOT_IN_RANGE) {
    self.moveTo(self.room.controller);
  }
}