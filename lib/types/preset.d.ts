/**
 * Sync every packaged preset into the user preset root, overwriting any
 * existing copy. Returns the ids it synced (for logging); throws on
 * filesystem errors so the caller can warn without breaking the plugin.
 */
export declare function installPresets(): string[];
