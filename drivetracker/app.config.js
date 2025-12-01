// app.config.js - load runtime secrets from environment for Expo + EAS
// - Local dev: you can create a `.env` file (do NOT commit it) and this will load it via dotenv
// - CI / EAS builds: set environment variables or EAS secrets; they will be available as process.env

try {
  // Load local .env during development if available
  require("dotenv").config();
} catch (e) {
  // ignore if dotenv not installed
}

module.exports = ({ config }) => {
  return {
    ...config,
    name: config.name || "DriveTracker",
    slug: config.slug || "drivetracker",
    extra: {
      ...(config.extra || {}),
      SUPABASE_URL:
        process.env.SUPABASE_URL || (config.extra && config.extra.SUPABASE_URL),
      SUPABASE_ANON_KEY:
        process.env.SUPABASE_ANON_KEY ||
        (config.extra && config.extra.SUPABASE_ANON_KEY),
    },
    plugins: [...(config.plugins || []), "expo-asset"],
    android: {
      // Unique application id for Android (change to your reverse-domain identifier)
      package: process.env.ANDROID_PACKAGE || "com.group8f25.drivetracker",
      config: {
        ...(config.android && config.android.config
          ? config.android.config
          : {}),
        googleMaps: {
          apiKey:
            process.env.GOOGLE_MAPS_API_KEY ||
            (config.extra && config.extra.GOOGLE_MAPS_API_KEY) ||
            undefined,
        },
      },
    },
    ios: {
      // iOS bundle identifier (change as appropriate)
      bundleIdentifier:
        process.env.IOS_BUNDLE_IDENTIFIER || "com.group8f25.drivetracker",
    },
  };
};
