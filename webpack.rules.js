module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  // {
  //   test: /\.(m?js|node)$/,
  //   parser: { amd: false },
  //   use: {
  //     loader: '@marshallofsound/webpack-asset-relocator-loader',
  //     options: {
  //       outputAssetBase: 'native_modules',
  //     },
  //   },
  // },
  {
    enforce: 'pre',
    test: /\.(js)$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
  },
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        plugins: ['react-hot-loader/babel'],
      },
    },
  },
  // Put your webpack loader rules in this array.  This is where you would put
  // your ts-loader configuration for instance:

  {
    test: /\.tsx?$/,
    loaders: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
];
