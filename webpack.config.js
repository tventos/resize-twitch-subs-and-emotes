const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: [path.resolve(__dirname, 'src/index.tsx')],
  output: {
    filename: 'static/js/[name].[hash:8].js',
    chunkFilename: 'static/js/[name].[hash:8].chunk.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  module: {
    strictExportPresence: false,
    noParse: [/\.test\.tsx?$/],
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.worker\.(c|m)?ts$/i,
        loader: 'worker-loader',
        options: {
          esModule: false,
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'ts-loader', options: { transpileOnly: true } }, 'eslint-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.ts', '.js', '.css', '.png', '.jpg', '.less'],
  },
  stats: {
    builtAt: true,
    children: false,
    assets: false,
    logging: 'warn',
    modules: false,
    entrypoints: false,
    warningsFilter: /export .* was not found in/,
  },
};
