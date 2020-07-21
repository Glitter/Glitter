const path = require('path');
const reactPlugin = require('vite-plugin-react');

const customReactServeLocalPlugin = {
  configureServer: ({ app }) => {
    app.use(async (ctx, next) => {
      console.log('Serving:', ctx.path);

      if (ctx.path.startsWith('/@modules/@pika/react') === false) {
        return next();
      }

      const file = ctx.path.replace(
        '/@modules/@pika/react',
        `${path.resolve(__dirname, '../../node_modules')}/@pika/react`,
      );

      ctx.path = file;

      await ctx.read(file);

      console.log('Rewritten ctx path:', file);

      return next();
    });
  },
};

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  jsx: 'react',
  plugins: [reactPlugin, customReactServeLocalPlugin],
};

module.exports = config;
