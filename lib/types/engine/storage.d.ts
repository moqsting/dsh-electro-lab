export interface IndexRow {
    id: string;
    openedAt: number;
    sealedAt: number | null;
    question: string;
}
export interface TraceRow {
    seq: number;
    tool: string;
    ok: boolean;
    at: number;
    [key: string]: unknown;
}
export declare class RecordStore {
    private readonly home;
    constructor(home: string);
    private indexFile;
    recordsDir(): string;
    recordFile(id: string): string;
    /** Read all index rows (file order). */
    readIndex(): IndexRow[];
    private writeIndex;
    /** Append an index row (new record). */
    appendIndex(row: IndexRow): void;
    /** Update one index row (seal). */
    updateIndex(id: string, patch: Partial<IndexRow>): void;
    /** Startup consistency: remove orphan index rows whose sealedAt is null and have no body file. */
    clearOrphans(): void;
    /** Create a record: create the directory and append the index row; the caller writes the body's first line. Returns id and openedAt. */
    createRecord(question: string): {
        id: string;
        openedAt: number;
    };
    /** Append one trace row (synchronous write). */
    appendRow(id: string, row: TraceRow): void;
    /** Read every row of a body. */
    readRows(id: string): TraceRow[];
    /** Whether the body file exists. */
    hasRecord(id: string): boolean;
    /** Delete a record (body + index row) — not required by the core design; kept for future administration. */
    deleteRecord(id: string): void;
    /** Every id inside the records/ directory. */
    recordIds(): string[];
}
