function copy(one) {
  var two = {}
  for (var name in one) {
    two[name] = one[name]
  }
  return two
}

var commands = {
  collapse: {
    args: ['id', 'doCollapse'],
    apply: function (view, model) {
      model.setCollapsed(this.id, this.doCollapse)
      view.setCollapsed(this.id, this.doCollapse)
      view.goTo(this.id)
    },
    undo: function (view, model) {
      model.setCollapsed(this.id, !this.doCollapse)
      view.setCollapsed(this.id, !this.doCollapse)
      view.goTo(this.id)
    },
  },
  newNode: {
    args: ['pid', 'index', 'text'],
    apply: function (view, model) {
      var cr = model.create(this.pid, this.index, this.text)
      this.id = cr.node.id
      view.add(cr.node, cr.before)
      view.startEditing(cr.node.id)
    },
    undo: function (view, model) {
      var ed = view.editing
      view.remove(this.id)
      this.saved = model.remove(this.id)
      var nid = model.ids[this.pid].children[this.index-1]
      if (nid === undefined) nid = this.pid
      if (ed) {
        view.startEditing(nid)
      } else {
        view.setSelection([nid])
      }
    },
    redo: function (view, model) {
      var before = model.readd(this.saved)
      view.add(this.saved.node, before)
    }
  },
  appendText: {
    args: ['id', 'text'],
    apply: function (view, model) {
      this.oldtext = model.ids[this.id].data.name
      model.appendText(this.id, this.text)
      view.appendText(this.id, this.text)
    },
    undo: function (view, model) {
      model.setData(this.id, {name: this.oldtext})
      view.setData(this.id, {name: this.oldtext})
    }
  },
  changeNode: {
    args: ['id', 'newdata'],
    apply: function (view, model) {
      this.olddata = copy(model.ids[this.id].data)
      model.setData(this.id, this.newdata)
      view.setData(this.id, this.newdata)
      view.goTo(this.id)
    },
    undo: function (view, model) {
      model.setData(this.id, this.olddata)
      view.setData(this.id, this.olddata)
      view.goTo(this.id)
    }
  },
  remove: {
    args: ['id'],
    apply: function (view, model) {
      var below = model.nextSibling(this.id)
      if (undefined === below) below = model.idAbove(this.id)
      this.saved = model.remove(this.id)
      view.remove(this.id)
      view.startEditing(below)
    },
    undo: function (view, model) {
      var before = model.readd(this.saved)
      view.addTree(this.saved.node, before)
    }
  },
  copy: {
    args: ['id'],
    apply: function (view, model) {
      model.clipboard = model.dumpData(this.id, true)
    },
    undo: function (view, model) {
    }
  },
  cut: {
    args: ['id'],
    apply: function (view, model) {
      var below = model.nextSibling(this.id)
      if (undefined === below) below = model.idAbove(this.id)
      model.clipboard = model.dumpData(this.id, true)
      this.saved = model.remove(this.id)
      view.remove(this.id)
      if (view.editing) {
        view.startEditing(below)
      } else {
        view.setSelection([below])
      }
    },
    undo: function (view, model) {
      var before = model.readd(this.saved)
      view.addTree(this.saved.node, before)
    }
  },
  paste: {
    args: ['id'],
    apply: function (view, model) {
      var cr = model.importData(this.id, model.clipboard)
        , ed = view.editing
      this.newid = cr.node.id
      view.addTree(cr.node, cr.before)
      view.setCollapsed(cr.node.parent, false)
      model.setCollapsed(cr.node.parent, false)
      if (ed) {
        view.startEditing(this.newid)
      } else {
        view.setSelection([this.newid])
      }
    },
    undo: function (view, model) {
      this.saved = model.remove(this.newid)
      model.clipboard = this.saved
      view.remove(this.newid)
    },
    redo: function (view, model) {
      var before = model.readd(this.saved)
      view.addTree(this.saved.node, before)
    }
  },
  move: {
    args: ['id', 'pid', 'index'],
    apply: function (view, model) {
      this.opid = model.ids[this.id].parent
      this.oindex = model.ids[this.opid].children.indexOf(this.id)
      var before = model.move(this.id, this.pid, this.index)
      var parent = model.ids[this.opid]
        , lastchild = parent.children.length === 0
      view.move(this.id, this.pid, before, this.opid, lastchild)
      view.goTo(this.id)
    },
    undo: function (view, model) {
      var before = model.move(this.id, this.opid, this.oindex)
        , lastchild = model.ids[this.pid].children.length === 0
      view.move(this.id, this.opid, before, this.pid, lastchild)
      view.goTo(this.id)
    }
  }
};

module.exports = commands;

