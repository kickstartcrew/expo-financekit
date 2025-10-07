import { requireNativeModule } from "expo-modules-core";
import { Platform } from "react-native";

const LINKING_ERROR =
  `The package '@kickstartcrew/expo-financekit' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({
    ios: "- You have run 'cd ios && pod install'\n",
    default: "",
  }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go\n" +
  "- This library only works on iOS 17.0+";

const ExpoFinanceKitModule = requireNativeModule("ExpoFinanceKitModule");

const ExpoFinanceKit = ExpoFinanceKitModule
  ? ExpoFinanceKitModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export interface FinanceKitTransaction {
  id: string;
  amount: number;
  currency: string;
  description?: string;
  date: string;
  category?: string;
  merchant?: string;
}

export interface FinanceKitAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: "checking" | "savings" | "credit" | "investment" | "loan";
}

export interface FinanceKitAuthStatus {
  isAuthorized: boolean;
  status: "notDetermined" | "restricted" | "denied" | "authorized";
}

/**
 * Request authorization to access FinanceKit data
 */
export function requestAuthorization(): Promise<FinanceKitAuthStatus> {
  if (Platform.OS !== "ios") {
    return Promise.reject(new Error("FinanceKit is only available on iOS"));
  }
  return ExpoFinanceKit.requestAuthorization();
}

/**
 * Check current authorization status
 */
export function getAuthorizationStatus(): Promise<FinanceKitAuthStatus> {
  if (Platform.OS !== "ios") {
    return Promise.reject(new Error("FinanceKit is only available on iOS"));
  }
  return ExpoFinanceKit.getAuthorizationStatus();
}

/**
 * Get user's financial accounts
 */
export function getAccounts(): Promise<FinanceKitAccount[]> {
  if (Platform.OS !== "ios") {
    return Promise.reject(new Error("FinanceKit is only available on iOS"));
  }
  return ExpoFinanceKit.getAccounts();
}

/**
 * Get transactions for a specific account
 */
export function getTransactions(
  accountId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<FinanceKitTransaction[]> {
  if (Platform.OS !== "ios") {
    return Promise.reject(new Error("FinanceKit is only available on iOS"));
  }

  const params: any = { accountId };
  if (startDate) params.startDate = startDate.toISOString();
  if (endDate) params.endDate = endDate.toISOString();

  return ExpoFinanceKit.getTransactions(params);
}

/**
 * Get all transactions across accounts
 */
export function getAllTransactions(
  startDate?: Date,
  endDate?: Date,
): Promise<FinanceKitTransaction[]> {
  if (Platform.OS !== "ios") {
    return Promise.reject(new Error("FinanceKit is only available on iOS"));
  }

  const params: any = {};
  if (startDate) params.startDate = startDate.toISOString();
  if (endDate) params.endDate = endDate.toISOString();

  return ExpoFinanceKit.getAllTransactions(params);
}

/**
 * Check if FinanceKit is available on the current device
 */
export function isAvailable(): boolean {
  return Platform.OS === "ios" && ExpoFinanceKitModule != null;
}

export default {
  requestAuthorization,
  getAuthorizationStatus,
  getAccounts,
  getTransactions,
  getAllTransactions,
  isAvailable,
};
