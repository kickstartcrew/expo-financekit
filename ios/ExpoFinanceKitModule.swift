import ExpoModulesCore
import FinanceKit
import Foundation

@available(iOS 17.4, *)
public class ExpoFinanceKitModule: Module {
    private let implementation = ExpoFinanceKitModuleImpl.shared

    public func definition() -> ModuleDefinition {
        Name("ExpoFinanceKitModule")

        AsyncFunction("requestAuthorization") { (promise: Promise) in
            Task {
                await self.implementation.requestAuthorizationWithResolver(
                    { result in
                        promise.resolve(result)
                    },
                    rejecter: { code, message, error in
                        promise.reject(code ?? "UNKNOWN_ERROR", message ?? "Unknown error")
                    }
                )
            }
        }

        AsyncFunction("getAuthorizationStatus") { (promise: Promise) in
            Task {
                await self.implementation.getAuthorizationStatusWithResolver(
                    { result in
                        promise.resolve(result)
                    },
                    rejecter: { code, message, error in
                        promise.reject(code ?? "UNKNOWN_ERROR", message ?? "Unknown error")
                    }
                )
            }
        }

        AsyncFunction("getAccounts") { (promise: Promise) in
            Task {
                await self.implementation.getAccountsWithResolver(
                    { result in
                        promise.resolve(result)
                    },
                    rejecter: { code, message, error in
                        promise.reject(code ?? "UNKNOWN_ERROR", message ?? "Unknown error")
                    }
                )
            }
        }

        AsyncFunction("getTransactions") { (params: [String: Any], promise: Promise) in
            Task {
                await self.implementation.getTransactionsWithParams(
                    params as NSDictionary,
                    resolver: { result in
                        promise.resolve(result)
                    },
                    rejecter: { code, message, error in
                        promise.reject(code ?? "UNKNOWN_ERROR", message ?? "Unknown error")
                    }
                )
            }
        }

        AsyncFunction("getAllTransactions") { (params: [String: Any], promise: Promise) in
            Task {
                await self.implementation.getAllTransactionsWithParams(
                    params as NSDictionary,
                    resolver: { result in
                        promise.resolve(result)
                    },
                    rejecter: { code, message, error in
                        promise.reject(code ?? "UNKNOWN_ERROR", message ?? "Unknown error")
                    }
                )
            }
        }
    }
}
