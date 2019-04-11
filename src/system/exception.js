module.exports = {
  handle: handle
}

function handle(fn, abort) {
  return () => {
    try {
      return fn.apply(this,arguments);
    }
    catch (err) {
      console.log(err.message, err.trace);
      return abort.apply(this,arguments);
    }
  }
}