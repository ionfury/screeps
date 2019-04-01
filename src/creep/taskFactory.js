class TaskFactory {
  constructor() {
    this._taskCache = {};
  }

  create(taskName) {
    if(this._taskCache[taskName] == undefined) {
      let task = require(`creep.task.${taskName}`);
      this._taskCache[taskName] = new TaskExecution(taskName, task.run);
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