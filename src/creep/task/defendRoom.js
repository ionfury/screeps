module.exports = {
  run: defend
}

function defend(self, options = {}) {
  let style={
    stroke: '#red',
    strokeWidth: .15
  }

  let hostiles = self.room.find(FIND_HOSTILE_CREEPS);

  if(hostiles.length > 0) {
    let myPos = self.pos;
    let hostilesByRange = hostiles.sort((a,b) => {
      let distA = Math.hypot(myPos.x - a.pos.x, myPos.y - a.pos.y);
      let distB = Math.hypot(myPos.x - b.pos.x, myPos.y - b.pos.y);
      return distA - distB;
    });
    let target = hostilesByRange[0];

    if(self.attack(target) == ERR_NOT_IN_RANGE) {
      self.moveTo(target,{visualizePathStyle:style});
      self.heal(self);
    }
  }
  else {

    let enemyStructures = _.filter(self.room.find(FIND_STRUCTURES), 
      s => s.my === false 
      && s.structureType !== STRUCTURE_CONTROLLER);
  
    if(enemyStructures.length) {
      let myPos = self.pos;
      let byRange = enemyStructures.sort((a, b) => {
        let distA = Math.hypot(myPos.x - a.pos.x, myPos.y - a.pos.y);
        let distB = Math.hypot(myPos.x - b.pos.x, myPos.y - b.pos.y);
        return distA - distB;
      });
      let structure = byRange[0];
      if (self.attack(structure) == ERR_NOT_IN_RANGE) {
        self.moveTo(structure,{visualizePathStyle:style});
        self.attack(structure);
      }
    }
    else {
      if(self.hits < self.hitsMax) {
        self.heal(self);
      }
      
      let container = self.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_CONTROLLER
      })[0];

      if(self.pos.getRangeTo(container) > 5) {
        self.moveTo(container);
      }
    }
  }
}