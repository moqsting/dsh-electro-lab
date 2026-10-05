import { type Record } from './generate.ts';
/** Minimal structural shape of the web-server route registry. */
export interface WebServerLike {
    register(route: {
        kind: 'exact';
        path: string;
        handler(req: unknown, res: {
            statusCode?: number;
            setHeader(name: string, value: string): void;
            end(body: string): void;
        }): void | Promise<void>;
    }): () => void;
}
/** Minimal request shape the endpoints read (method + url for query parsing). */
export interface RequestLike {
    method?: string;
    url?: string;
}
/** Services the generation endpoints need: webServer plus optional llm runtime/default model. */
export interface GenerateContext {
    webServer: WebServerLike;
    get?(name: string): unknown;
    logger?: {
        warn(...parts: unknown[]): void;
    };
}
/** How the host resolves one record for generation (engine store → Record facts). */
export interface GenerateDeps {
    home: string;
    loadRecord(id: string): Record | undefined;
}
/** The web paths of the generation subsystem (shared wire contract host ↔ client). */
export declare const GENERATE_PATH = "/api/dsh-electro-lab/generate";
export declare const GENERATE_PROGRESS_PATH = "/api/dsh-electro-lab/generate-progress";
export declare const GENERATE_CANCEL_PATH = "/api/dsh-electro-lab/generate-cancel";
export declare const REVEAL_PATH = "/api/dsh-electro-lab/reveal";
export declare const LIST_DIRS_PATH = "/api/dsh-electro-lab/list-dirs";
export declare const LIST_ROOTS_PATH = "/api/dsh-electro-lab/list-roots";
export declare const DIRECTORY_TREE_CSS_PATH = "/api/dsh-electro-lab/directory-tree.css";
export declare const GENERATE_DIR_PATH = "/api/dsh-electro-lab/generate-dir";
export declare const GENERATE_CAPABILITY_PATH = "/api/dsh-electro-lab/generate-capability";
interface DriverProbe {
    command: string;
    ok: boolean;
    /** The command to run, when it answered (a resolved path when the probe had to look one up). */
    path?: string;
    /** Why it cannot be used, in one short line, when it cannot. */
    detail?: string;
}
/** What this machine can compile with, and what its shells may be missing. */
export interface CapabilityReport {
    /** True when a driver and the engine it runs are both usable: the run may start. */
    ready: boolean;
    /** The command the run will compile with, or null when nothing can. */
    driver: string | null;
    drivers: DriverProbe[];
    engine: DriverProbe;
    missingPackages: string[];
}
/** Register every generation endpoint; returns one disposer for all of them. */
export declare function registerGenerateEndpoints(ctx: GenerateContext, deps: GenerateDeps): () => void;
export {};
