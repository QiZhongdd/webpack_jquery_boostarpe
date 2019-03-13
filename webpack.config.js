//hash是跟整个项目的构建有关，只要项目里面的文件有变化，hash都会更改，并且全部项目的hash值都会一样，所以每一次构建的项目都会发生改变，不利于缓存
//chunkhash是根据不同的入口文件进行依赖文件的解析、构建对应的chunk，生成对应的hash值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，
//接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。
//contenthash加入index.css被index.js引用了，那index.js和index.css的哈希值是一样的，假如index.js被修改了
//index.css的hash也会修改，所以这个时候就要用到我们可以使用extra-text-webpack-plugin里的contenthash值，保证即使css文件所处的模块里就算其他文件内容改变，
//只要css文件内容不变，那么不会重复构建。
// const path = require("path");
// const webpack = require("webpack");
// const HtmlWebPackPlugin = require("html-webpack-plugin");
// const CleanWebpackPlugin = require("clean-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const PreloadWebpackPlugin = require("preload-webpack-plugin");
// const CssUrlRelativePlugin = require("css-url-relative-plugin");
// const config = require("./config/config");
// const IS_DEV = process.env.NODE_ENV === "dev"; //获取cmd命令
// let Entries = {};
// // 通过 html-webpack-plugin 生成的 HTML 集合
// let HTMLPlugins = [];
// // 生成多页面的集合
// config.HTMLDirs.forEach(page => {
//   const htmlPlugin = new HtmlWebPackPlugin({
//     filename: `${page}.html`,
//     template: path.resolve(__dirname, `src/page/${page}.html`),
//     chunks: [page, "commons"],
//     favicon: path.resolve(__dirname, "src/public/icon.ico"), //在网页窗口栏上加上图标
//     minify: !IS_DEV && {
//       collapseWhitespace: true,
//       preserveLineBreaks: true,
//       removeComments: true
//     }
//   });
//   HTMLPlugins.push(htmlPlugin);
//   Entries[page] = path.resolve(__dirname, `src/js/${page}.js`);
// });
// module.exports = {
//   mode: IS_DEV ? "development" : "production",
//   devtool: IS_DEV ? "eval" : "source-map", //生成源映射，源映射可以增强调试过程
//   entry: Entries,
//   output: {
//     filename: !IS_DEV // webpack热更新和chunkhash有冲突,在开发环境下使用hash模式
//       ? "js/[name].[chunkhash:8].js"
//       : "js/[name].[hash:8].js",
//     path: path.resolve(__dirname, "../dist"),
//     publicPath: "/"
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         loader: "babel-loader"
//       },
//       {
//         test: /\.scss$/,
//         use: [
//           IS_DEV ? "style-loader" : MiniCssExtractPlugin.loader, //如果是开发模式使用内嵌样式
//           "css-loader",
//           "sass-loader"
//         ]
//       },
//       {
//         test: /\.(gif|png|jpe?g|svg)$/i,
//         use: [
//           {
//             loader: "url-loader",
//             options: {
//               limit: 8192,
//               name: "[name].[ext]",
//               fallback: "file-loader", //超过了限制大小调用回调函数
//               outputPath: "public/images" //图片存储的地址
//             }
//           },
//           {
//             loader: "image-webpack-loader",
//             options: {
//               bypassOnDebug: true,
//               mozjpeg: {
//                 progressive: true,
//                 quality: 75
//               }
//             }
//           }
//         ]
//       },
//       {
//         test: /\.html$/,
//         use: [
//           {
//             loader: "html-loader",
//             options: {
//               attrs: [":data-src"], //带有此属性的文件使用这个加载器
//               minimize: true
//             }
//           }
//         ]
//       }
//     ]
//   },
//   plugins: [
//     new CleanWebpackPlugin(["dist"]), //在构建之前清理dist文件
//     new webpack.ProvidePlugin({
//       $: "jquery",
//       jQuery: "jquery",
//       "windows.jQuery": "jquery"
//     }), //自动加载模块，当在项目中遇见$、jQuery、windows.jQuery会自动加载JQUERY模块
//     new CopyWebpackPlugin([
//       //将单个文件或整个目录复制到构建目录。
//       {
//         from: "./src/public",
//         to: "public"
//       }
//     ]),
//     ...HTMLPlugins,
//     new MiniCssExtractPlugin({
//       filename: !IS_DEV ? "css/[name].[contenthash:8].css" : "[name].css",
//       chunkFilename: !IS_DEV ? "css/[name].[contenthash:8].css" : "[name].css",
//       allChunks: true
//     }),
//     new webpack.HashedModuleIdsPlugin(), //此插件将导致散列基于模块的相对路径，生成四个字符的字符串作为模块ID。建议用于生产。
//     new PreloadWebpackPlugin({
//       include: "initial"
//     }), //一个Webpack插件，用于自动连接异步（和其他类型）的JavaScript块<link rel='preload'>。这有助于延迟加载。注意：这是html - webpack - plugin的扩展插件 - 这是一个简化HTML文件创建的插件，可以为您的webpack包提供服务。
//     new CssUrlRelativePlugin() //Webpack插件将css url（...）转换为相对路径（仅支持webpack 4）。将css中的错误路劲转换为正确的路径
//   ],
//   devServer: {
//     contentBase: path.join(__dirname, "src")
//   },
//   optimization: {
//     // 开箱即用SplitChunksPlugin应该适合大多数用户。
//     // 默认情况下，它仅影响按需块，因为更改初始块会影响HTML文件应包含的脚本标记以运行项目。
//     //选择默认配置以适应Web性能最佳实践，但项目的最佳策略可能会有所不同。如果您要更改配置，则应衡量更改的影响，以确保实现真正的好处。
//     runtimeChunk: "single",
//     splitChunks: {
//       cacheGroups: {
//         vendor: {
//           test: /node_modules/, //用于匹配哪些某块应被匹配到
//           chunks: "initial", //“initial”,"all(推荐)"，async(默认)这表示将选择哪些块进行优化
//           name: "vendor", //拆分块的名称
//           priority: 10, //缓存组打包的优先级
//           enforce: true //
//         }
//       }
//     },
//     minimizer: [] //允许您通过提供不同的一个或多个自定义TerserPlugin实例来覆盖默认最小化器。
//   }
// };

// if (!IS_DEV) {
//   const TerserPlugin = require("terser-webpack-plugin"); //缩小JavaScript
//   const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //最大限度的减少生成css
//   config.optimization.minimizer.push(
//     new TerserPlugin(),
//     new OptimizeCSSAssetsPlugin({})
//   );
// }

// 获取环境命令，并去除首尾空格
const env = process.env.NODE_ENV.replace(/(\s*$)|(^\s*)/gi, '');

// 根据环境变量引用相关的配置文件
module.exports = require(`./config/webpack.config.${env}.js`);
