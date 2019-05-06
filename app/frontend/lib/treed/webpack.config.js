module.exports = {
  entry: './d3tree.js',
  output: {
    path: '/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/treed/build',
    filename: 'd3tree.js',
    libraryTarget: 'var',
    library: 'd3tree'
  },
  resolve: {
    alias: { 
      d3:         "/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/d3/d3.min.js",
      flare_data:   "/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/treed/flare-data.js",
      commands:     "/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/treed/commands.js",
      keys:         "/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/treed/keys.js",
      "dom-vl":     "/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/treed/dom-vl.js",
      controller:   "/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/treed/controller.js",
      model:        "/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/treed/model.js",
      view:         "/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/treed/view.js",
      util:         "/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/treed/util.js",
      index:        "/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/treed/index.js",
      default_node: "/home/AD/chunhua.zhang/.working/home/02-app-dba/node_web/lib/frontend/treed/default-node.js"
    }
  }
};
