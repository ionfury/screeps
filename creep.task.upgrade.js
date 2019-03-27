module.exports = {
  run: upgrade
}

function upgrade(creep, options) {
  switch(creep.upgradeController(creep.room.controller)){
    case ERR_NOT_IN_RANGE:
      creep.moveTo(creep.room.controller);
      break;
  }
}
