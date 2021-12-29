const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseConfig, {
    target: 'node', // 服务端将使用的位置设置为node
    entry: {
        server: path.resolve(__dirname, '../src/server-entry.js'),
    },
    output: {
        libraryTarget: 'commonjs2',
    },
    plugins: [
        // 调整服务端的HTML文件
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.ssr.html'),
            filename: 'server.html',
            excludeChunks: ['server'], // js无需引入，直接使用html
            minify: false, // 不压缩
            client: '/client.bundle.js', // 引入客户端的bundle文件
        }),
    ],
})