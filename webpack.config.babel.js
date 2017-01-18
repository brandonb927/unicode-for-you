import path from 'path'
import webpack from 'webpack'
import BrowserSyncPlugin from 'browser-sync-webpack-plugin'

const DEBUG = process.env.NODE_ENV !== 'production'

export default {
  entry: {
    app: path.join(__dirname, 'src/assets/scripts/app.js')
  },
  output: {
    path: path.join(__dirname, 'dist/assets/scripts'),
    filename: '[name].js'
  },
  devtool: DEBUG ? 'inline-sourcemap' : null,
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react']
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
  },
  plugins: DEBUG ? [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 8888,
      server: { baseDir: ['dist'] },
      open: false
    })
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ]
}
