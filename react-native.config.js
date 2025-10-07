module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: "../node_modules/expo-financekit/android/",
        packageImportPath:
          "import io.expo.modules.financekit.ExpoFinanceKitPackage;",
      },
      ios: {
        sourceDir: "../node_modules/expo-financekit/ios/",
        podspecPath: "../node_modules/expo-financekit/expo-financekit.podspec",
      },
    },
  },
};
