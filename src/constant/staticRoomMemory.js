module.exports = {
  save: save,
  exists: exists,
  get: get
}

function save(room) {
  if(Memory.StaticRoomMemory == undefined) {
    Memory.StaticRoomMemory = {};
  }

  let sources = room.find(FIND_SOURCES).map(s => {
    return {
      id: s.id,
      pos: {
        x: s.pos.x,
        y: s.pos.y,
        roomName: s.pos.roomName
      }
    }
  });
  
  Memory.StaticRoomMemory[room.name] = {
    id: room.id,
  //  owner: room.controller.owner,
    sources: sources
  };
}

function exists(room) {
  return Memory.StaticRoomMemory[room.name] == undefined;
}

function get(roomName) {
  return Memory.StaticRoomMemory[roomName];
}