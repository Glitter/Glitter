const path = require('path');

require('dotenv').config();

module.exports = {
  packagerConfig: {
    appCopyright: 'Made by Glitter © 2019-2020',
    appCategoryType: 'public.app-category.utilities',
    icon: './assets/glitter-icon',
    appBundleId: 'com.tryglitter.glitter',
    osxNotarize: {
      appleId: process.env.FORGE_PACKAGER_APPLE_ID,
      appleIdPassword: process.env.FORGE_PACKAGER_APPLE_ID_PASSWORD,
    },
    osxSign: {
      identity: process.env.FORGE_PACKAGER_SIGNING_IDENTITY,
      hardenedRuntime: true,
      entitlements: path.resolve(__dirname, './parent.entitlements'),
      'entitlements-inherit': path.resolve(__dirname, './child.entitlements'),
      'gatekeeper-assess': false,
      'pre-auto-entitlements': false,
      keychain: process.env.FORGE_PACKAGER_SIGNING_TEMP_KEYCHAIN_NAME,
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: './assets/glitter-icon.icns',
        iconSize: 80,
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        authToken: process.env.GITHUB_TOKEN,
        repository: {
          owner: 'Glitter',
          name: 'Glitter',
        },
      },
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/ui/index.html',
              js: './src/ui/renderer.tsx',
              name: 'main_window',
            },
            {
              html: './src/widgetLoader/parcel/index.html',
              js: './src/widgetLoader/parcel/index.ts',
              name: 'bundler_window',
            },
          ],
        },
      },
    ],
  ],
};
