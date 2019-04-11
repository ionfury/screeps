let bus = require('messaging.bus');
let process = require('system.process');

const PRIORITY = 10;
const PROCESS_NAME = 'Colony.Run';

const nonDefenseDamagedStructure = s => 
  s.structureType != STRUCTURE_WALL
  && s.structureType != STRUCTURE_CONTROLLER
  && s.structureType != STRUCTURE_RAMPART
  && s.hits < s.hitsMax - 100;

module.exports = {
  tasks: () => {
    let processes = [];

    for(let t in Game.rooms) {
      let room = Game.rooms[t];
      if(room.controller && room.controller.my) {
        processes.push(process(PROCESS_NAME, PRIORITY, () => handle(room)));
      }
    }

    return processes;
  }
}

function handle(colony) {
  init(colony);
  publishRepair(colony, nonDefenseDamagedStructure);
}

// Initalize all accessed memory structures in this colony
function init(colony) {
  if(!Memory.colony) Memory.colony = {};
  if(!Memory.colony[colony.name]) {
    console.log(`Initalizing memory for colony ${colony.name}`);
    Memory.colony[colony.name] = {}
  };
}

function publishHostiles(colony) {
  let hostiles = colony.room.find(FIND_HOSTILE_CREEPS);

  holstiles.forEach(hostile => bus.publish(`colony/${colony.name}/hostiles`,{target:hostile.id}));
}


function publishRepair(colony, filter) {
  let name = `colony/${colony.name}/repair`;
  if(bus.length(name) < 10) {
    let structures = colony.find(FIND_STRUCTURES, {
      filter: filter
    });
    structures.forEach(s => {
      console.log(colony.name, s.id, s.hits, s.hitsMax)
      bus.publish(`colony/${colony.name}/repair`,{target:s.id})

    });
  }
}

/*
function bindRemoteRoom(context, options) {
  if(!Memory.colony[options.self.name].remoteRooms) Memory.colony[options.self.name].remoteRooms = [];

  Memory.colony[options.self.name].remoteRooms.push(context.message.name);
}
*/