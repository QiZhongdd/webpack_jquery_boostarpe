# Boostrap + Webpack + JQuery Boilerplate

## Development

Run development page on **localhost:8080**

```
$ npm run dev
```

## Build

Build for production.

```
$ npm run build
```

```
$ npm run deploy
```

##解释文档

husky prettier

```
prettier是一个支持多种文件格式的样式格式化文件工具。它会删除代码的原始样式，并确保输出的代码移植可轻松配置利用git hooks，支持git代码提交自动格式化。

git提交自动格式化：pre-commit Hook
Prettier还可以很好的集成的到项目中，利用git的hooks机制，在提交commit时自动调用Pretter。这样子可以避免无法安装编辑器插件、安装了但是未提交代码前利用其格式化代码等各种情况的发生。

具体操作时，还需要 Huksy、lint-staged这两个工具。

Husky ：可以方便的让你通过npm scripts来调用各种git hooks。
lint-staged ：利用git的staged特性，可以提取出本次提交的变动文件，让prettier只处理这些文件。
```

eslint 的相关配置解释

```
parserOptions (解析器选项) { "parserOptions": { "ecmaVersion": 6 } } 来启用 ES6 语法支持；要额外支持新的 ES6 全局变量，使用 { "env":{ "es6": true } }(这个设置会同时自动启用 ES6 语法支持)

Parse
ESLint 默认使用Espree作为其解析器，你可以在配置文件中指定一个不同的解析器，只要该解析器符合下列要求：

它必须是本地安装的一个 npm 模块。
它必须有兼容 Esprima 的接口（它必须输出一个 parse() 方法）
它必须产出兼容 Esprima 的 AST 和 token 对象。
注意，即使满足这些兼容性要求，也不能保证一个外部解析器可以与 ESLint 正常配合工作，ESLint 也不会修复与其它解析器不兼容的相关 bug。

为了表明使用该 npm 模块作为你的解析器，你需要在你的 .eslintrc 文件里指定 parser 选项这里使用了babel作为解析器
注意，在使用自定义解析器时，为了让 ESLint 在处理非 ECMAScript 5 特性时正常工作，配置属性 parserOptions 仍然是必须的。解析器会被传入 parserOptions，但是不一定会使用它们来决定功能特性的开关。

Environments
一个环境定义了一组预定义的全局变量。可用的环境包括：
browser - 浏览器环境中的全局变量。
node - Node.js 全局变量和 Node.js 作用域。
commonjs - CommonJS 全局变量和 CommonJS 作用域 (用于 Browserify/WebPack 打包的只在浏览器中运行的代码)。
shared-node-browser - Node.js 和 Browser 通用全局变量。
es6 - 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。
worker - Web Workers 全局变量。
amd - 将 require() 和 define() 定义为像 amd 一样的全局变量。
mocha - 添加所有的 Mocha 测试全局变量。
jasmine - 添加所有的 Jasmine 版本 1.3 和 2.0 的测试全局变量。
jest - Jest 全局变量。
phantomjs - PhantomJS 全局变量。
protractor - Protractor 全局变量。
qunit - QUnit 全局变量。
jquery - jQuery 全局变量。
prototypejs - Prototype.js 全局变量。
shelljs - ShellJS 全局变量。
meteor - Meteor 全局变量。
mongo - MongoDB 全局变量。
applescript - AppleScript 全局变量。
nashorn - Java 8 Nashorn 全局变量。
serviceworker - Service Worker 全局变量。
atomtest - Atom 测试全局变量。
embertest - Ember 测试全局变量。
webextensions - WebExtensions 全局变量。
greasemonkey - GreaseMonkey 全局变量。
这些环境并不是互斥的，所以你可以同时定义多个。

Plugins
ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它

Rules
ESLint 附带有大量的规则。你可以使用注释或配置文件修改你项目中要使用的规则。要改变一个规则设置，你必须将规则 ID 设置为下列值之一：
"off" 或 0 - 关闭规则
"warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
"error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
这里使用prettier作为规则设置


extends
一个配置文件可以从基础配置中继承已启用的规则。
extends 属性值可以是：
在配置中指定的一个字符串
字符串数组：每个配置继承它前面的配置
```

```
url-loader和file-loader的区别
```

其中一个就是引用路径的问题。拿 background 样式用 url 引入背景图来说，我们都知道，webpack 最终会将各个模块打包成一个文件，因此我们样式中的 url 路径是相对入口 html 页面的，而不是相对于原始 css 文件所在的路径的。这就会导致图片引入失败。这个问题是用 file-loader 解决的，file-loader 可以解析项目中的 url 引入（不仅限于 css），根据我们的配置，将图片拷贝到相应的路径，再根据我们的配置，修改打包后文件引用路径，使之指向正确的文件。

    另外，如果图片较多，会发很多http请求，会降低页面性能。这个问题可以通过url-loader解决。url-loader会将引入的图片编码，生成dataURl。相当于把图片数据翻译成一串字符。再把这串字符打包到文件中，最终只需要引入这个文件就能访问图片了。当然，如果图片较大，编码会消耗性能。因此url-loader提供了一个limit参数，小于limit字节的文件会被转为DataURl，大于limit的的时候可以用使用file-loader进行copy。

```
contenthash、hash、chunkhash的区别
hash是跟整个项目的构建有关，只要项目里面的文件有变化，hash都会更改，并且全部项目的hash值都会一样，所以每一次构建的项目都会发生改变，不利于缓存
chunkhash是根据不同的入口文件进行依赖文件的解析、构建对应的chunk，生成对应的hash值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，
接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。
contenthash加入index.css被index.js引用了，那index.js和index.css的哈希值是一样的，假如index.js被修改了
index.css的hash也会修改，所以这个时候就要用到我们可以使用extra-text-webpack-plugin里的contenthash值，保证即使css文件所处的模块里就算其他文件内容改变，
只要css文件内容不变，那么不会重复构建。
```
