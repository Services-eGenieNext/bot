process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const fs = require('fs');
const path = require('path');
const webpackConfig = require('./config/webpack.config');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'react-app',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'import',
    'jsx-a11y',
    'react-hooks',
    'prettier',
  ],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'react/prop-types': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react/no-unescaped-entities': 'warn',
    'no-console': 'warn',
    'import/named': 'off',
    'import/no-anonymous-default-export': 'off',
    'import/order': [
      2,
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'index',
          'sibling',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: { 'prettier/prettier': ['warn', prettierOptions] },
    },
  ],
  env: {
    browser: true,
    jest: true,
  },

  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': [' .ts', '.tsx'],
    },
    'import/resolver': {
      webpack: {
        config: () => webpackConfig('production'),
      },
    },
  },
};
