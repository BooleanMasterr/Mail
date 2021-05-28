const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        frontend: './mail/src/index.js',
    },
    output: {
        path: path.resolve('./mail/static/mail/'),
        filename: '[name].js',
        publicPath: 'static/mail',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new BundleTracker({
            path: __dirname,
            filename: './webpack-stats.json',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: '/node_modules/',
                use: ['babel-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ],
    },

}