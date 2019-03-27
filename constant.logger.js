let messages = require('constant.message');
let utilities = require('constant.utilities');

module.exports = {
  notify: notify,
  inspect: (o) => {
      console.log(JSON.stringify(o, null, 4));
  }
}

function notify(message, options) {
  let defaults = {
    code: false,
    write: true
  };

  options = utilities.setDefaults(options, defaults)

  if(!options.write) return;

  if(options.code) {
    let x = messages.find(options.code);
    if(x!=undefined) message += `(${x.code}) ${x.message}`;
  }

  console.log(message);
}