const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackCommon = require('./common.config');

// webpack plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = webpackMerge(webpackCommon, {

  bail: true,

  debug: false,

  devtool: 'source-map',

  output: {

    path: path.resolve(__dirname, '../static/dist'),

    filename: '[name]-[hash].min.js',

    sourceMapFilename: '[name]-[hash].map',

    chunkFilename: '[id]-[chunkhash].js'

  },

  module: {
    loaders: [

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader?modules&minimize&sourceMap&importLoaders=2',
            'postcss-loader',
            'sass-loader?outputStyle=expanded&sourceMap&sourceMapContents'
          ]
        })
      }

    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../static/index.html'),
      favicon: path.resolve(__dirname, '../static/favicon.ico'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new DedupePlugin(),
    new CleanWebpackPlugin(['static/dist'], {
      root: path.resolve(__dirname, '..')
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new ExtractTextPlugin('[name]-[chunkhash].css'),
    new UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    })
  ]

});
