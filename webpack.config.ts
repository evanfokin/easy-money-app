import * as path from 'path'
import * as webpack from 'webpack'
import * as webpackDevServer from 'webpack-dev-server'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import OfflinePlugin from 'offline-plugin'
import * as dotEnv from 'dotenv'

dotEnv.config()

const { NODE_ENV } = process.env
const isProduction = NODE_ENV === 'production'

const hashing = (name: string, extension: string) => {
  return `${name}.${isProduction ? '[contenthash].' : ''}${extension}`
}

const config: webpack.Configuration & { devServer?: webpackDevServer.Configuration } = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: hashing('[name]', 'js'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              [
                '@babel/preset-env',
                { targets: { browsers: 'last 2 versions' } }
              ],
              '@babel/preset-typescript',
              '@babel/preset-react'
            ],
            plugins: [
              ['@babel/plugin-transform-runtime', { 'regenerator': true }],
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              'babel-plugin-transform-typescript-metadata',
              'react-hot-loader/babel'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/typeorm$/, result => {
      result.request = result.request.replace(/typeorm/, 'typeorm/browser')
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
    new webpack.ProvidePlugin({
      'window.SQL': 'sql.js/dist/sql-wasm.js'
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV', 'PUBLIC_URL']),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/sql.js/dist/sql-wasm.wasm', to: '' },
        { from: path.resolve(__dirname, 'public'), to: '' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new OfflinePlugin({
      safeToUseOptionalCaches: true,
      appShell: '/',
      ServiceWorker: { events: true, navigateFallbackURL: '/', },
      AppCache: { events: true, FALLBACK: { '/': '/index.html' } }
    })
    // new ForkTsCheckerWebpackPlugin()
  ],
  devServer: {
    hot: true,
    historyApiFallback: true
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      name: true,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
        }
      }
    }
  },
  node: {
    fs: 'empty'
  }
}

export default config
