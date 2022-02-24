const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const pkg = require('../package.json')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
  mode: "production", // "production" | "development" | "none"
  entry: path.resolve(__dirname, '../src/index.tsx'), // string | object | array
  output: {
    // webpack 如何输出结果的相关选项
    path: path.resolve(__dirname, "../dist"), // string (default)
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015',
            },
          }
        ]
      },
      {
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          // esModule: false,
          inline: 'fallback'
        },
      },
      {
        test: /\.txt$/i,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.css|less$/,
        use: [
          { 
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false
            }
          },
          { 
            loader: 'css-loader',
            options: {
              modules: false,
            }
          },
          { loader: 'less-loader' }
        ]
      },
      {
        test: /\.png|jpeg|jpg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: 'file-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', ".js", ".json", ".jsx", ".css"],
  },
  devtool: 'source-map',
  context: path.join(__dirname, '../'),
  target: ['web'],
  stats: 'normal',
  experiments: {
    asyncWebAssembly: true,
    // WebAssembly as async module (Proposal)
    syncWebAssembly: true,
    // WebAssembly as sync module (deprecated)
    topLevelAwait: true,
    // Allow to use await on module evaluation (Proposal)
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: '/public/index.html'
    }), 
    new MiniCssExtractPlugin(),
    new webpack.BannerPlugin({
      entryOnly: true,
      banner: () => `
      MCM Version:${pkg.version} 
      Publish time: ${new Date().toString()}, 
      file:[file]
      `
    }),
  ],
  // list of additional plugins
  optimization: {
    chunkIds: "size",
    // method of generating ids for chunks
    moduleIds: "size",
    // method of generating ids for modules
    mangleExports: "size",
    // rename export names to shorter names
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
    minimize: false,
    concatenateModules: false,
    providedExports: false,
    usedExports: false 
  },
  performance: {
    hints: "warning",
    maxAssetSize: 1000000,
    maxEntrypointSize: 1000000
  }
}
