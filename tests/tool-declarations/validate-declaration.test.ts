import { describe, expect, it } from 'vitest'
import { validateDeclaration } from '../../src/tool.ts'

/**
 * 审计 C3 回归：声明校验的 SSRF 加固。
 * - URL 黑名单：拒绝回环 / 私网 / 链路本地 / ULA / localhost；
 * - headers 键白名单：拒绝会覆盖客户端自管或跨站语义的危险头。
 */
const base = (url: string, headers?: Record<string, string>) => ({
  name: 'sample',
  description: '示例求解器',
  transport: 'http',
  parameters: {},
  transportOptions: headers === undefined ? { url } : { url, headers },
})

describe('validateDeclaration（审计 C3：SSRF 加固）', () => {
  it('公网 http(s) 端点通过', () => {
    expect(validateDeclaration(base('https://solver.example.com/api'))).toEqual([])
  })

  it.each([
    ['回环 127.0.0.0/8', 'http://127.0.0.1:8080/api'],
    ['私网 10/8', 'http://10.1.2.3/api'],
    ['私网 172.16/12', 'http://172.20.0.1/api'],
    ['私网 192.168/16', 'http://192.168.1.10/api'],
    ['链路本地 169.254/16（云元数据）', 'http://169.254.169.254/latest/meta-data'],
    ['IPv6 回环 ::1', 'http://[::1]:9000/api'],
    ['IPv6 ULA fc00::/7', 'http://[fd00::1]/api'],
    ['localhost 主机名', 'http://localhost:3000/api'],
    ['*.internal 主机名', 'http://solver.internal/api'],
  ])('%s 被拒', (_label, url) => {
    expect(validateDeclaration(base(url)).join('|')).toMatch(/回环|私网/)
  })

  it('headers 含危险键（host）被拒', () => {
    expect(validateDeclaration(base('https://solver.example.com/api', { host: 'evil' })).join('|')).toMatch(/不允许的键/)
  })

  it('headers 含普通鉴权键（authorization）放行', () => {
    expect(validateDeclaration(base('https://solver.example.com/api', { authorization: 'Bearer x' }))).toEqual([])
  })

  it('headers 非对象被拒', () => {
    const decl = { ...base('https://solver.example.com/api'), transportOptions: { url: 'https://solver.example.com/api', headers: ['x'] } }
    expect(validateDeclaration(decl).join('|')).toMatch(/必须是键值对象/)
  })

  it('非 http(s) scheme 被拒', () => {
    expect(validateDeclaration(base('ftp://solver.example.com/api')).join('|')).toMatch(/http\(s\)/)
  })
})
