"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestAuthorization = requestAuthorization;
exports.getAuthorizationStatus = getAuthorizationStatus;
exports.getAccounts = getAccounts;
exports.getTransactions = getTransactions;
exports.getAllTransactions = getAllTransactions;
exports.isAvailable = isAvailable;
const expo_modules_core_1 = require("expo-modules-core");
const react_native_1 = require("react-native");
const LINKING_ERROR = `The package '@kickstartcrew/expo-financekit' doesn't seem to be linked. Make sure: \n\n` +
    react_native_1.Platform.select({
        ios: "- You have run 'cd ios && pod install'\n",
        default: "",
    }) +
    "- You rebuilt the app after installing the package\n" +
    "- You are not using Expo Go\n" +
    "- This library only works on iOS 17.0+";
const ExpoFinanceKitModule = (0, expo_modules_core_1.requireNativeModule)("ExpoFinanceKitModule");
const ExpoFinanceKit = ExpoFinanceKitModule
    ? ExpoFinanceKitModule
    : new Proxy({}, {
        get() {
            throw new Error(LINKING_ERROR);
        },
    });
/**
 * Request authorization to access FinanceKit data
 */
function requestAuthorization() {
    if (react_native_1.Platform.OS !== "ios") {
        return Promise.reject(new Error("FinanceKit is only available on iOS"));
    }
    return ExpoFinanceKit.requestAuthorization();
}
/**
 * Check current authorization status
 */
function getAuthorizationStatus() {
    if (react_native_1.Platform.OS !== "ios") {
        return Promise.reject(new Error("FinanceKit is only available on iOS"));
    }
    return ExpoFinanceKit.getAuthorizationStatus();
}
/**
 * Get user's financial accounts
 */
function getAccounts() {
    if (react_native_1.Platform.OS !== "ios") {
        return Promise.reject(new Error("FinanceKit is only available on iOS"));
    }
    return ExpoFinanceKit.getAccounts();
}
/**
 * Get transactions for a specific account
 */
function getTransactions(accountId, startDate, endDate) {
    if (react_native_1.Platform.OS !== "ios") {
        return Promise.reject(new Error("FinanceKit is only available on iOS"));
    }
    const params = { accountId };
    if (startDate)
        params.startDate = startDate.toISOString();
    if (endDate)
        params.endDate = endDate.toISOString();
    return ExpoFinanceKit.getTransactions(params);
}
/**
 * Get all transactions across accounts
 */
function getAllTransactions(startDate, endDate) {
    if (react_native_1.Platform.OS !== "ios") {
        return Promise.reject(new Error("FinanceKit is only available on iOS"));
    }
    const params = {};
    if (startDate)
        params.startDate = startDate.toISOString();
    if (endDate)
        params.endDate = endDate.toISOString();
    return ExpoFinanceKit.getAllTransactions(params);
}
/**
 * Check if FinanceKit is available on the current device
 */
function isAvailable() {
    return react_native_1.Platform.OS === "ios" && ExpoFinanceKitModule != null;
}
exports.default = {
    requestAuthorization,
    getAuthorizationStatus,
    getAccounts,
    getTransactions,
    getAllTransactions,
    isAvailable,
};
//# sourceMappingURL=ExpoFinanceKit.js.map