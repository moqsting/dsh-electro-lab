import { mkdirSync, rmSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resolveOutputTarget } from '../src/generate-server.ts'

/**
 * 审计 C1 回归：生成输出路径必须落在 outputRoot（<home>/generated）内。
 * 覆盖词法越界与「中间目录是链接」的 realpath 纵深逃逸（Windows 用 junction，
 * 不需管理员；这正是普通 realpathSync 拦不住、必须用 realpathSync.native 的场景）。
 */
const BASE = join(tmpdir(), `electro-outpath-${process.pid}`)
const HOME = join(BASE, 'home')
const OUTSIDE = join(BASE, 'outside')
const linkType = (process.platform === 'win32' ? 'junction' : 'dir') as const

describe('resolveOutputTarget（审计 C1：输出路径约束）', () => {
  beforeAll(() => {
    mkdirSync(join(HOME, 'generated'), { recursive: true })
    mkdirSync(OUTSIDE, { recursive: true })
  })

  afterAll(() => {
    rmSync(BASE, { recursive: true, force: true })
  })

  it('outputRoot 内的相对目录放行', () => {
    expect(resolveOutputTarget('sub', 'a.md', false, HOME).target).toBe(join(HOME, 'generated', 'sub', 'a.md'))
  })

  it('LaTeX 在专属子目录内解析', () => {
    expect(resolveOutputTarget('sub', 'a.tex', true, HOME).target).toBe(join(HOME, 'generated', 'sub', 'a', 'a.tex'))
  })

  it('绝对路径在 outputRoot 外被拒（词法）', () => {
    const outside = process.platform === 'win32' ? 'C:\\Windows\\Temp' : join(OUTSIDE, 'x')
    expect(() => resolveOutputTarget(outside, 'a.md', false, HOME)).toThrow(/越界/)
  })

  it('相对上跳越界被拒（词法）', () => {
    expect(() => resolveOutputTarget('..', 'a.md', false, HOME)).toThrow(/越界/)
  })

  it('中间目录为链接时越界被拒（realpath 纵深）', () => {
    const link = join(HOME, 'generated', 'escape')
    try {
      symlinkSync(OUTSIDE, link, linkType)
    } catch {
      return // 平台不支持创建链接（如 POSIX 无权限）时跳过该断言
    }
    expect(() => resolveOutputTarget('escape', 'a.md', false, HOME)).toThrow(/越界/)
  })
})
