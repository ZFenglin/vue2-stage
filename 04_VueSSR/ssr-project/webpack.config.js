// webpack 打包的入口文件， 需要导出配置

// webpack webpack-cli
// @babel/core babel核心
// babel-loader webpack和babel的一个桥梁
// @babel/preset-env es6+转化为低级版本

// vue-laoder vue-template-compiler 解析vue文件，并编译模板
// vue-style-loader css-loader 解析css样式并插入到style标签中，vue-style-loader支持服务端渲染

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/main.js'),
    output: {
        filename: '[name].bundle.js', // 默认就是main.js，目录默认是dist目录
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
                exclude: /node_modules/ // 过滤掉node_modules目录下的文件
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false, // 配套使用vue-style-loader
                        }
                    },
                ] // 从右向左执行
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html')
            // 默认名字叫index.html
        }),
        new VueLoaderPlugin(),
    ],
}