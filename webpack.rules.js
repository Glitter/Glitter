const rules = [
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
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    },
  },
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

if (!process.env.GITHUB_TOKEN) {
  rules.push({
    enforce: 'pre',
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
  });
}

module.exports = rules;
