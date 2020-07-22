/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const plugins = require('./webpack.plugins');
const rules = require('./webpack.rules');

rules.push({
  test: /\.png$/,
  loader: 'file-loader',
});

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/main.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, `./vite`),
          to: '',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './assets'),
      '@main': path.resolve(__dirname, './src/main'),
      '@appStore': path.resolve(__dirname, './src/appStore'),
      '@widgetCreator': path.resolve(__dirname, './src/widgetCreator'),
      '@widgetLoader': path.resolve(__dirname, './src/widgetLoader'),
      '@widgetInstantiator': path.resolve(
        __dirname,
        './src/widgetInstantiator',
      ),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
};
