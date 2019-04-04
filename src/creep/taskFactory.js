const profiler = require('profiler');

class TaskFactory {
  constructor() {
    this._taskCache = {};
  }

  create(taskName) {
    if(this._taskCache[taskName] == undefined) {
      let task = require(`creep.task.${taskName}`);
      let fn = profiler.registerFN(task.run, taskName);
      this._taskCache[taskName] = new TaskExecution(taskName, fn);
    }

    return this._taskCache[taskName];
  }
}
class TaskExecution {
  constructor(name, run) {
    this.name = name;
    this.run = run;
  }
}

module.exports = TaskFactory;