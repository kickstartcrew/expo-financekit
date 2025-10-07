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

export interface ExpoFinanceKitModule {
  requestAuthorization(): Promise<FinanceKitAuthStatus>;
  getAuthorizationStatus(): Promise<FinanceKitAuthStatus>;
  getAccounts(): Promise<FinanceKitAccount[]>;
  getTransactions(params: {
    accountId: string;
    startDate?: string;
    endDate?: string;
  }): Promise<FinanceKitTransaction[]>;
  getAllTransactions(params: {
    startDate?: string;
    endDate?: string;
  }): Promise<FinanceKitTransaction[]>;
}

export default {} as ExpoFinanceKitModule;
