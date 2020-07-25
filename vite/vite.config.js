// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const nativeRequire =
  typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
const reactPlugin = nativeRequire('vite-plugin-react');

const customReactServeLocalPlugin = {
  configureServer: ({ app }) => {
    app.use(async (ctx, next) => {
      if (ctx.path.startsWith('/@modules/@pika/react') === false) {
        return next();
      }

      const file = ctx.path.replace(
        '/@modules/@pika/react',
        `${path.resolve(__dirname, './node_modules')}${path.sep}@pika${
          path.sep
        }react`,
      );

      ctx.path = file;
      await ctx.read(file);

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
