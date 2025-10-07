# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-01-19

### Changed
- **BREAKING CHANGE**: Minimum iOS version requirement raised from 17.0 to 17.4
- Removed iOS 17.0-17.3 compatibility code and version checks
- Simplified Swift implementation by removing conditional availability checks
- All FinanceKit features now require iOS 17.4 or higher

### Fixed
- Fixed `'requestAuthorization()' is only available in iOS 17.4 or newer` errors
- Resolved FinanceKit type reference issues
- Improved authorization status handling

### Updated
- Documentation to reflect iOS 17.4 minimum requirement
- Podspec deployment target to iOS 17.4
- Setup script to enforce iOS 17.4 deployment target

## [0.1.1] - 2024-01-19

### Fixed
- FinanceKit type errors (`AuthorizationStatus` and `AccountType` references)
- Swift/Objective-C interop issues
- Module import errors

### Added
- Generic type handling for better iOS version compatibility
- Debug helper file for FinanceKit type inspection

## [0.1.0] - 2024-01-19

### Added
- Initial release
- Basic FinanceKit integration for iOS
- Support for authorization requests
- Account fetching functionality
- Transaction retrieval (per account and all accounts)
- Expo config plugin for automatic setup
- TypeScript definitions
- Comprehensive documentation
- iOS setup script for dependency management
- Example app demonstrating all features

### Features
- Request and check FinanceKit authorization status
- Retrieve user's financial accounts with balances
- Fetch transactions with date filtering
- Full TypeScript support
- Automatic Info.plist and entitlements configuration

[0.2.0]: https://github.com/yourusername/expo-financekit/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/yourusername/expo-financekit/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/yourusername/expo-financekit/releases/tag/v0.1.0