class Role {
  constructor() {
  }

  design(energy){
    return [WORK,CARRY,MOVE];
  }

  tasks(){
    return [];
  }

  remember(memory){
    return {
      memory: Object.assign(memory, {role:this.name})
    };
  }

  spawn(options) {
    return false;
  }
}