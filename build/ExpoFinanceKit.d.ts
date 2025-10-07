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
export declare function requestAuthorization(): Promise<FinanceKitAuthStatus>;
/**
 * Check current authorization status
 */
export declare function getAuthorizationStatus(): Promise<FinanceKitAuthStatus>;
/**
 * Get user's financial accounts
 */
export declare function getAccounts(): Promise<FinanceKitAccount[]>;
/**
 * Get transactions for a specific account
 */
export declare function getTransactions(accountId: string, startDate?: Date, endDate?: Date): Promise<FinanceKitTransaction[]>;
/**
 * Get all transactions across accounts
 */
export declare function getAllTransactions(startDate?: Date, endDate?: Date): Promise<FinanceKitTransaction[]>;
/**
 * Check if FinanceKit is available on the current device
 */
export declare function isAvailable(): boolean;
declare const _default: {
    requestAuthorization: typeof requestAuthorization;
    getAuthorizationStatus: typeof getAuthorizationStatus;
    getAccounts: typeof getAccounts;
    getTransactions: typeof getTransactions;
    getAllTransactions: typeof getAllTransactions;
    isAvailable: typeof isAvailable;
};
export default _default;
//# sourceMappingURL=ExpoFinanceKit.d.ts.map