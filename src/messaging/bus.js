let BUS = {};

const ADDR = (name) => `queues/${name}`;

module.exports = {
  init: init,
  teardown: teardown,
  publish: publish,
  listen: listen,
  search: search,
  bind: bind
};

function init() {
  if(!Memory.bus) {
    Memory.bus = {};
  }

  BUS = Memory.bus;
}

function publish(queueName, message) {
  pushQueue(queueName, message);
}

function startQueue(queueName, len = 30) {
  BUS[ADDR(queueName)] = {
    length: len,
    queue: []
  };
}

function pushQueue(queueName, message) {
  if(!BUS[ADDR(queueName)]) startQueue(queueName);

  if(BUS[ADDR(queueName)].queue.length > BUS[ADDR(queueName)].length) {
    let lost = BUS[ADDR(queueName)].queue.pop();
    console.log(`ERR Queue: ${queueName} overflow!  Dropping message: ${lost}`);
  }

  BUS[ADDR(queueName)].queue.push(message);
}

function listen(queueName) {
  if(!BUS[ADDR(queueName)]) {
    console.log(`ERR Queue: ${queueName} does not exist!`);
    return;
  }
  if(BUS[ADDR(queueName)].queue.length > 0) {
    return BUS[ADDR(queueName)].queue.shift();
  }
}

function bind(queueName, callback, options = {}) {
  if(!BUS[ADDR(queueName)]) startQueue(queueName);
  let msg = listen(queueName);

  return callback(msg, options);
}

function search(queueName) {
  
}

function teardown() {
  Memory.bus = BUS;
}