class Task {
  constructor(name, options) {
    this.name = name;
    this.options = options;
    this._when = () => true;
    this._until = () => false;
  }

  when(fn) {
    this._when = fn;
    return this;
  }
  
  until(fn) {
    this._until = fn;
    return this;
  }

  while(fn) {
    this._when = fn;
    this._until = (args => !fn(args))
    return this;
  }
  
  end(creep) {
    return this._until(creep);
  }
  
  ready(creep) {
    return this._when(creep);
  }
}
module.exports = Task;
