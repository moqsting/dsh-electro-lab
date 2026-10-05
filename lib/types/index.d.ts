import type { Context } from '@deepseek-ai/cordis';
import { Engine } from './engine/engine.ts';
/** Plugin identity for cordis.yml rows. */
export declare const name = "dsh-electro-lab";
/** Services required before mounting: the tool registry and the web server (endpoint host). */
export declare const inject: string[];
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** The web server the endpoints register on. */
        webServer: WebServerLike;
    }
}
/** Minimal structural shape of the web-server response the handlers write to. */
interface WebResponseLike {
    statusCode?: number;
    setHeader(name: string, value: string): void;
    end(body: string): void;
}
/** Minimal structural shape of the web-server route registry. */
interface WebServerLike {
    register(route: {
        kind: 'exact' | 'prefix';
        path: string;
        handler(req: unknown, res: WebResponseLike): void | Promise<void>;
    }): () => void;
}
/** Global single engine: one engine per process; any session's markers act on it. */
export declare const engine: Engine;
export declare function apply(ctx: Context): void;
export {};
