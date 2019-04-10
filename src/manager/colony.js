let bus = require('messaging.bus');

module.exports = {
  run: (colony) => {
    init(colony);

    bus.bind(`colony/${colony.name}/addSource`, bindRemoteRoom, {self:colony});

  }
}

// Initalize all accessed memory structures in this colony
function init(colony) {
  if(!Memory.colony) Memory.colony = {};
  if(!Memory.colony[colony.name]) {
    console.log(`Initalizing memory for colony ${colony.name}`);
    Memory.colony[colony.name] = {}
  };
}

function bindRemoteRoom(message, options) {
  if(!Memory.colony.remoteRooms) Memory.colony.remoteHarvestingRooms = [];

  Memory.colony.remoteHarvestingRooms.push(message.roomName);
}