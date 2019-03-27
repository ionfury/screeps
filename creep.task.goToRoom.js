module.exports = {
  run: goToRoom
}

function goToRoom(self, options) {
  let dest = Game.rooms[self.memory[options.destination]];

  let route = Game.map.findRoute(self.room, dest);

  if(route.length > 0) {
    let exit = self.pos.findClosestByRange(route[0].exit);
    self.moveTo(exit);  
  }
}