const webpack = require('webpack');

const path = require('path');

const merge = require('webpack-merge');
const base = require('./config.base.js');

const config = [
    merge(base, {
        mode: 'none',
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: 'eventdelegation.js',
            libraryTarget: 'umd'
        },
        devtool: 'source-map',
        optimization: {
            minimizer: [],
            runtimeChunk: false
        }
    }),
    merge(base, {
        mode: 'production',
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: 'eventdelegation.min.js',
        },
        devtool: 'source-map'
    })
];


module.exports = config;