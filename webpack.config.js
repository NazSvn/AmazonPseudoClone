const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    amazon: './src/scripts/amazon.js',
    checkout: './src/scripts/checkout.js',
    orders: './src/scripts/orders.js',
    tracking: './src/scripts/tracking.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    assetModuleFilename: '[name][ext]',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Amazon',
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['amazon'],
    }),
    new HtmlWebpackPlugin({
      title: 'Checkout',
      filename: 'checkout.html',
      template: 'src/checkout.html',
      chunks: ['checkout'],
    }),
    new HtmlWebpackPlugin({
      title: 'Orders',
      filename: 'orders.html',
      template: 'src/orders.html',
      chunks: ['orders'],
    }),
    new HtmlWebpackPlugin({
      title: 'Tracking',
      filename: 'tracking.html',
      template: 'src/tracking.html',
      chunks: ['tracking'],
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
