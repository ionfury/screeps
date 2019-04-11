const profiler = require('profiler');
const exception = require('system.exception');
const UUID = () => Math.random().toString(26).slice(2);

module.exports = (name, priority, task, abort = () => console.log('Abort!')) => {
  return {
    id: UUID(),
    name: name,
    priority: priority,
    run: profiler.registerFN(exception.handle(task, abort), name)
  }
}