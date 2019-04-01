module.exports = {
  log: log,
  report: report
}

const LOG_SIZE = 30;

function log(task, cpu) {
  if(Memory.performance == undefined)
    Memory.performance = {};
  
  if(Memory.performance.log == undefined) 
    Memory.performance.log = {};

  if(Memory.performance.log[task] == undefined)
    Memory.performance.log[task] = [];

  if(Memory.performance.log[task].length > LOG_SIZE)
    Memory.performance.log[task].shift();

  Memory.performance.log[task].push(cpu);
}

function report() {
  console.log('avg task performance:')
  for(let task in Memory.performance.log) {
    let arr = Memory.performance.log[task];
    let sum = arr.reduce((a,b) => a+b);
    let avg = sum / arr.length;
    console.log(`  ${task}: ${avg} cpu`);
  }
}