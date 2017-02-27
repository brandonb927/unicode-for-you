import {resolve} from 'path'
import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'

import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const WP_ADDR = '0.0.0.0'
const WP_PORT = 3000

let htmlOptions = {
  template: 'index.html',
  inject: false,
}

let loaderOptions = {
  options: {
    postcss: [
      autoprefixer({
        cascade: true,
        browsers: [
          'last 2 versions',
          'android 4'
        ]
      })
    ]
  }
}

let uglifyJSOptions = {
  sourceMap: true,
  compress: {
    sequences: true,
    properties: true,
    drop_debugger: true,
    dead_code: true,
    conditionals: true,
    booleans: true,
    unused: true,
    if_return: true,
    join_vars: true,
    drop_console: true,
    warnings: false,
  }
}

export default {
  entry: [
    'whatwg-fetch',
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${WP_ADDR}:${WP_PORT}`,
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'src/scripts/entry.js'),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  context: resolve(__dirname, 'src'),
  // NOTE: react-lite is not compatible with react-hot-loader 3 apparently?
  //       using normal react and react-dom for now
  // resolve: {
  //   alias: {
  //     'react': 'react-lite',
  //     'react-dom': 'react-lite',
  //   },
  // },
  devtool: 'inline-source-map',
  devServer: {
    host: WP_ADDR,
    port: WP_PORT,
    contentBase: resolve(__dirname, 'dist'),
    historyApiFallback: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', { 'modules': false }],
              'stage-0',
              'react'
            ]
          }
        }]
      },
      {
        test: /\.pcss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader?importLoaders=1',
            'postcss-loader'
          ]
        })
      },
    ],
  },
  plugins : [
    new HtmlWebpackPlugin(htmlOptions),
    new ExtractTextPlugin('app.css'),
    // NOTE: Enable these as needed
    // new webpack.optimize.UglifyJsPlugin(uglifyJSOptions),
    // new webpack.LoaderOptionsPlugin(loaderOptions),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ]
}
