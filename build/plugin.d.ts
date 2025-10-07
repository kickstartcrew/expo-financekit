import { ConfigPlugin } from "@expo/config-plugins";
export interface FinanceKitPluginProps {
    /**
     * The bundle identifier for your app (usually matches your app's bundle ID)
     */
    bundleIdentifier?: string;
    /**
     * Array of FinanceKit permissions to request
     * Available: 'read', 'write'
     *
     * IMPORTANT: FinanceKit requires special Apple Developer Program approval.
     * Set to false or omit if you don't have FinanceKit entitlement approval.
     */
    permissions?: ("read" | "write")[] | false;
    /**
     * Custom usage description for FinanceKit access
     */
    usageDescription?: string;
    /**
     * Whether to add FinanceKit entitlements to the app
     * Set to false if you don't have Apple Developer Program approval for FinanceKit
     * Default: true
     */
    addEntitlements?: boolean;
}
declare const _default: ConfigPlugin<FinanceKitPluginProps>;
export default _default;
//# sourceMappingURL=plugin.d.ts.map