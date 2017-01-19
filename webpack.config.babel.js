import path from 'path'
import webpack from 'webpack'

import BrowserSyncPlugin from 'browser-sync-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const LOCAL_DEV = process.env.NODE_ENV !== 'production'

let config = {
  entry: {
    app: path.join(__dirname, 'src/assets/scripts/app.js')
  },
  output: {
    path: path.join(__dirname, 'dist/assets'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react']
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
    new ExtractTextPlugin('[name].css'),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('autoprefixer')({
            cascade: true,
            browsers: [
              'last 2 versions',
              'android 4'
            ]
          })
        ]
      }
    })
  ]
}

if (LOCAL_DEV) {
  config.devtool = 'inline-sourcemap'

  config.plugins.push(
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 8888,
      server: { baseDir: ['dist'] },
      open: false
    })
  )
} else {
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
