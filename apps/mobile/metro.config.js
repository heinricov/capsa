const { getDefaultConfig } = require("expo/metro-config")
const { withNativewind } = require("nativewind/metro")

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

// `@workspace/mobile` (and other workspace packages) are consumed through
// their `exports` maps.
config.resolver.unstable_enablePackageExports = true

module.exports = withNativewind(config)
