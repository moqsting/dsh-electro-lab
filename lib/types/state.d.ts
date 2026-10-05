/** Base name of the one state file (inside the records home). */
export declare const STATE_FILE = "state.json";
/** The state object as stored: flat keys, each owned by one module. */
export type PluginState = Record<string, unknown>;
export declare function statePath(home: string): string;
/** The current state; anything unreadable reads as {} (never throws). */
export declare function readState(home: string): PluginState;
/**
 * Read-modify-write the state file: `change` receives the current state and mutates the keys it
 * owns. Unrelated keys are preserved, and the result is written atomically. Returns the state that
 * was written.
 */
export declare function updateState(home: string, change: (state: PluginState) => void): PluginState;
