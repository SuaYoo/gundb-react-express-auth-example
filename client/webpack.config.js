const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
    // fixes Critical dependency: the request of a dependency is an expression
    // https://github.com/amark/gun/issues/743
    noParse: /(\/gun|gun\/sea)\.js$/,
  },
  devtool: 'inline-source-map',
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      title: 'client',
      template: './src/index.html',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: './dist',
  },
};
