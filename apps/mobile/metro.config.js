const { getDefaultConfig } = require("expo/metro-config")
const { withNativewind } = require("nativewind/metro")

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// `@workspace/ui` is consumed through its `exports` map.
config.resolver.unstable_enablePackageExports = true

module.exports = withNativewind(config)
