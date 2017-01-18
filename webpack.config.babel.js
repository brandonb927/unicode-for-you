import path from 'path'
import webpack from 'webpack'
import BrowserSyncPlugin from 'browser-sync-webpack-plugin'

const LOCAL_DEV = process.env.NODE_ENV !== 'production'

let config = {
  entry: {
    app: path.join(__dirname, 'src/assets/scripts/app.js')
  },
  output: {
    path: path.join(__dirname, 'dist/assets/scripts'),
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
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => {
                return [
                  require('autoprefixer')({
                    cascade: true,
                    browsers: [
                      'last 2 versions',
                      'android 4'
                    ]
                  })
                ]
              }
            }
          }
        ]
      }
    ]
  }
}

if (LOCAL_DEV) {
  config.devtool = 'inline-sourcemap'
  config.plugins = [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 8888,
      server: { baseDir: ['dist'] },
      open: false
    })
  ]
} else {
  config.plugins = [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
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
  ]
}

export default config
