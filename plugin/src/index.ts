import {
  ConfigPlugin,
  withInfoPlist,
  withEntitlementsPlist,
  createRunOncePlugin,
  WarningAggregator,
} from "@expo/config-plugins";

export interface FinanceKitPluginProps {
  /**
   * The bundle identifier for your app (usually matches your app's bundle ID)
   */
  bundleIdentifier?: string;
  /**
   * Array of FinanceKit permissions to request
   * Available: 'read', 'write'
   * 
   * IMPORTANT: FinanceKit requires special Apple Developer Program approval.
   * Set to false or omit if you don't have FinanceKit entitlement approval.
   */
  permissions?: ("read" | "write")[] | false;
  /**
   * Custom usage description for FinanceKit access
   */
  usageDescription?: string;
  /**
   * Whether to add FinanceKit entitlements to the app
   * Set to false if you don't have Apple Developer Program approval for FinanceKit
   * Default: true
   */
  addEntitlements?: boolean;
}

const FINANCEKIT_USAGE_DESCRIPTION =
  "This app uses FinanceKit to access financial data for enhanced user experience.";

const withFinanceKitInfoPlist: ConfigPlugin<FinanceKitPluginProps> = (
  config,
  props = {},
) => {
  return withInfoPlist(config, (config) => {
    const usageDescription =
      props.usageDescription || FINANCEKIT_USAGE_DESCRIPTION;

    config.modResults.NSFinanceKitUsageDescription = usageDescription;

    // Ensure iOS 17.4+ deployment target (FinanceKit requirement)
    const currentTarget =
      config.modResults.MinimumOSVersion ||
      config.modResults.LSMinimumSystemVersion;
    const targetVersion = parseFloat(String(currentTarget || "13.0"));

    if (targetVersion < 17.4) {
      WarningAggregator.addWarningIOS(
        "expo-financekit",
        "FinanceKit requires iOS 17.4 or higher. Please update your deployment target to 17.4 or higher.",
      );

      config.modResults.MinimumOSVersion = "17.4";
      config.modResults.LSMinimumSystemVersion = "17.4";
    }

    return config;
  });
};

const withFinanceKitEntitlements: ConfigPlugin<FinanceKitPluginProps> = (
  config,
  props = {},
) => {
  return withEntitlementsPlist(config, (config) => {
    const addEntitlements = props.addEntitlements !== false;
    const permissions = props.permissions;

    if (addEntitlements && permissions !== false) {
      const permissionsArray = Array.isArray(permissions) ? permissions : ["read"];
      
      // Add FinanceKit entitlements
      config.modResults["com.apple.developer.financekit"] = permissionsArray;
      
      WarningAggregator.addWarningIOS(
        "expo-financekit",
        "FinanceKit entitlements added. Ensure your Apple Developer Program account has FinanceKit capability approval. Without approval, builds will fail with provisioning profile errors."
      );
    } else {
      WarningAggregator.addWarningIOS(
        "expo-financekit",
        "FinanceKit entitlements skipped. The module will still work for development/testing, but FinanceKit features will be unavailable."
      );
    }

    return config;
  });
};

/**
 * Expo config plugin for FinanceKit integration
 *
 * @example
 * // For development/testing without FinanceKit entitlements
 * {
 *   "plugins": [
 *     [
 *       "@kickstartcrew/expo-financekit",
 *       {
 *         "addEntitlements": false,
 *         "usageDescription": "This app needs access to financial data to provide personalized insights."
 *       }
 *     ]
 *   ]
 * }
 *
 * @example
 * // For production with Apple Developer Program FinanceKit approval
 * {
 *   "plugins": [
 *     [
 *       "@kickstartcrew/expo-financekit",
 *       {
 *         "permissions": ["read"],
 *         "usageDescription": "This app needs access to financial data to provide personalized insights."
 *       }
 *     ]
 *   ]
 * }
 */
const withFinanceKit: ConfigPlugin<FinanceKitPluginProps> = (
  config,
  props = {},
) => {
  // Validate that we're on iOS
  if (config.ios?.bundleIdentifier && !props.bundleIdentifier) {
    props.bundleIdentifier = config.ios.bundleIdentifier;
  }

  config = withFinanceKitInfoPlist(config, props);
  config = withFinanceKitEntitlements(config, props);

  return config;
};

export default createRunOncePlugin(withFinanceKit, "expo-financekit", "1.0.0");
