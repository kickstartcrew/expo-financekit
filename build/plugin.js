"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const FINANCEKIT_USAGE_DESCRIPTION = "This app uses FinanceKit to access financial data for enhanced user experience.";
const withFinanceKitInfoPlist = (config, props = {}) => {
    return (0, config_plugins_1.withInfoPlist)(config, (config) => {
        const usageDescription = props.usageDescription || FINANCEKIT_USAGE_DESCRIPTION;
        config.modResults.NSFinanceKitUsageDescription = usageDescription;
        // Ensure iOS 17.4+ deployment target (FinanceKit requirement)
        const currentTarget = config.modResults.MinimumOSVersion ||
            config.modResults.LSMinimumSystemVersion;
        const targetVersion = parseFloat(String(currentTarget || "13.0"));
        if (targetVersion < 17.4) {
            config_plugins_1.WarningAggregator.addWarningIOS("expo-financekit", "FinanceKit requires iOS 17.4 or higher. Please update your deployment target to 17.4 or higher.");
            config.modResults.MinimumOSVersion = "17.4";
            config.modResults.LSMinimumSystemVersion = "17.4";
        }
        return config;
    });
};
const withFinanceKitEntitlements = (config, props = {}) => {
    return (0, config_plugins_1.withEntitlementsPlist)(config, (config) => {
        const addEntitlements = props.addEntitlements !== false;
        const permissions = props.permissions;
        if (addEntitlements && permissions !== false) {
            const permissionsArray = Array.isArray(permissions) ? permissions : ["read"];
            // Add FinanceKit entitlements
            config.modResults["com.apple.developer.financekit"] = permissionsArray;
            config_plugins_1.WarningAggregator.addWarningIOS("expo-financekit", "FinanceKit entitlements added. Ensure your Apple Developer Program account has FinanceKit capability approval. Without approval, builds will fail with provisioning profile errors.");
        }
        else {
            config_plugins_1.WarningAggregator.addWarningIOS("expo-financekit", "FinanceKit entitlements skipped. The module will still work for development/testing, but FinanceKit features will be unavailable.");
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
const withFinanceKit = (config, props = {}) => {
    // Validate that we're on iOS
    if (config.ios?.bundleIdentifier && !props.bundleIdentifier) {
        props.bundleIdentifier = config.ios.bundleIdentifier;
    }
    config = withFinanceKitInfoPlist(config, props);
    config = withFinanceKitEntitlements(config, props);
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withFinanceKit, "expo-financekit", "1.0.0");
//# sourceMappingURL=plugin.js.map