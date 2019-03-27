module.exports = {
  run: goToRoom
}

function goToRoom(self, options) {
  let route = Game.map.findRoute(self.room.name, self.memory[options.destination]);

  if(route.length > 0) {
    let exit = self.pos.findClosestByRange(route[0].exit);
    self.moveTo(exit);  
  }
}