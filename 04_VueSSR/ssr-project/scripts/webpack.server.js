const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseConfig, {
    entry: {
        server: path.resolve(__dirname, '../src/server-entry.js'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.ssr.html'),
            filename: 'server.html',
            excludeChunks: ['server'], // js无需引入，直接使用html
            minify: false
        }),
    ],
})