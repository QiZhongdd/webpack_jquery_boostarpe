// 引入基础配置文件
const webpackBase = require('./webpack.config.base');
// 引入 webpack-merge 插件
const webpackMerge = require('webpack-merge');
const path = require('path');
module.exports = webpackMerge(webpackBase, {
  mode: 'development',
  devtool: 'eval',
  output: {
    filename: 'js/[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname, '../src'),
  },
});
