class Task {
  constructor(id, name, options) {
    this.id = id;
    this.name = name;
    this.options = options;
    this._when = () => false;
    this._until = () => true;
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