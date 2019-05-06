var util = {};

util.extend = function(a, b) {
  for (var c in b) {
    a[c] = b[c]
  }
  return a
}

util.make_listed = function(data, nextid, collapse){
  var ids = {}
    , children = []
    , ndata = {}
    , res
  if (undefined === nextid) nextid = 100

  if (data.children) {
    for (var i=0; i<data.children.length; i++) {
      res = util.make_listed(data.children[i], nextid, collapse)
      for (var id in res.tree) {
        ids[id] = res.tree[id]
      }
      children.push(res.id)
      nextid = res.id + 1
    }
    // delete data.children
  }
  for (var name in data) {
    if (name === 'children') continue
    ndata[name] = data[name]
  }
  ndata.done = false
  ids[nextid] = {
    id: nextid,
    data: ndata,
    children: children,
    collapsed: !!collapse
  }
  for (var i=0; i<children.length; i++) {
    ids[children[i]].parent = nextid;
  }
  return {id: nextid, tree: ids}
};

util.merge = function merge(a, b) {
  var c = {}
  for (var name in a) {
    c[name] = a[name]
  }
  for (var name in b) {
    c[name] = b[name]
  }
  return c
};

module.exports = util;

