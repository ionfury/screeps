let bus = require('messaging.bus');

const myControllers = (s) => s.structureType == STRUCTURE_CONTROLLER && s.my;

module.exports = {
  run: run
};


function run() {
  console.log('managing empire')

}
/*
function getMemoryRoomSources(key) {
  console.log('sources', Memory.explore.sources[key]);
  // find first order 
}


function getSource(sourceId) 


function adjRoomNames(name) {
  let exits = Game.map.describeExits(name);
  let names = [];

  _.forEach(['1', '3', '5', '7'], i => {
    if(exits[i] != undefined)
      names.push(exits[i]);
  });

  return names;
}*/