const webpackBase = require("./webpack.config.base");
const TerserPlugin = require("terser-webpack-plugin"); //对JavaScript进行压缩
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //最大限度的减少生成css
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
// 引入 webpack-merge 插件
const webpackMerge = require("webpack-merge");
module.exports = webpackMerge(webpackBase, {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "js/[name].[chunkhash:8].js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/"
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]), //在构建之前清理dist文件
    new webpack.HashedModuleIdsPlugin() //此插件将导致散列基于模块的相对路径，生成四个字符的字符串作为模块ID。建议用于生产。]。
  ],

  //webpack的优化组合
  optimization: {
    //优化持久化缓存的, runtime 指的是 webpack 的运行环境(具体作用就是模块解析, 加载) 和 模块信息清单,
    //模块信息清单在每次有模块变更(hash 变更)时都会变更, 所以我们想把这部分代码单独打包出来, 配合后端缓存策略, 这样就不会因为某个模块的变更导致包含模块信息的模块(通常会被包含在最后一个 bundle 中)缓存失效.
    // optimization.runtimeChunk 就是告诉 webpack 是否要把这部分单独打包出来.
    runtimeChunk: { name: entrypoint => `runtimechunk~${entrypoint.name}` },
    // webpack4之前使用CommonsChunkPlugin提取公共代码，但是CommonsChunkPlugin存在以下三个问题：
    // 1: 产出的chunk在引入的时候，会包含重复的代码；
    // 2: 无法优化异步chunk；
    // 3: 高优的chunk产出需要的minchunks配置比较复杂。
    //为了解决这些问题，webpack4中用splitchunks替代了CommonsChunkPlugin
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true, //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: "vendors/vendors",
          reuseExistingChunk: true,
          chunks: "async"
        },
        default: {
          minChunks: 2,
          priority: -20,
          name: "vendors/common", //抽取的chunk的名字
          reuseExistingChunk: true, //	如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
          chunks: "all"
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        extractComments: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
});
