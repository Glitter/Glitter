/* eslint-disable */
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const plugins = require('./webpack.plugins');
const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});
rules.push({
  test: /\.svg$/,
  loader: 'svg-inline-loader?removeSVGTagAttrs=false',
});
rules.push({
  test: /\.woff2$/,
  loader: 'file-loader',
  options: {
    outputPath: 'main_window',
    postTransformPublicPath:
      process.env.npm_lifecycle_event === 'start'
        ? (p) => p
        : (p) => p.replace('main_window/', ''),
  },
});

module.exports = {
  module: {
    rules,
  },
  plugins: [...plugins, new ReactRefreshWebpackPlugin()],
  resolve: {
    alias: {
      '@main': path.resolve(__dirname, './src/main'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@appStore': path.resolve(__dirname, './src/appStore'),
      '@utils': path.resolve(__dirname, './src/utils'),
      plugins: path.resolve(__dirname, './plugins'),
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
};
