module.exports = {
  run: goToRoom
}

function goToRoom(self, options) {
  self.say('🚐');
  self.heal(self);

  let code = self.moveTo(new RoomPosition(15, 15, self.memory[options.destination]), 
    {
      reusePath:25,
      visualizePathStyle: {stroke: 'red'}
    });
  /*let route = Game.map.findRoute(self.room.name, self.memory[options.destination]);

  if(route.length > 0) {
    let exit = self.pos.findClosestByRange(route[0].exit);
    self.moveTo(exit, {reusePath: 25});  
  } else {
    self.moveTo(self.room.controller, {reusePath: 25});
  }*/
}