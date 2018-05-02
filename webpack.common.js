const ENV = process.env.NODE_ENV;

const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const rxPaths = require('rxjs/_esm5/path-mapping');
const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
const postcssConfig = require('./postcss.config');

const entryPoints = ['inline', 'polyfills', 'vendor', 'main'];

const  { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin } = require('webpack');
const { NamedLazyChunksWebpackPlugin, BaseHrefWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['./node_modules', './node_modules'],
        symlinks: true,
        alias: rxPaths(),
        mainFields: ['browser', 'module', 'main']
    },
    resolveLoader: {
        modules: ['./node_modules', './node_modules'],
        alias: rxPaths()
    },
    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: '[name].bundle.[chunkhash].js',
        chunkFilename: '[id].chunk.js',
        crossOriginLoading: false
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: '@ngtools/webpack'
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                test: /\.(eot|svg|cur)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[hash:20].[ext]',
                    limit: 10000
                }
            },
            {
                test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                loader: 'url-loader',
                options: {
                    name: '[name].[hash:20].[ext]',
                    limit: 10000
                }
            },
            {
                exclude: [path.join(process.cwd(), 'src/styles/common.scss')],
                test: /\.css$/,
                use: [
                    'exports-loader?module.exports.toString()',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssConfig,
                            sourceMap: false
                        }
                    }
                ]
            },
            {
                exclude: [path.join(process.cwd(), 'src/styles/common.scss')],
                test: /\.scss$|\.sass$/,
                use: [
                    'exports-loader?module.exports.toString()',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssConfig,
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            precision: 8,
                            includePaths: []
                        }
                    }
                ]
            },
            {
                include: [path.join(process.cwd(), 'src/styles/common.scss')],
                test: /\.css$/,
                use: ExtractTextPlugin.extract([
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false,
                            minimize: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssConfig,
                            sourceMap: false
                        }
                    }
                ])
            },
            {
                include: [path.join(process.cwd(), 'src/styles/common.scss')],
                test: /\.scss$|\.sass$/,
                use: ExtractTextPlugin.extract([
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false,
                            minimize: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssConfig,
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            precision: 8,
                            includePaths: []
                        }
                    }
                ])
            }
        ]
    },
    plugins: [
        new CleanPlugin(['dist']),
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            './src', // location of your src
            {} // a map of your routes
        ),
        new NoEmitOnErrorsPlugin(),
        new CopyWebpackPlugin(
            [
                {
                    context: 'src',
                    to: '',
                    from: {
                        glob: 'assets/**/*',
                        dot: true
                    }
                },
                {
                  context: 'src/app/spacemap/assets',
                  to: 'assets',
                  from: {
                      glob: '**/*',
                      dot: true
                  }
              },
                {
                    context: 'src',
                    to: '.',
                    from: {
                        glob: 'favicon.ico',
                        dot: true
                    }
                }],

                {
                    ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'],
                    debug: 'warning'
                }
        ),
        new ProgressPlugin(),
        new CircularDependencyPlugin({
            exclude: /(\\|\/)node_modules(\\|\/)/,
            failOnError: false,
            onDetected: false,
            cwd: process.cwd()
        }),
        new NamedLazyChunksWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html',
            hash: false,
            inject: true,
            compile: true,
            favicon: false,
            minify: false,
            cache: true,
            showErrors: true,
            chunks: 'all',
            excludeChunks: [],
            title: 'NGHN',
            xhtml: true,
            chunksSortMode: function sort(left, right) {
                let leftIndex = entryPoints.indexOf(left.names[0]);
                let rightindex = entryPoints.indexOf(right.names[0]);
                if (leftIndex > rightindex) {
                    return 1;
                } else if (leftIndex < rightindex) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }),
        new BaseHrefWebpackPlugin({}),
        new CommonsChunkPlugin({
            name: ['inline'],
            minChunks: null
        }),
        new CommonsChunkPlugin({
            name: ['vendor'],
            minChunks: (module) => {
                return (
                    module.resource &&
                    (module.resource.startsWith(nodeModules) ||
                        module.resource.startsWith(genDirNodeModules) ||
                        module.resource.startsWith(realNodeModules))
                );
            },
            chunks: ['main']
        }),
        new CommonsChunkPlugin({
            name: ['main'],
            minChunks: 2,
            async: 'common'
        }),
        new NamedModulesPlugin({}),
        new ExtractTextPlugin('styles.[chunkhash].css'),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        })
        // new FaviconsWebpackPlugin(path.join(process.cwd(), 'src/assets/angular512.png'))
    ],
    node: {
        fs: 'empty',
        global: true,
        crypto: 'empty',
        tls: 'empty',
        net: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
};
