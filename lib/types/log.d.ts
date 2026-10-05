/** Severity, lowest first; Off silences every sink. */
export declare enum LogLevel {
    Debug = "debug",
    Info = "info",
    Warn = "warn",
    Error = "error",
    Off = "off"
}
/** The object handed to a log call: any object, JSON-typed values. */
export type LogFields = object;
/** One destination for finished lines. A sink reports its own failure by throwing; the logger disables it. */
export interface LogSink {
    write(line: string, level: LogLevel): void;
}
/** The plugin's log surface. */
export interface Logger {
    debug(message: string, fields?: LogFields): void;
    info(message: string, fields?: LogFields): void;
    warn(message: string, fields?: LogFields): void;
    error(message: string, fields?: LogFields): void;
}
/** Parse a `DSH_ELECTRO_LAB_LOG_LEVEL` word; anything unknown keeps the default. */
export declare function resolveLevel(word: string | undefined): LogLevel;
/** Set the one global level shared by every sink. */
export declare function setLevel(next: LogLevel): void;
/** One log line, plus continuation lines when an Error's stack is logged with it. */
export declare function formatLine(severity: LogLevel, message: string, fields?: LogFields, at?: Date): string;
/** The plugin's one logger. With no sink attached (module load, tests) every call is a no-op. */
export declare const log: Logger;
/** Replace every sink; returns a detach for the whole set. Used by tests. */
export declare function setSinks(...list: LogSink[]): () => void;
/** Console sink: every line on stdout, the level label colored when stdout is a terminal. */
export declare function attachConsoleSink(): () => void;
/**
 * Attach the per-run file sink: `<home>/logs/<YYYY-MM-DD_HH-mm-ss.SSS>.log`, one file per plugin
 * mount — that is, per host run — pruned to the newest KEEP_RUNS. The file is created exclusively and
 * held open, and is plain event lines; nothing about the run is recorded outside it. Writing is
 * synchronous on the held descriptor, so the last lines survive a crash and nothing needs flushing.
 * Throws only if no log file could be created — the caller decides whether logging is worth failing
 * over.
 */
export declare function attachFileSink(home: string): {
    file: string;
    close(): void;
};
