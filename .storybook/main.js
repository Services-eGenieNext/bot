const getWebpackConfig = require('../config/webpack.config.js');
const concatUniq = (arr1, arr2) => Array.from(new Set([...arr1, ...arr2]).values());
const paths = require('../config/paths');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config, { configType }) => {
    const webpackConfig = getWebpackConfig(configType.toLowerCase());

    config.resolve.modules = concatUniq(config.resolve.modules, webpackConfig.resolve.modules);
    config.resolve.alias = Object.assign({}, config.resolve.alias, webpackConfig.resolve.alias);
    config.resolve.extensions = concatUniq(config.resolve.extensions, webpackConfig.resolve.extensions);
    config.resolve.plugins = concatUniq(config.resolve.plugins, webpackConfig.resolve.plugins);
    config.plugins = concatUniq(config.plugins, webpackConfig.plugins);

    const rules = config.module.rules;
    const fileLoaderRule = rules.find(rule => rule.test.test('.js'));
    fileLoaderRule.use[0].options.plugins.push([

      require.resolve('babel-plugin-named-asset-import'),
      {
        loaderMap: {
          svg: {
            ReactComponent:
              '@svgr/webpack?-svgo,+titleProp,+ref![path]',
          },
        },
      },
    ])

    return config;
  },
};
