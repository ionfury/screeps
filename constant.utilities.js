module.exports = {
  setDefaults: setDefaults,
  cost: cost
}

function setDefaults(options, defaults) {
  return _.defaults({}, _.clone(options), defaults);
}

function cost(body){
  return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
}