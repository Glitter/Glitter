/* eslint-disable */
const path = require('path');
const plugins = require('./webpack.plugins');
const rules = require('./webpack.rules');
const CopyPlugin = require('copy-webpack-plugin');

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
        ? p => p
        : p => p.replace('main_window/', ''),
  },
});

module.exports = {
  module: {
    rules,
  },
  plugins:
    process.env.npm_lifecycle_event === 'start'
      ? plugins
      : [
          ...plugins,
          new CopyPlugin([
            {
              from: path.resolve(__dirname, `./parcel-bundler/node_modules`),
              to: `bundler_window/node_modules`,
            },
          ]),
        ],
  resolve: {
    alias: {
      '@main': path.resolve(__dirname, './src/main'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@appStore': path.resolve(__dirname, './src/appStore'),
      '@utils': path.resolve(__dirname, './src/utils'),
      plugins: path.resolve(__dirname, './plugins'),
      'react-dom': '@hot-loader/react-dom',
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
};
