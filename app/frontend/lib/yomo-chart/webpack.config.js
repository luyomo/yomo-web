module.exports = {
  entry: './tpl-chart.js',
  output: {
    path: '/app/frontend/lib/yomo-chart/build',
    filename: 'tpl-chart.js',
    libraryTarget: 'var',
    library: 'yomoChart'
  }
};
