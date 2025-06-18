module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      ['inline-import', { extensions: ['.gql', '.graphql'] }],
      ['module-resolver', {
        alias: {
          '@': './src',
        },
      }],
    ],
  };
};