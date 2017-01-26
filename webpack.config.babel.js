import path from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'

import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const LOCAL_DEV = process.env.NODE_ENV !== 'production'

let htmlOptions = {
  template: 'src/assets/index.html',
  inject: false,
  title: 'Unicode For You',
  appMountId: 'app',
}

let config = {
  entry: {
    app: path.join(__dirname, 'src/assets/scripts/app.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    alias: {
      'react': 'react-lite',
      'react-dom': 'react-lite',
    },
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["es2015", { "modules": false }],
              'react'
            ]
          }
        }
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
      }
    ]
  },
  plugins : [
    new HtmlWebpackPlugin(htmlOptions),
    new ExtractTextPlugin('[name].css'),
    new webpack.LoaderOptionsPlugin({
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
    }),
  ]
}

if (LOCAL_DEV) {
  config.devtool = 'inline-sourcemap'
} else {
  // Minify HTML in prod
  htmlOptions.minify = true

  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  )

  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
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
        warnings: false
      }
    })
  )
}

export default config
