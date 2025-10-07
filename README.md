# expo-financekit

A React Native Expo module for accessing iOS FinanceKit to read financial data from Apple Wallet.

## Requirements

- iOS 17.4 or higher
- Expo SDK 51 or higher
- React Native 0.73 or higher
- Apple Developer account with FinanceKit entitlement

## Installation

```bash
npm install @kickstartcrew/expo-financekit
cd ios && pod install  # Required for iOS
```

## ⚠️ Important: Apple Developer Program Requirements

**FinanceKit requires special approval from Apple's Developer Program team:**

- Regular **Team Provisioning Profiles DO NOT support FinanceKit entitlements**
- You must request FinanceKit capability approval from Apple Developer Program
- Without approval, your app will fail to build with: *"iOS Team Provisioning Profile doesn't match the entitlements file's value for the com.apple.developer.financekit entitlement"*

## Configuration

Add NSFinancialDataUsageDescription to your Info.plist file:

<key>NSFinancialDataUsageDescription</key>
<string>This app needs access to your financial data to provide personalized insights.</string>

OR in app.json

ios: {
  "infoPlist": {
    "NSFinancialDataUsageDescription": "This app needs access to your financial data to provide personalized insights."
  }
}
### For Development/Testing (Recommended)

Use this configuration to avoid entitlement errors while developing:

```json
{
  "expo": {
    "plugins": [
      [
        "@kickstartcrew/expo-financekit",
        {
          "addEntitlements": false,
          "usageDescription": "This app needs access to your financial data to provide personalized insights."
        }
      ]
    ]
  }
}
```

### For Production (Only if you have Apple approval)

```json
{
  "expo": {
    "plugins": [
      [
        "@kickstartcrew/expo-financekit",
        {
          "permissions": ["read"],
          "usageDescription": "This app needs access to your financial data to provide personalized insights."
        }
      ]
    ]
  }
}
```

2. **Run prebuild to generate native code:**

```bash
npx expo prebuild -p ios --clear
```

3. **Run the iOS setup script:**

```bash
npm run setup:ios
```

This will clean and install all iOS dependencies properly.

4. **Configure FinanceKit Entitlement:**

You need to add the FinanceKit entitlement to your app in the Apple Developer portal:
- Go to your app's identifier in the Apple Developer portal
- Enable the FinanceKit capability
- Download and install the updated provisioning profile

## Usage

```typescript
import ExpoFinanceKit from '@kickstartcrew/expo-financekit';

// Check if FinanceKit is available
if (ExpoFinanceKit.isAvailable()) {
  // Request authorization
  const authStatus = await ExpoFinanceKit.requestAuthorization();

  if (authStatus.isAuthorized) {
    // Get accounts
    const accounts = await ExpoFinanceKit.getAccounts();
    console.log('Accounts:', accounts);

    // Get transactions for a specific account
    const transactions = await ExpoFinanceKit.getTransactions(
      accounts[0].id,
      new Date('2024-01-01'),
      new Date()
    );
    console.log('Transactions:', transactions);

    // Get all transactions across accounts
    const allTransactions = await ExpoFinanceKit.getAllTransactions(
      new Date('2024-01-01'),
      new Date()
    );
    console.log('All transactions:', allTransactions);
  }
}
```

## API Reference

### `requestAuthorization()`

Request authorization to access FinanceKit data.

**Returns:** `Promise<FinanceKitAuthStatus>`

```typescript
interface FinanceKitAuthStatus {
  isAuthorized: boolean;
  status: 'notDetermined' | 'restricted' | 'denied' | 'authorized';
}
```

### `getAuthorizationStatus()`

Check the current authorization status without prompting the user.

**Returns:** `Promise<FinanceKitAuthStatus>`

### `getAccounts()`

Get the user's financial accounts.

**Returns:** `Promise<FinanceKitAccount[]>`

```typescript
interface FinanceKitAccount {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
}
```

### `getTransactions(accountId, startDate?, endDate?)`

Get transactions for a specific account.

**Parameters:**
- `accountId: string` - The ID of the account
- `startDate?: Date` - Optional start date filter
- `endDate?: Date` - Optional end date filter

**Returns:** `Promise<FinanceKitTransaction[]>`

```typescript
interface FinanceKitTransaction {
  id: string;
  amount: number;
  currency: string;
  description?: string;
  date: string;
  category?: string;
  merchant?: string;
}
```

### `getAllTransactions(startDate?, endDate?)`

Get all transactions across all accounts.

**Parameters:**
- `startDate?: Date` - Optional start date filter
- `endDate?: Date` - Optional end date filter

**Returns:** `Promise<FinanceKitTransaction[]>`

### `isAvailable()`

Check if FinanceKit is available on the current device.

**Returns:** `boolean`

## Troubleshooting

### Common Build Errors

#### Error: "Could not build Objective-C module 'expo_financekit'"

**Solution:**
```bash
# Run the iOS setup script
npm run setup:ios

# Or manually clean and rebuild:
cd ios
rm -rf Pods Podfile.lock build ~/Library/Developer/Xcode/DerivedData/*
pod deintegrate
pod install --repo-update
cd ..
npx expo run:ios --clear
```

#### Error: "ExpoModulesCore/Swift.h file not found"

**Solution:**
1. Ensure you have the latest version of expo-financekit
2. Clean your build: `cd ios && xcodebuild clean`
3. Reinstall pods: `pod install --repo-update`
4. If using Xcode, clean build folder: Cmd+Shift+K

#### Swift compilation errors

If you encounter Swift compilation errors like:
- `Invalid redeclaration of 'store'`
- `@objc can only be used with members of classes`
- `Cannot find 'self' in scope`

**Solution:**
1. Make sure you're using Xcode 15 or higher
2. Ensure your iOS deployment target is set to 17.4 or higher
3. Run the setup script: `npm run setup:ios`

#### FinanceKit Type Errors

If you encounter errors like:
- `'AuthorizationStatus' is not a member type of class 'FinanceKit.FinanceStore'`
- `'AccountType' is not a member type of enum 'FinanceKit.Account'`

These errors occur because FinanceKit's API varies between iOS versions. The package handles this internally by:
- Using generic type handling for authorization status
- Inferring account types from available properties
- Adapting to different iOS 17.x versions

**Solution:**
1. Ensure you're using iOS 17.4 or higher as the deployment target
2. Clean and rebuild: `npm run setup:ios`
3. If errors persist, clear DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData/*`

**Note:** This package requires iOS 17.4 or higher for full FinanceKit API access including the `authorizationStatus()` method.

### Module Not Found

If you get "The package '@kickstartcrew/expo-financekit' doesn't seem to be linked":

**Solution:**
1. Make sure you're not using Expo Go (FinanceKit requires a custom development build)
2. Run `npx expo prebuild -p ios --clear` to regenerate native code
3. Run the setup script: `npm run setup:ios`
4. Rebuild your app: `npx expo run:ios`

### Build Script

The package includes a setup script that automatically:
- Cleans old build artifacts
- Updates CocoaPods
- Reinstalls iOS dependencies
- Clears Xcode DerivedData

Run it with:
```bash
npm run setup:ios
```

### Authorization Issues

If authorization is always denied:

**Solution:**
1. Check that your app has the FinanceKit entitlement in the Apple Developer portal
2. Ensure you've provided a usage description in your plugin configuration
3. Check that the user has financial data in Apple Wallet
4. Test on a real device (FinanceKit doesn't work in the simulator)

## Platform Support

This library only works on iOS 17.4 and higher. Android is not supported as FinanceKit is an Apple-only framework.

### iOS Version Compatibility

| iOS Version | Support Level | Notes |
|-------------|---------------|-------|
| 17.4+ | ✅ Full Support | All FinanceKit features available |
| < 17.4 | ❌ Not Supported | FinanceKit API incomplete |

The package requires iOS 17.4 or higher for access to all FinanceKit features.

## Example App

Check out the [example app](https://github.com/yourusername/expo-financekit/tree/main/example) for a complete implementation.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a PR.

## License

MIT

## Support

For issues and feature requests, please [open an issue](https://github.com/yourusername/expo-financekit/issues) on GitHub.
