var keys = require("keys");
var util = require("util");

function DefaultNode(data, options) {
  this.name = data.name
  this.value = data.value
  this.o = options
  this.o.keybindings = util.merge(this.default_keys, options.keys)

  this.editing = false
  this.editingValue = false
  this.setupNode();
}


DefaultNode.prototype = {
  // Should there be a canStopEditing?
  focus: function () {
    this.startEditing();
  },
  blur: function () {
    this.stopEditing();
  },
  addEditText: function (text) {
    var pl = this.name.length
    this.editing = true;
    this.name += text
    this.valueinput.value = this.value || '';
    this.text.innerText = this.name;
    this.node.replaceChild(this.input, this.text)
    // this.input.focus();
    this.o.setEditing();
    this.input.selectionStart = this.input.selectionEnd = pl;
  },
  setData: function (data) {
    if (undefined !== data.name && data.name !== this.name) {
      this.name = data.name
      this.input.value = data.name
      this.text.innerText = data.name
    }
    if (undefined !== data.done) {
      this.done = data.done
      if (data.done) {
        this.node.classList.add('listless__default-node--done')
      } else {
        this.node.classList.remove('listless__default-node--done')
      }
    }
  },
  setupNode: function () {
    this.node = document.createElement('div')
    this.input = document.createElement('input')
    this.inputValue = document.createElement('input')
    this.text = document.createElement('div')
    this.textValue = document.createElement('div')
    this.node.classList.add('listless__default-node')
    this.textValue.classList.add('listless__default-node-value')
    this.inputValue.classList.add('listless__default-node-value')

    this.text.innerText = this.name
    this.textValue.innerText= this.value || ''
    this.node.appendChild(this.text)
    this.node.appendChild(this.textValue)
    this.registerListeners();
  },
  startEditing: function (fromStart) {
    if (this.editing) return
    this.editing = true;
    this.input.value = this.name;
    this.node.replaceChild(this.input, this.text)
    this.input.focus();
    if (fromStart) {
      this.input.selectionStart = this.input.selectionEnd = 0;
    } else {
      this.input.selectionStart = this.input.selectionEnd = this.name.length;
    }
    this.o.setEditing()
  },
  startValueEditing: function (fromStart) {
    if (this.editingValue) return
    this.editingValue = true;
    this.inputValue.value = this.value || '';
    this.node.replaceChild(this.inputValue, this.textValue)
    this.inputValue.focus();
    if (fromStart) {
      this.input.selectionStart = this.inputValue.selectionEnd = 0;
    } else {
      this.input.selectionStart = this.inputValue.selectionEnd = this.name.length;
    }
    this.o.setEditing()
  },
  stopEditing: function () {
    if (!this.editing) return
    if (this.name != this.input.value) {
      this.text.innerText = this.input.value
      this.name = this.input.value
      this.o.changed('name', this.name)
    }
    this.editing = false
    this.node.replaceChild(this.text, this.input)
    this.o.doneEditing();
  },
  stopValueEditing: function () {
    if (!this.editingValue) return
    if (this.value != this.inputValue.value) {
      this.textValue.innerText = this.inputValue.value
      this.value = this.inputValue.value
      this.o.changed('value', this.value)
    }
    this.editingValue = false
    this.node.replaceChild(this.textValue, this.inputValue)
    this.o.doneEditing();
  },

  default_keys: {
    'undo': 'ctrl z',
    'redo': 'ctrl shift z',
    'collapse': 'alt left',
    'uncollapse': 'alt right',
    'dedent': 'shift tab, shift alt left',
    'indent': 'tab, shift alt right',
    'move up': 'shift alt up',
    'move down': 'shift alt down',
    'toggle done': 'ctrl return',
    'up': 'up',
    'down': 'down',
    'left': 'left',
    'right': 'right',
    'add after': 'return',
    'merge up': 'backspace',
    'stop editing': 'escape',
  },

  actions: {
    'toggle done': function () {
      this.blur()
      this.o.changed('done', !this.done)
      this.focus()
      this.o.goDown()
    },
    'undo': function () {
      this.o.undo()
    },
    'redo': function () {
      this.o.redo()
    },
    'collapse': function () {
      this.o.toggleCollapse(true)
    },
    'uncollapse': function () {
      this.o.toggleCollapse(false)
    },
    'dedent': function () {
      this.o.moveLeft()
    },
    'indent': function () {
      this.o.moveRight()
    },
    'move up': function () {
      this.o.moveUp()
    },
    'move down': function () {
      this.o.moveDown()
    },
    'up': function () {
      this.o.goUp();
    },
    'down': function () {
      this.o.goDown()
    },
    'left': function () {
      var ss = this.input.selectionStart
      if (ss === 0) {
        return this.o.goUp()
      }
      return true
    },
    'right': function () {
      var ss = this.input.selectionStart
      if (ss === this.input.value.length) {
        return this.o.goDown(true)
      }
      return true
    },
    'add after': function () {
      var ss = this.input.selectionStart
        , name = this.input.value
        , rest = null
      if (ss < name.length) {
        rest = name.slice(ss)
        this.name = name.slice(0, ss)
        this.input.value = this.name
        this.text.innerText = this.name
      }
      this.blur()
      this.o.addAfter(rest)
    },
    'merge up': function () {
      if (!this.input.value) {
        return this.o.remove()
      }
      if (this.input.selectionStart == this.input.selectionEnd && this.input.selectionStart === 0) {
        return this.o.remove(this.input.value)
      }
      return true
    },
    'stop editing': function () {
      this.stopEditing();
    }
  },

  registerListeners: function () {
    this.text.addEventListener('mousedown', function (e) {
      this.startEditing();
      e.preventDefault()
      return false
    }.bind(this))

    this.textValue.addEventListener('mousedown', function (e) {
      this.startValueEditing();
      e.preventDefault()
      return false
    }.bind(this))

    this.input.addEventListener('blur', function (e) {
      this.stopEditing();
      e.preventDefault()
      return false
    }.bind(this));
    this.inputValue.addEventListener('blur', function (e) {
      this.stopValueEditing();
      e.preventDefault()
      return false
    }.bind(this));
    
    var actions = {}
    for (var name in this.o.keybindings) {
      actions[this.o.keybindings[name]] = this.actions[name]
    }

    var keyHandler = keys(actions).bind(this)

    this.input.addEventListener('keydown', function (e) {
      // console.log(e.keyCode);
      return keyHandler(e)
    })

  }
}

module.exports = DefaultNode;
