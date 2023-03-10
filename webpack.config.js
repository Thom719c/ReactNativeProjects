const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);


  // Add the following lines to include a custom source map configuration
  config.devtool = 'source-map';

  // If you want to add a new alias to the config.
  // config.resolve.alias['moduleA'] = 'moduleB';
  config.resolve.alias = {
    ...config.resolve.alias,
    './screens/MapsScreenV2': './screens/WebMapsScreen.js',
  };

  /* config.resolve.alias = {
    ...config.resolve.alias,
    'react-native': 'react-native-web',
    'react-native-maps': 'react-native-web-maps',
  } */

  // config.resolve.alias['react-native-maps'] = '@teovilla/react-native-web-maps';

  // Maybe you want to turn off compression in dev mode.
  if (config.mode === 'development') {
    config.devServer.compress = false;
  }

  // Or prevent minimizing the bundle when you build.
  if (config.mode === 'production') {
    config.optimization.minimize = false;
  }

  // Finally return the new config for the CLI to use.
  return config;
};
