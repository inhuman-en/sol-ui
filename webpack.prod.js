const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const { AngularCompilerPlugin } = require('@ngtools/webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');

module.exports = webpackMerge(commonConfig, {
    entry: {
        main: ['./src/main.ts'],
        polyfills: ['./src/polyfills.ts']
    },
    plugins: [
        new AngularCompilerPlugin({
            mainPath: 'main.ts',
            sourceMap: false,
            platform: 0,
            tsConfigPath: 'src/tsconfig.app.json',
            compilerOptions: {},
            hostReplacementPaths: {
                'environments/environment.ts': 'environments/environment.prod.ts'
            },
        }),
        new UglifyJsPlugin({
            exclude: /\sw.js$/,
            parallel: true
        }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg|ttf|eot|woff|woff2)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg|ttf|eot|woff|woff2)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
});
