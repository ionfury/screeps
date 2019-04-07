module.exports = {
  run: bindMemory
};

function bindMemory(self, options) {
  self.say('💭');
  let addr = options.addr || null;
  let expr = options.expr || null;

  self.memory[addr] = expr(self);
}