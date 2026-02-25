module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Note: react-native-reanimated/plugin should be last
      'react-native-reanimated/plugin',
    ],
  };
};
