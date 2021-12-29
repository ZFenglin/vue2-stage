const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseConfig, {
    entry: {
        client: path.resolve(__dirname, '../src/client-entry.js'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'client.html',
        }),
    ],
})