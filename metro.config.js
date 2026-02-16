const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Ensure lodash subpaths (e.g. lodash/isEmpty) resolve for react-native-calendars
config.resolver.extraNodeModules = {
  ...config.resolver?.extraNodeModules,
  lodash: path.resolve(__dirname, "node_modules/lodash"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
