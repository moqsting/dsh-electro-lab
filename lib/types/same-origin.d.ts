/**
 * 审计 C1/C2/C4：Web 端点的同源守卫。拒绝 Origin 与 Host 不一致的浏览器请求，
 * 阻断跨站读写（未认证任意写、目录枚举、删记录、注册求解器）。
 */
export declare function sameOriginGuard(req: unknown): boolean;
/** 同源守卫未通过时写 403 并返回 true（表示已拒绝，调用方应 return）。 */
export declare function rejectCrossOrigin(req: unknown, res: {
    statusCode?: number;
    setHeader?: (name: string, value: string) => void;
    end(body: string): void;
}): boolean;
