let roads = require('constant.roads');

module.exports = {
  enable: enable
}

function enable() {
  Game.commands = {
    hello() {
      console.log("hello world!");
    },
    buildRoads(from, to, commit = false) {
      try {
        console.log('building roads', from, 'to', to);
        roads.build(from,to,commit);
      }
      catch (ex) {
        console.log(ex.message, ex.stack);
      }
    }
  }
}