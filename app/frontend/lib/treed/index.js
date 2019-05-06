var DefaultNode = require("default_node");
var Controller  = require("controller");
var util        = require("util");

Listed = function(id, ids, node, options) {
  this.o = util.extend({
    node: DefaultNode
  }, options)
  this.ctrl = new Controller(id, ids)
  node.appendChild(this.ctrl.node)
}

module.exports = Listed;
