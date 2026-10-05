/**
 * 审计 C1/C2/C4：Web 端点的同源守卫。拒绝 Origin 与 Host 不一致的浏览器请求，
 * 阻断跨站读写（未认证任意写、目录枚举、删记录、注册求解器）。
 */
export function sameOriginGuard(req: unknown): boolean {
  const headers = (req as { headers?: Record<string, unknown> }).headers ?? {}
  const origin = String(headers.origin ?? '')
  const host = String(headers.host ?? '')
  const site = String(headers['sec-fetch-site'] ?? '')
  if (site === 'none' || site === 'same-origin' || site === 'same-site') return true
  if (origin === '') return true
  try { return new URL(origin).host === host } catch { return false }
}

/** 同源守卫未通过时写 403 并返回 true（表示已拒绝，调用方应 return）。 */
export function rejectCrossOrigin(
  req: unknown,
  res: { statusCode?: number; setHeader?: (name: string, value: string) => void; end(body: string): void },
): boolean {
  if (sameOriginGuard(req)) return false
  res.statusCode = 403
  if (typeof res.setHeader === 'function') res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({ error: 'forbidden: cross-origin request' }))
  return true
}
