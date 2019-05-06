const winston        = require('winston'),
      util           = require('util');

Object.defineProperty(global, '__stack__', {
get: function() {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack) {
      return stack;
    };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line__', {
get: function() {
    return __stack__[2].getLineNumber();
  }
});

Object.defineProperty(global, '__function__', {
get: function() {
    return __stack__[2].getFunctionName();
  }
});

Object.defineProperty(global, '__file__', {
get: function() {
    return __stack__[2].getFileName();
  }
});

module.exports = (_args) => {
  const __log = new (winston.Logger)(_args);
  return {
    error: (..._args) => {
      _args[0] = util.format("[file:%s][function:%s][line:%s]", __file__, __function__, __line__) + _args[0]
      __log.error.apply(null, _args);
    },
    warn: (..._args) => {
      _args[0] = util.format("[file:%s][function:%s][line:%s]", __file__, __function__, __line__) + _args[0]
      __log.warn.apply(null, _args);
    },
    info: (..._args) => {
      _args[0] = util.format("[file:%s][function:%s][line:%s]", __file__,  __function__, __line__) + _args[0]
      __log.info.apply(null, _args);
    },
    verbose: (..._args) => {
      _args[0] = util.format("[file:%s][function:%s][line:%s]", __file__,  __function__, __line__) + _args[0]
      __log.verbose.apply(null, _args);
    },
    debug: (..._args) => {
      _args[0] = util.format("[function:%s][line:%s]", __function__, __line__) + _args[0]
      __log.debug.apply(null, _args);
    },
    silly: (..._args) => {
      _args[0] = util.format("[function:%s][line:%s]", __function__, __line__) + _args[0]
      __log.silly.apply(null, _args);
    },
  };
};

