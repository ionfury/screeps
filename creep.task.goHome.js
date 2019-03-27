module.exports = {
  run: goHome
}

function goHome(self, options) {
  let home = Game.getObjectById(self.memory.spawnId).room;
  
  let route = Game.map.findRoute(self.room, home);

  if(route.length > 0) {
    let exit = self.pos.FindClosestByRange(route[0].exit);
    self.moveTo(exit);
  }
}