module.exports = {
  build: build
}

function build(from, to, commit = false, pathOptions = {}) {
  let path = PathFinder.search(from.pos, to.pos, pathOptions).path;
  let roomPaths = _.groupBy(path, p => p.roomName);

  
  _.forEach(Object.getOwnPropertyNames(roomPaths), roomName => {
    let roomPath = roomPaths[roomName];
    let room = Game.rooms[roomName];
    if(commit) {
      if(room) {
        roomPath.forEach(p => room.createConstructionSite(p.x, p.y, STRUCTURE_ROAD));
      }
      else {
        console.log(`Cannot build roads in room ${roomName}: room not visible`);
      }
    }
    else {
      new RoomVisual(roomName).poly(roomPath, {stroke: 'red'});
    }
  });
}