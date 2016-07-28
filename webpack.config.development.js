'use strict';

var webpack = require('webpack');
var config = require('./webpack.config.base.js');

if (process.env.NODE_ENV !== 'test') {
  config.entry = [
    'whatwg-fetch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server'
  ].concat(config.entry);
}

//config.devtool = 'cheap-module-eval-source-map';
config.devtool = 'eval-cheap-module-source-map';

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
]);

config.module.loaders = config.module.loaders.concat([
  {test: /\.jsx?$/, loaders: [ 'react-hot', 'babel'], exclude: /node_modules/}
]);

module.exports = config;
