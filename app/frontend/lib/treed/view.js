var DefaultNode   = require("default_node");
var DomViewLayer  = require("dom-vl");
var keys          = require("keys");
var util          = require("util");

function View(bindActions, model, ctrl, options) {
  options = options || {}
  this.selection = {}
  this.editing = false
  this.o = util.extend({
    node: DefaultNode,
  }, options)
  this.o.keybindings = util.merge(this.default_keys, options.keys)
  this.vl = new DomViewLayer(this.o)
  this.bindActions = bindActions
  this.model = model
  this.ctrl = ctrl
  this.attachListeners()
}

View.prototype = {
  initialize: function (root, ids) {
    var node = ids[root]
      , rootNode = this.vl.makeNode(root, node.data, this.bindActions(root))
    this.populateChildren(root, ids)
    this.root = root
    this.goTo(this.root)
    return rootNode
  },
  populateChildren: function (id, ids) {
    var node = ids[id]
    if (!node.children || !node.children.length) return
    for (var i=0; i<node.children.length; i++) {
      this.add(ids[node.children[i]], false, true)
      this.populateChildren(node.children[i], ids)
    }
  },
  goTo: function (id) {
    if (this.editing) {
      this.startEditing(id)
    } else {
      this.setSelection([id])
    }
  },

  default_keys: {
    'cut': 'ctrl x, delete',
    'copy': 'ctrl c',
    'paste': 'p, ctrl v',
    'toggle done': 'ctrl return',
    'edit': 'return, a, shift a, f2',
    'edit start': 'i, shift i',
    'first sibling': 'shift [',
    'last sibling': 'shift ]',
    'move to first sibling': 'shift alt [',
    'move to last sibling': 'shift alt ]',
    'new after': 'o',
    'new before': 'shift o',
    'up': 'up, k',
    'down': 'down, j',
    'left': 'left, h',
    'right': 'right, l',
    'next sibling': 'alt j, alt down',
    'prev sibling': 'alt k, alt up',
    'toggle collapse': 'z',
    'collapse': 'alt h, alt left',
    'uncollapse': 'alt l, alt right',
    'indent': 'tab, shift alt l, shift alt right',
    'dedent': 'shift tab, shift alt h, shift alt left',
    'move down': 'shift alt j, shift alt down',
    'move up': 'shift alt k, shift alt up',
    'undo': 'ctrl z, u',
    'redo': 'ctrl shift z, shift r',
  },

  actions: {
    'cut': function () {
      if (!this.selection.length) return
      this.ctrl.actions.cut(this.selection[0])
    },
    'copy': function () {
      if (!this.selection.length) return
      this.ctrl.actions.copy(this.selection[0])
    },
    'paste': function () {
      if (!this.selection.length) return
      this.ctrl.actions.paste(this.selection[0])
    },
    'undo': function () {
      this.ctrl.undo();
    },
    'redo': function () {
      this.ctrl.redo();
    },
    'edit': function () {
      if (!this.selection.length) {
        this.selection = [this.root]
      }
      this.vl.body(this.selection[0]).startEditing()
    },
    'edit start': function () {
      if (!this.selection.length) {
        this.selection = [this.root]
      }
      this.vl.body(this.selection[0]).startEditing(true)
    },
    // nav
    'first sibling': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      var first = this.model.firstSibling(this.selection[0])
      if (undefined === first) return
      this.setSelection([first])
    },
    'last sibling': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      var last = this.model.lastSibling(this.selection[0])
      if (undefined === last) return
      this.setSelection([last])
    },
    'up': function () {
      var selection = this.selection
      if (!selection.length) {
        this.setSelection([this.root])
      } else {
        var top = selection[0]
          , above = this.model.idAbove(top)
        if (above === undefined) above = top
        this.setSelection([above])
      }
    },
    'down': function () {
      var selection = this.selection
      if (!selection.length) {
        this.setSelection([this.root])
      } else {
        var top = selection[0]
          , above = this.model.idBelow(top)
        if (above === undefined) above = top
        this.setSelection([above])
      }
    },
    'left': function () {
      var selection = this.selection
      if (!selection.length) {
        return this.setSelection([this.root])
      }
      var left = this.model.getParent(this.selection[0])
      if (undefined === left) return
      this.setSelection([left])
    },
    'right': function () {
      var selection = this.selection
      if (!selection.length) {
        return this.setSelection([this.root])
      }
      var right = this.model.getChild(this.selection[0])
      if (this.model.isCollapsed(this.selection[0])) return
      if (undefined === right) return
      this.setSelection([right])
    },
    'next sibling': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      var sib = this.model.nextSibling(this.selection[0])
      if (undefined === sib) return
      this.setSelection([sib])
    },
    'prev sibling': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      var sib = this.model.prevSibling(this.selection[0])
      if (undefined === sib) return
      this.setSelection([sib])
    },
    'move to first sibling': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      this.ctrl.actions.moveToTop(this.selection[0])
    },
    'move to last sibling': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      this.ctrl.actions.moveToBottom(this.selection[0])
    },
    'new before': function () {
      if (!this.selection.length) return
      this.ctrl.addBefore(this.selection[0])
      this.startEditing()
    },
    'new after': function () {
      if (!this.selection.length) return
      this.ctrl.addAfter(this.selection[0])
      this.startEditing(this.selection[0])
    },
    // movez!
    'toggle done': function () {
      if (!this.selection.length) return
      var id = this.selection[0]
        , done = !this.model.ids[id].data.done
        , next = this.model.idBelow(id)
      if (next === undefined) next = id
      this.ctrl.actions.changed(this.selection[0], 'done', done)
      this.goTo(next)
    },
    'toggle collapse': function () {
      this.ctrl.actions.toggleCollapse(this.selection[0])
    },
    'collapse': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      this.ctrl.actions.toggleCollapse(this.selection[0], true)
    },
    'uncollapse': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      this.ctrl.actions.toggleCollapse(this.selection[0], false)
    },
    'indent': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      this.ctrl.actions.moveRight(this.selection[0])
    },
    'dedent': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      this.ctrl.actions.moveLeft(this.selection[0])
    },
    'move down': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      this.ctrl.actions.moveDown(this.selection[0])
    },
    'move up': function () {
      if (!this.selection.length) {
        return this.setSelection([this.root])
      }
      this.ctrl.actions.moveUp(this.selection[0])
    }
  },

  attachListeners: function () {
    var actions = {}
    for (var name in this.o.keybindings) {
      actions[this.o.keybindings[name]] = this.actions[name]
    }
    var keydown = keys(actions)
    window.addEventListener('keydown', function (e) {
      if (this.editing) return
      keydown.call(this, e)
    }.bind(this))
  },

  addTree: function (node, before) {
    this.add(node, before)
    if (!node.children.length) return
    for (var i=0; i<node.children.length; i++) {
      this.addTree(this.model.ids[node.children[i]], false)
    }
  },

  // operations
  add: function (node, before, dontfocus) {
    var ed = this.editing
    this.vl.addNew(node, this.bindActions(node.id), before)
    if (!dontfocus) {
      if (ed) {
        this.vl.body(node.id).startEditing()
      } else {
        this.setSelection([node.id])
      }
    }
  },
  remove: function (id) {
    var pid = this.model.ids[id]
      , parent = this.model.ids[pid]
    this.vl.remove(id, pid, parent && parent.children.length === 1)
    var ix = this.selection.indexOf(id)
    if (ix !== -1) {
      this.selection.splice(ix, 1)
      if (this.selection.length == 0) {
        this.setSelection([this.root])
      } else {
        this.setSelection(this.selection)
      }
    }
  },
  setData: function (id, data) {
    this.vl.body(id).setData(data)
    if (this.editing) {
      this.vl.body(id).startEditing()
    }
  },
  appendText: function (id, text) {
    this.vl.body(id).addEditText(text)
  },
  move: function (id, pid, before, ppid, lastchild) {
    var ed = this.editing
    this.vl.move(id, pid, before, ppid, lastchild)
    if (ed) this.startEditing(id)
  },
  startEditing: function (id, fromStart) {
    if (arguments.length === 0) {
      id = this.selection.length ? this.selection[0] : this.root
    }
    this.vl.body(id).startEditing(fromStart)
  },
  setEditing: function (id) {
    this.editing = true
    this.setSelection([id])
  },
  doneEditing: function () {
    this.editing = false
  },
  setSelection: function (sel) {
    this.vl.clearSelection(this.selection)
    this.selection = sel
    this.vl.showSelection(sel)
  },
  setCollapsed: function (id, what) {
    this.vl.setCollapsed(id, what)
    if (what) {
      if (this.editing) {
        this.startEditing(id)
      } else {
        this.setSelection([id])
      }
    }
    // TODO: event listeners?
  },

  // non-modifying stuff
  goUp: function (id) {
    // should I check to see if it's ok?
    var above = this.model.idAbove(id)
    if (above === false) return
    this.vl.body(id).body.stopEditing();
    this.vl.body(above).body.startEditing();
  },
  goDown: function (id, fromStart) {
    var below = this.model.idBelow(id)
    if (below === false) return
    this.vl.body(id).body.stopEditing()
    this.vl.body(below).body.startEditing(fromStart)
  },
}

module.exports = View;
