#!/bin/bash

# iOS Setup Script for expo-financekit
# This script helps clean and rebuild the iOS project after installing expo-financekit

echo "🚀 Setting up expo-financekit for iOS..."

# Check if we're in an Expo/React Native project
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from your project root."
    exit 1
fi

# Check if ios directory exists
if [ ! -d "ios" ]; then
    echo "📱 iOS directory not found. Running expo prebuild..."
    npx expo prebuild -p ios
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to prebuild iOS project"
        exit 1
    fi
fi

echo "🧹 Cleaning iOS build artifacts..."

# Clean CocoaPods
if [ -d "ios/Pods" ]; then
    echo "  Removing Pods directory..."
    rm -rf ios/Pods
fi

if [ -f "ios/Podfile.lock" ]; then
    echo "  Removing Podfile.lock..."
    rm -f ios/Podfile.lock
fi

# Clean Xcode build artifacts
if [ -d "ios/build" ]; then
    echo "  Removing iOS build directory..."
    rm -rf ios/build
fi

# Clean DerivedData
echo "  Cleaning Xcode DerivedData..."
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean module cache
echo "  Cleaning module cache..."
cd ios
if command -v xcodebuild &> /dev/null; then
    xcodebuild -workspace *.xcworkspace -scheme * -configuration Debug clean 2>/dev/null || true
fi
cd ..

echo "📦 Installing CocoaPods dependencies..."
cd ios

# Install or update CocoaPods if needed
if ! command -v pod &> /dev/null; then
    echo "  CocoaPods not found. Installing..."
    sudo gem install cocoapods
fi

# Update pod repo
echo "  Updating CocoaPods repo..."
pod repo update

# Install pods
echo "  Installing pods..."
pod install --repo-update

if [ $? -ne 0 ]; then
    echo "⚠️  Warning: pod install failed. Trying with --verbose flag..."
    pod install --verbose
fi

cd ..

echo "✅ iOS setup complete!"
echo ""
echo "🔧 Checking iOS deployment target..."
# Update deployment target in Podfile if needed
if [ -f "ios/Podfile" ]; then
    if grep -q "platform :ios" ios/Podfile; then
        sed -i '' "s/platform :ios, '[0-9.]*'/platform :ios, '17.4'/" ios/Podfile
        echo "  ✅ Updated Podfile to iOS 17.4"
    fi
fi
echo ""
echo "📋 Next steps:"
echo "1. Make sure you have the FinanceKit entitlement in your Apple Developer account"
echo "2. Ensure your app.json includes the expo-financekit plugin:"
echo '   {
     "expo": {
       "plugins": [
         ["expo-financekit", {
           "permissions": ["read"],
           "usageDescription": "This app needs access to your financial data"
         }]
       ]
     }
   }'
echo "3. Build and run your app:"
echo "   npx expo run:ios"
echo ""
echo "⚠️  Important: FinanceKit requires iOS 17.4+ and won't work in the simulator"
echo "    Test on a real device with financial data in Apple Wallet"
