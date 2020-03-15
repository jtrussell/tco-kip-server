const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    entry: {
        'bundle': ['react-hot-loader/patch', './client/index.jsx']
    },
    output: {
        filename: '[name].[hash].js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        inline: true,
        historyApiFallback: true,
        publicPath: '/'
    }
});
