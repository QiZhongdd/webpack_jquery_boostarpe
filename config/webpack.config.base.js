const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const CssUrlRelativePlugin = require("css-url-relative-plugin");
const config = require("./config");
const IS_DEV = process.env.NODE_ENV === "dev"; //获取cmd命令
let Entries = {};
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// 生成多页面的集合
config.HTMLDirs.forEach(page => {
  const htmlPlugin = new HtmlWebPackPlugin({
    filename: `${page}.html`,
    template: path.resolve(__dirname, `../src/page/${page}.html`),
    chunks: [page, "commons"], //引入的模块，entry中设置多个js时，在这里引入指定的js，如果不设置则全部引入
    favicon: path.resolve(__dirname, "../src/public/icon.ico"), //在网页窗口栏上加上图标
    minify: !IS_DEV && {
      collapseWhitespace: true, //清楚空格、换行符
      preserveLineBreaks: true, //保留换行符
      removeComments: true //清理html中的注释
    }
  });
  HTMLPlugins.push(htmlPlugin);
  Entries[page] = path.resolve(__dirname, `../src/js/${page}.js`);
});
module.exports = {
  entry: Entries,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: [
          IS_DEV ? "style-loader" : MiniCssExtractPlugin.loader, //如果是开发模式使用内嵌样式
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "[name].[ext]",
              fallback: "file-loader", //超过了限制大小调用回调函数
              outputPath: "public/images" //图片存储的地址
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              attrs: ["img:src", "link:href"], //表示在遇到此标签采用到html-loader
              minimize: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "windows.jQuery": "jquery"
    }), //自动加载模块，当在项目中遇见$、jQuery、windows.jQuery会自动加载JQUERY模块
    new CopyWebpackPlugin([
      //将单个文件或整个目录复制到构建目录。
      {
        from: "./src/public",
        to: "public"
      }
    ]),
    ...HTMLPlugins,
    new MiniCssExtractPlugin({
      filename: !IS_DEV ? "css/[name].[contenthash:8].css" : "[name].css",
      chunkFilename: !IS_DEV ? "css/[name].[contenthash:8].css" : "[name].css",
      allChunks: true
    }),
    new PreloadWebpackPlugin({
      include: "initial"
    }), //一个Webpack插件，用于自动连接异步（和其他类型）的JavaScript块<link rel='preload'>。这有助于延迟加载。注意：这是html - webpack - plugin的扩展插件 - 这是一个简化HTML文件创建的插件，可以为您的webpack包提供服务。
    new CssUrlRelativePlugin() //Webpack插件将css url（...）转换为相对路径（仅支持webpack 4）。将css中的错误路劲转换为正确的路径
  ]
};
