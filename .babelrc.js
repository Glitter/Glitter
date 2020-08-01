module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  console.log('production:', api.env('production'));

  return {
    presets: ['@babel/preset-react'],
    plugins: [
      'babel-plugin-styled-components',
      [
        '@babel/plugin-proposal-decorators',
        {
          decoratorsBeforeExport: true,
        },
      ],
      '@babel/plugin-proposal-class-properties',
      !api.env('production') && 'react-refresh/babel',
    ].filter(Boolean),
  };
};
