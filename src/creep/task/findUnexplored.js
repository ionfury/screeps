module.exports = {
  run: find
}

function find(self, options) {
  let exits = findRoomExits(self.room);

  exits.forEach(exit => {
    if(unexplored(exit)) {
      self.memory.target = exit;
      return;
    }
  });

  if(self.memory.target == undefined) {
    self.memory.target = exits[Game.time % exits.length];
  }
}

function unexplored(name) {
  return Memory.explore.sources[name] == undefined;
}

function findRoomExits(room) {
  let exits = Game.map.describeExits(room.name);

  let names = [];

  _.forEach(['1', '3', '5', '7'], i => {
    if(exits[i] != undefined)
      names.push(exits[i]);
  });


  return names;
}