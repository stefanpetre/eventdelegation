const webpack = require('webpack');

const path = require('path');

const config = [
    {
        entry: './src/index.js',

        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: 'eventdelegation.udm.js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                }
            ],
        }
    },
    {
        entry: './src/index.js',

        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: 'eventdelegation.esm.js',
            libraryTarget: 'umd'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                }
            ],
        }
    }
];


module.exports = config;