let Task = require('task');
let Designer = require('constant.creepDesigner');

// My role
const CREEP_ROLE = 'containerHarvester';

// Constructed memory locations
const SOURCE_ROOM_NAME_ADDR = 'sourceRoom';
const SOURCE_ID_MEM_ADDR = 'sourceId';

// Dynamic memory locations
const CONTAINER_ID_MEM_ADDR = 'containerId';
const CONTAINER_CONST_ID_MEM_ADDR = 'constId';

// Constants
const BIND_STRUCTURE_TYPES = [STRUCTURE_CONTAINER, STRUCTURE_LINK];
const BIND_CONTAINER_CONSTRUCTION_EXPR = (c) => 
  c.pos.findInRange(FIND_CONSTRUCTION_SITES, {
    filter: s => _.includes(BIND_STRUCTURE_TYPES, s.structureType)
  }, 2)[0];
const BIND_CONTAINER_EXPR = (c) => 
  c.pos.findInRange(FIND_STRUCTURES, {
    filter: s => _.includes(BIND_STRUCTURE_TYPES, s.structureType)    
  }, 2)[0]
const OBJ = (id) => Game.getObjectById(id);
  
// Task definitions
let go = new Task(10, 'goToRoom', {destinationMemAddr: SOURCE_ROOM_NAME_ADDR})
  .while(s => s.room.name != s.memory[SOURCE_ROOM_NAME_ADDR]);

let harvest = new Task(20, 'harvestBoundSource', {sourceIdMemAddr: SOURCE_ID_MEM_ADDR})
  .while(c => c.carry.energy < c.carryCapacity);

let build = new Task(30, 'build', {cachedIdMemAddr: CONTAINER_CONST_ID_MEM_ADDR})
  .while(c => 
    c.memory[CONTAINER_CONST_ID_MEM_ADDR] != undefined
    && c.carry.energy > 0);

let repair = new Task(40, 'repair', {cachedIdMemAddr: CONTAINER_ID_MEM_ADDR})
  .when(c => 
    c.memory[CONTAINER_ID_MEM_ADDR] != undefined
    && c.carry.energy > 0
    && OBJ(c.memory[CONTAINER_ID_MEM_ADDR]).hits < OBJ(c.memory[CONTAINER_ID_MEM_ADDR]).maxHits / 2)
  .until(c =>
    c.carry.energy == 0
    || OBJ(c.memory[CONTAINER_ID_MEM_ADDR]).hits == OBJ(c.memory[CONTAINER_ID_MEM_ADDR]).maxHits / 2);

let store = new Task(50, 'store', {cachedIdMemAddr: CONTAINER_ID_MEM_ADDR})
  .while(c => 
    c.memory[CONTAINER_ID_MEM_ADDR] != undefined 
    && c.carry.energy > 0)
 
let bindConstruction = new Task(30, 'bindMemory', {
    addr: CONTAINER_CONST_ID_MEM_ADDR,
    expr: BIND_CONTAINER_CONSTRUCTION_EXPR
  })
  .when(c => c.memory[CONTAINER_ID_MEM_ADDR] == undefined
    && c.memory[CONTAINER_CONST_ID_MEM_ADDR] == undefined
    && BIND_CONTAINER_CONSTRUCTION_EXPR(c));

let bindContainer = new Task(50, 'bindMemory', { 
    addr: CONTAINER_ID_MEM_ADDR, 
    expr: BIND_CONTAINER_EXPR
  })
  .when(c => c.memory[CONTAINER_ID_MEM_ADDR] == undefined
    && c.memory[CONTAINER_CONST_ID_MEM_ADDR] == undefined
    && BIND_CONTAINER_EXPR(c));

function remember(options) {
  let spawn = OBJ(options.spawnId);
  let unboundSource = getUnboundSourceNear(spawn);
  
  let opts = { memory: {
    role: CREEP_ROLE,
    spawnId: options.spawnId
  }}
  opts.memory[SOURCE_ID_MEM_ADDR] = unboundSource.id;
  opts.memory[SOURCE_ROOM_NAME_ADDR] = unboundSource.roomName
  
  return opts;
}

function spawn(options) {
  let spawn = OBJ(options.spawnId);
  let unboundSource = getUnboundSourceNear(spawn);

  return unboundSource != null;
}

function body(budget) {
  return Designer.design(
    {move:1,carry:1,work:2},
    {move:1,carry:1,work:7},
    budget
  );
}

module.exports = {
  name: CREEP_ROLE,
  body: body,
  tasks: [go, harvest, build, repair, store, bindConstruction, bindContainer],
  options: remember,
  spawn: spawn
}

// Misc functions
function getUnboundSourceNear(spawn) {
  console.log('here')

}