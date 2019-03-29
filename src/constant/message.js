const messages = [
  message(OK, 'OK','The operation has been scheduled successfully.'),
  message(ERR_NOT_OWNER, 'ERR_NOT_OWNER', 'You are not the owner of this spawn.'),
  message(ERR_NAME_EXISTS, 'ERR_NAME_EXISTS', 'There is a creep with the same name already.'),
  message(ERR_BUSY, 'ERR_BUSY', 'The unit is already in process of doing something else.'),
  message(ERR_NOT_ENOUGH_ENERGY, 'ERR_NOT_ENOUGH_ENERGY', 'The spawn and its extensions contain not enough energy to create a creep with the given body.'),
  message(ERR_INVALID_ARGS, 'ERR_INVALID_ARGS', 'Body is not properly described or name was not provided.'),
  message(ERR_RCL_NOT_ENOUGH, 'ERR_RCL_NOT_ENOUGH', 'Your Room Controller level is insufficient to use this spawn.')
]

module.exports = {
  all: () => messages,
  find: (key) => messages.find(m => m.key === key) || message(`${key}_NOT_FOUND`, `${key} not found.`)
}

function message(key, code, message) {
  return {key:key, code:code, message:message};
}