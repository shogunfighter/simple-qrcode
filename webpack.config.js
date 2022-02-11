const { networkInterfaces } = require('os');
const webpack = require('webpack');
const path = require('path');

// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const JavaScriptObfuscator = require('webpack-obfuscator');

const host = (() => {
    const nets = networkInterfaces();
    const results = Object.create(null); // or just '{}', an empty object

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }

                results[name].push(net.address);
            }
        }
    }

    if (results['Ethernet']) return results['Ethernet'][0];
    else throw new Error("Unable to find Ethernet Ip Address.");
})();

let config = {
    context: __dirname,
    entry: {
        "js/vendor": [
            '/node_modules/qrcodejs/qrcode.js'
        ],
        "js/index": [
            '@/src/index.js'
        ],
        // "css/style": '@/sass_components/style.scss'
    },
    output: {
        path: __dirname + "/dist",
        filename: '[name].min.js'
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        // new ExtractTextPlugin('[name].min.css'),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NamedModulesPlugin()
    ],
    module: {
        rules: [
            // Babel transformer (the one and only)
            {
                test: /\.js(x)?$/,
                exclude: [
                    /node_modules/,
                    /bower_components/
                ],
                loader: "babel-loader"

                //now uses .babelrc (replaces query)

                // ,
                // query: {
                //     plugins: [
                //         "transform-promise-to-bluebird"
                //     ],
                //     presets: [
                //         ["env", "stage-0"]
                //     ]
                // }
            },

            {
                // test: /qrcode/,
                // loader: 'exports-loader?QRCode'

                test: require.resolve('./node_modules/qrcodejs/qrcode.js'),
                loader: 'exports-loader',
                options: {
                    type: 'commonjs',
                    exports: 'QRCode',
                }
            },

            // // Extract css
            // {
            //     test: /\.scss$/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         //resolve-url-loader may be chained before sass-loader if necessary
            //         // use: [{ loader: 'css-loader', options: { minimize: true } }, 'sass-loader']
            //         use: [{ loader: 'css-loader', options: {} }, 'sass-loader'] //removed option -> minimize: true, causes compilation error
            //     })
            // },

            // //FONTS
            // {
            //     test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            //     include: [
            //         path.join(__dirname, "resources", "fonts"),
            //         path.join(__dirname, "bower_components", "bootstrap-sass", "assets", "fonts", "bootstrap"),
            //     ],
            //     use: [{
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             // outputPath: '../dist/fonts/'
            //             outputPath: '../fonts/'
            //         }
            //     }]
            // },
            //
            //
            // //SOUNDS -- DUNNO WHY NOT WORKING IN WEBPACK
            // {
            //     test: /\.(mp3|aac|ogg)$/,
            //     include: [
            //         path.join(__dirname, "src", "Projects", "CorrespondingAngles", "animatecc", "sounds")
            //     ],
            //     use: [{
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             outputPath: 'sounds/'
            //         }
            //     }]
            // },
            //
            // //IMAGES - resources
            // {
            //     test: /\.(jpe?g|png|gif|svg)$/i,
            //     include: [
            //         path.join(__dirname, "resources", "images"),
            //         path.join(__dirname, "resources", "svg")
            //     ],
            //     use: [{
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             outputPath: 'images/'
            //         }
            //     }]
            // },
            //
            // //IMAGES - alert normal
            // {
            //     test: /\.(png)$/,
            //     include: [ path.join(__dirname, "other_components", "alert", "themes", "default", "img") ],
            //     use: [{
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             outputPath: 'alert-dependency/img/'
            //         }
            //     }]
            // },
            //
            // //IMAGES - alert x2
            // {
            //     test: /\.(png)$/,
            //     include: [ path.join(__dirname, "other_components", "alert", "themes", "default", "x2") ],
            //     use: [{
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             outputPath: 'alert-dependency/x2/'
            //         }
            //     }]
            // },
            //
            // //ALERT DEPENDENCIES
            // {
            //     test: /\.(php|htc)$/,
            //     include: [
            //         path.join(__dirname, "other_components", "alert")
            //     ],
            //     use: [{
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             outputPath: 'alert-dependency/'
            //         }
            //     }]
            // },

            // // Expose jquery
            // {
            //     test: require.resolve('./other_components/jquery-v3.2.1-passive.js'),
            //     use: [
            //         { loader: 'expose-loader', options: '$' },
            //         { loader: 'expose-loader', options: 'jQuery' },
            //         { loader: 'expose-loader', options: 'jquery' }
            //     ]
            // },

        ]
    },

    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve('./'),
            'Projects': path.resolve('./src/Projects')
        }
    },

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: false,
        // compress: true,
        port: 7005,
        hot: true,
        open: true,
        host: host
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: "all",
                    name: "js/vendor",
                    test: "js/vendor",
                    enforce: true
                },
                // index: {
                //     chunks: "initial",
                //     name: "js/index",
                //     test: "js/index",
                //     enforce: true
                // },
            }
        },

        runtimeChunk: false,

        minimizer: [
            new TerserPlugin({
                // extractComments: false,
                // cache: true,
                parallel: true,
                // sourceMap: false, // Must be set to true if using source-maps in production
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    // extractComments: 'all',
                    compress: {
                        drop_console: true,
                    },
                    warnings: false,
                }
            }),
        ],
    },
};

console.log("config.entry:", config.entry);

module.exports = (env, argv) => {

    // console.log("env:",env);
    // console.log("argv:",argv);

    // development | staging | production
    const MODE = argv.mode || argv.forceMode;

    switch (MODE) {
        case "development": {
            // config.devtool = "source-map";
            config.devtool = "eval-source-map";
            // config.devtool = "cheap-module-eval-source-map";

            config.module.rules.push(
                // Strip development codes
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    exclude: /(node_modules|bower_components|\.spec\.js)/,
                    use: [
                        {
                            loader: 'webpack-strip-block',
                            options: {
                                start: 'PROD-START',
                                end: 'PROD-END'
                            }
                        },
                        {
                            loader: 'webpack-strip-block',
                            options: {
                                start: 'STAGING-START',
                                end: 'STAGING-END'
                            }
                        }
                    ]
                }
            );
        } break;
        case "staging": {
            // @see https://www.npmjs.com/package/webpack-strip-block
            config.module.rules.push(
                // Strip development codes
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    exclude: /(node_modules|bower_components|\.spec\.js)/,
                    use: [
                        {
                            loader: 'webpack-strip-block',
                            options: {
                                start: 'DEV-START',
                                end: 'DEV-END'
                            }
                        },
                        {
                            loader: 'webpack-strip-block',
                            options: {
                                start: 'PROD-START',
                                end: 'PROD-END'
                            }
                        }
                    ]
                }
            );

            config.plugins.push(
                new JavaScriptObfuscator(
                    // obfuscation options
                    {
                        // rotateUnicodeArray: true,
                        // compact: true,
                        // controlFlowFlattening: false,
                        // deadCodeInjection: false,
                        // debugProtection: false,
                        // debugProtectionInterval: false,
                        // disableConsoleOutput: true,
                        // identifierNamesGenerator: 'hexadecimal',
                        // log: false,
                        // renameGlobals: false,
                        // rotateStringArray: true,
                        // selfDefending: true,
                        // stringArray: true,
                        // stringArrayEncoding: false,
                        // stringArrayThreshold: 0.75,
                        // unicodeEscapeSequence: false

                        // domainLock: ['.ace-learning.com'] // domain lock is embedded in the "EALoader.js"
                    },

                    // except files
                    ['js/vendor.min.js', 'css/style.min.js']
                )
            );
        } break;
        case "production": {

            // @see https://www.npmjs.com/package/webpack-strip-block
            config.module.rules.push(
                // Strip development codes
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    exclude: /(node_modules|bower_components|\.spec\.js)/,
                    use: [
                        {
                            loader: 'webpack-strip-block',
                            options: {
                                start: 'DEV-START',
                                end: 'DEV-END'
                            }
                        },
                        {
                            loader: 'webpack-strip-block',
                            options: {
                                start: 'STAGING-START',
                                end: 'STAGING-END'
                            }
                        }
                    ]
                }
            );

            config.plugins.push(
                new JavaScriptObfuscator(
                    // obfuscation options
                    {
                        // rotateUnicodeArray: true,
                        // compact: true,
                        // controlFlowFlattening: false,
                        // deadCodeInjection: false,
                        // debugProtection: false,
                        // debugProtectionInterval: false,
                        // disableConsoleOutput: true,
                        // identifierNamesGenerator: 'hexadecimal',
                        // log: false,
                        // renameGlobals: false,
                        // rotateStringArray: true,
                        // selfDefending: true,
                        // stringArray: true,
                        // stringArrayEncoding: false,
                        // stringArrayThreshold: 0.75,
                        // unicodeEscapeSequence: false

                        // domainLock: ['.ace-learning.com'] // domain lock is embedded in the "EALoader.js"
                    },

                    // except files
                    ['js/vendor.min.js', 'css/style.min.js']
                )
            );
        } break;
    }

    return config;
};