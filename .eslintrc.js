const path = require('path');
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.resolve(__dirname, './tsconfig.json'),
    ecmaVersion: 9,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
    'prettier/react',
  ],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': 0,
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-mixed-operators': 'off',
    strict: 0,
    'function-paren-newline': ['error', 'consistent'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'no-unexpected-multiline': ['off'],
    'no-spaced-func': ['off'],
    'import/prefer-default-export': ['off'],
    'no-underscore-dangle': 'off',
    'prettier/prettier': 'error',
    'max-len': ['error', 80],
  },
  plugins: ['html', 'import', 'react', 'react-hooks', 'prettier'],
  settings: {
    'html/html-extensions': ['.html'],
    react: {
      version: 'detect',
    },
  },
};
