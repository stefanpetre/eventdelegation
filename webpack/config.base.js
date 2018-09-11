const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.html$/,
                use: [
                    {
                        exclude: /node_modules/,
                        loader: "html-loader"
                    }
                ]
            }
        ],
    },

    plugins: [
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
        ]),
    ],
};