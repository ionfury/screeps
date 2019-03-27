class Task {
  constructor(name, options) {
    this.name = name;
    this.options = options;
    this._when = () => true;
    this._until = () => false;
  }

  execute(creep, options){}

  when(fn) {
    this._when = fn;
    return this;
  }
  
  until(fn) {
    this._until = fn;
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