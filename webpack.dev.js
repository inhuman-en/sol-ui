const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { SourceMapDevToolPlugin } = require('webpack');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

module.exports = webpackMerge(commonConfig, {
    entry: {
        main: ['./src/main.ts'],
        polyfills: ['./src/polyfills.ts']
    },
    plugins: [
        new AngularCompilerPlugin({
            mainPath: 'main.ts',
            platform: 0,
            tsConfigPath: 'src/tsconfig.app.json',
            compilerOptions: {}
        }),
        new SourceMapDevToolPlugin({
            filename: '[file].map[query]',
            moduleFilenameTemplate: '[resource-path]',
            fallbackModuleFilenameTemplate: '[resource-path]?[hash]',
            sourceRoot: 'webpack:///'
        })
        // new BundleAnalyzerPlugin()
    ],
    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});
