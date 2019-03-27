let logger = require('constant.logger');
let navigation = require('constant.navigation');
let Pos = navigation.pos;

module.exports = {
  run: plan
}

function plan(room) {
  planContainersForSources(room);
  planExtensions(room);
}

function planExtensions(room) {
  let max = maxExtensions(room);
  let cur = room.find(FIND_MY_STRUCTURES, {
    filter: o=>o.structureType==STRUCTURE_EXTENSION
  });

  if(max == cur) return;


  let pos = new Pos().from(room.find(FIND_MY_SPAWNS)[0].pos);

  let searchQueue = [];
  pushAdjacent(pos, searchQueue);
  
  let breakout = 0;
  while(extensions(room) < max && breakout<100) {
    breakout++;
    let build = searchQueue.shift();
    let code = room.createConstructionSite(build.x, build.y, STRUCTURE_EXTENSION);
    if(code == OK)
      break;
      
    pushAdjacent(build, searchQueue);
  }
  if(breakout > 90) {
    console.log('oh shit')
  }
}

function maxExtensions(room) {
  let ret = 0;
  switch(room.controller.level) {
    case 0:
      ret = 0;
      break;
    case 1:
      ret = 0;
      break;
    case 2:
      ret = 5;
      break;
    case 3:
      ret = 10;
      break;
    case 4:
      ret = 20;
      break;
    case 5:
      ret = 30;
      break;
    case 6:
      ret = 40;
      break;
    case 7:
      ret = 50;
      break;
    case 8:
      ret = 60;
      break;
  }
  return ret;
}

function extensions(room){
  let structs = room.find(FIND_STRUCTURES, {
    filter: o=>o.structureType==STRUCTURE_EXTENSION
  });
  let sites = room.find(FIND_CONSTRUCTION_SITES, {
    filter: o=>o.structureType==STRUCTURE_EXTENSION
  });

  return structs.length + sites.length;
}

function pushAdjacent(pos, queue) {
  queue.push(new Pos().from(pos).step('nw'));
  queue.push(new Pos().from(pos).step('ne'));
  queue.push(new Pos().from(pos).step('se'));
  queue.push(new Pos().from(pos).step('nw'));
}

function planContainersForSources(room) {
  if(room.memory.sourceContainerPlanned == undefined) {
    room.memory.sourceContainerPlanned = {};
  }

  let sources = room.find(FIND_SOURCES);
  
  sources.forEach(source => {
    if(room.memory.sourceContainerPlanned[source.id]) return;

    let possible = [
      new Pos().from(source.pos).step('n',2),
      new Pos().from(source.pos).step('ne',2),
      new Pos().from(source.pos).step('e',2),
      new Pos().from(source.pos).step('se',2),
      new Pos().from(source.pos).step('s',2),
      new Pos().from(source.pos).step('sw',2),
      new Pos().from(source.pos).step('w',2),
      new Pos().from(source.pos).step('nw',2)
    ];

    let open = possible.find(p => {
      let struct = room.lookForAt(LOOK_STRUCTURES, p.x, p.y);
      let terrain = room.lookForAt(LOOK_TERRAIN, p.x, p.y);
      let sites = room.lookForAt(LOOK_CONSTRUCTION_SITES, p.x, p.y);
      
      return !!struct && !!sites && terrain == 'plain';
    });

    let code = room.createConstructionSite(open.x, open.y, STRUCTURE_CONTAINER);
    
    switch(code) {
      case OK:
        logger.notify(`Building Container @ ${open}.`);
        room.memory.sourceContainerPlanned[source.id] = true;
        break;
      default:
        logger.notify(`${room.name}: Cannot place container @ ${open}:`, {code: code});
        break;
    }
  });
}