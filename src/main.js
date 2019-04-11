let os = require('system.os');
let stats = require('stats.grafana');

let commands = require('commands.setup');

let utils = require('constant.utilities');
const profiler = require('profiler');

profiler.enable();
module.exports.loop = function () {
  profiler.gather();
  commands.enable();
  profiler.wrap(() => {
    utils.cleanMemory();
    os.run();
    stats.gather();
  });
  profiler.export();
}