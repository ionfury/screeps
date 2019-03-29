module.exports = {
  setDefaults: setDefaults,
  cost: cost,
  cleanMemory: cleanMemory
}

function setDefaults(options, defaults) {
  return _.defaults({}, _.clone(options), defaults);
}

function cost(body){
  return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
}

function cleanMemory(){
  for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
  }
}