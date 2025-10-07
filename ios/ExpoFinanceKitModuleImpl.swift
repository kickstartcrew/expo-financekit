import FinanceKit
import Foundation

extension Decimal {
    var doubleValue: Double {
        NSDecimalNumber(decimal: self).doubleValue
    }
}

@available(iOS 17.4, *)
@objc(ExpoFinanceKitModuleImpl)
@objcMembers
public class ExpoFinanceKitModuleImpl: NSObject {
    public static let shared = ExpoFinanceKitModuleImpl()
    private let store = FinanceStore.shared
    private override init() {
        super.init()
    }

    public func requestAuthorizationWithResolver(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            guard FinanceStore.isDataAvailable(.financialData) else {
                await MainActor.run {
                    reject("NO_DATA_AVAILABLE", "No financial data available on this device", nil)
                }
                return
            }
            do {
                let status = try await store.requestAuthorization()
                let result = self.authStatusToDict(status)
                await MainActor.run {
                    resolve(result)
                }
            } catch {
                await MainActor.run {
                    reject("AUTHORIZATION_ERROR", error.localizedDescription, error)
                }
            }
        }
    }

    public func getAuthorizationStatusWithResolver(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            guard FinanceStore.isDataAvailable(.financialData) else {
                await MainActor.run {
                    reject("NO_DATA_AVAILABLE", "No financial data available on this device", nil)
                }
                return
            }
            do {
                let status = try await store.authorizationStatus()
                let result = self.authStatusToDict(status)
                await MainActor.run {
                    resolve(result)
                }
            } catch {
                await MainActor.run {
                    reject("AUTHORIZATION_ERROR", error.localizedDescription, error)
                }
            }
        }
    }

    public func getAccountsWithResolver(
        _ resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            guard FinanceStore.isDataAvailable(.financialData) else {
                await MainActor.run {
                    reject("NO_DATA_AVAILABLE", "No financial data available on this device", nil)
                }
                return
            }
            do {
                let query = AccountQuery()
                let accounts = try await store.accounts(query: query)
                let balances = try await self.fetchBalances()
                let result = accounts.map { account -> [String: Any] in
                    let accountId = account.id.uuidString
                    var dict: [String: Any] = [
                        "id": accountId,
                        "name": account.displayName,
                        "institutionName": account.institutionName,
                        "accountDescription": account.accountDescription ?? "",
                        "currency": account.currencyCode,

                    ]

                    var accountType = "unknown"
                    var balanceAmount: Double = 0.0
                    if let balanceDict = balances.first(where: {
                        $0["accountId"] as? String == accountId
                    }),
                        let amount = balanceDict["amount"] as? Double
                    {
                        balanceAmount = amount
                        dict["balance"] = amount
                        dict["currency"] = balanceDict["currencyCode"] as? String ?? "USD"
                    }
                    if account.assetAccount != nil {
                        accountType = "asset"
                    } else if let liabilityAccount = account.liabilityAccount {
                        accountType = "liability"
                        if let creditLimit = liabilityAccount.creditInformation.creditLimit {
                            balanceAmount = creditLimit.amount.doubleValue - balanceAmount
                            dict["balance"] = balanceAmount
                        }
                    }
                    dict["type"] = accountType
                    return dict
                }
                await MainActor.run {
                    resolve(result)
                }
            } catch {
                await MainActor.run {
                    reject("ACCOUNTS_ERROR", error.localizedDescription, error)
                }
            }
        }
    }

    public func getTransactionsWithParams(
        _ params: NSDictionary,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            guard FinanceStore.isDataAvailable(.financialData) else {
                await MainActor.run {
                    reject("NO_DATA_AVAILABLE", "No financial data available on this device", nil)
                }
                return
            }
            do {
                guard let accountIdString = params["accountId"] as? String,
                    let uuid = UUID(uuidString: accountIdString)
                else {
                    await MainActor.run {
                        reject("INVALID_ACCOUNT_ID", "Invalid account ID provided", nil)
                    }
                    return
                }
                let predicate: Predicate<Transaction>? = #Predicate<Transaction> { transaction in
                    transaction.accountID == uuid
                }
                let query = TransactionQuery(
                    sortDescriptors: [
                        SortDescriptor(\Transaction.transactionDate, order: .reverse)
                    ],
                    predicate: predicate,
                    limit: nil,
                    offset: nil
                )
                let transactions = try await store.transactions(query: query)
                let result = transactions.map { self.transactionToDict($0) }
                await MainActor.run {
                    resolve(result)
                }
            } catch {
                await MainActor.run {
                    reject("TRANSACTIONS_ERROR", error.localizedDescription, error)
                }
            }
        }
    }

    public func getAllTransactionsWithParams(
        _ params: NSDictionary,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            guard FinanceStore.isDataAvailable(.financialData) else {
                await MainActor.run {
                    reject("NO_DATA_AVAILABLE", "No financial data available on this device", nil)
                }
                return
            }
            do {
                let query = TransactionQuery(
                    sortDescriptors: [
                        SortDescriptor(\Transaction.transactionDate, order: .reverse)
                    ],
                    predicate: nil,
                    limit: nil,
                    offset: nil
                )
                let transactions = try await store.transactions(query: query)
                let result = transactions.map { self.transactionToDict($0) }
                await MainActor.run {
                    resolve(result)
                }
            } catch {
                await MainActor.run {
                    reject("TRANSACTIONS_ERROR", error.localizedDescription, error)
                }
            }
        }
    }

    private func authStatusToDict(_ status: AuthorizationStatus) -> [String: Any] {
        let statusString: String
        let isAuthorized: Bool
        switch status {
        case .authorized:
            statusString = "authorized"
            isAuthorized = true
        case .denied:
            statusString = "denied"
            isAuthorized = false
        case .notDetermined:
            statusString = "notDetermined"
            isAuthorized = false
        @unknown default:
            statusString = "unknown"
            isAuthorized = false
        }
        return [
            "status": statusString,
            "isAuthorized": isAuthorized,
        ]
    }

    private func fetchBalances() async throws -> [[String: Any?]] {
        let query = AccountBalanceQuery()
        let balances = try await store.accountBalances(query: query)
        var uniqueBalances: [String: AccountBalance] = [:]
        for balance in balances {
            let accountIdString = balance.accountID.uuidString
            uniqueBalances[accountIdString] = balance
        }
        return uniqueBalances.values.map { balance in
            var amount: Decimal = 0.0
            if case .available(let availableBalance) = balance.currentBalance {
                amount = availableBalance.amount.amount
            } else if case .booked(let bookedBalance) = balance.currentBalance {
                amount = bookedBalance.amount.amount
            } else if case .availableAndBooked(let availableBalance, _) = balance.currentBalance {
                amount = availableBalance.amount.amount
            }
            return [
                "id": balance.id.uuidString,
                "amount": amount.doubleValue,
                "currencyCode": balance.currencyCode,
                "accountId": balance.accountID.uuidString,
            ]
        }
    }

    private func transactionToDict(_ transaction: Transaction) -> [String: Any] {
        var result: [String: Any] = [
            "id": transaction.id.uuidString,
            "accountID": transaction.accountID.uuidString,
            "amount": transaction.transactionAmount.amount.doubleValue,
            "currency": transaction.transactionAmount.currencyCode,
            "date": ISO8601DateFormatter().string(from: transaction.transactionDate),
            "description": transaction.transactionDescription,
            "merchantName": transaction.merchantName ?? "",
            "category": transaction.merchantCategoryCode?.rawValue ?? "",
            "creditDebitIndicator": String(describing: transaction.creditDebitIndicator)
                .lowercased(),
        ]
        return result
    }
}

public typealias RCTPromiseResolveBlock = (Any?) -> Void
public typealias RCTPromiseRejectBlock = (String?, String?, Error?) -> Void
