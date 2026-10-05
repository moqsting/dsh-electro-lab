# MODIFICATIONS.md —— 相对上游的修改

> 上游：curtainsmall/dsh-electro-lab @ c4454f28623a2a4b57f3f7403306a3be321deda2
> Fork 维护者：moqsting（GitHub）
> 原则：保留原 author 与 LICENSE；本文件是“相对原作者已修改”的权威记录，整合包文档直接引用。

## 修改清单

| # | 文件 | 修改 | 原因 | 对应审查结论 |
|---|---|---|---|---|
| 1 | `.gitignore` | 移除 `lib/`（保留 `dist/`） | PackForge 用 git 坐标安装、不跑 `prepublishOnly`，无 `lib/` 则加载失败 → 需提交构建产物 | C1（关键） |
| 2 | `src/index.ts` + `src/generate-server.ts` + 新增 `src/same-origin.ts` | 12 条 `/api/dsh-electro-lab/*` 路由加同源守卫：`sameOriginGuard`（Origin/Host 比对 + Sec-Fetch-Site），未通过即 403 | 审计 C1/C2/C4：无鉴权任意写、目录枚举、删记录、注册求解器 | C1、C2、C4 |
| 3 | `src/generate-server.ts`（`startGenerateJob`） | 输出路径重写：`directory`+`fileName` 先 `resolve`，再做词法包含校验，限制在 `outputRoot`（默认 `<home>/generated`，`DSH_ELECTRO_LAB_HOME` 下）；越界抛错 | 审计 C1：`join(directory,fileName)` 无包含性检查 → 任意位置写文件 | C1 |
| 4 | `src/index.ts` + `src/tools/declaration-tools.ts` + `src/tool.ts` | 不注册 `external_solver_add/update/delete`（本包用不到外部求解器）；`validateDeclaration` 增 URL 黑名单（拒绝 `127.0.0.0/8`、`10/8`、`172.16/12`、`192.168/16`、`169.254/16`、`::1`、`fc00::/7` 与 `localhost`/`.local`/`.internal`）与 `headers` 键白名单 | 审计 C3：SSRF（url 仅 scheme 校验、headers 不校验） | C3 |
| 5 | `tsdown.config.ts` + `package.json` + `src/index.ts` + `src/skill.ts` + `src/tools/engine-tools.ts` | client `CLIENT_EXTERNALS` 的 `cordis` → `@deepseek-ai/cordis`；peer/dev 依赖的 `cordis` → `@deepseek-ai/cordis`；`@deepseek-ai/dsh-tools`/`dsh-llm` 范围 `^0.1.0-rc.7` → `>=0.1.0-rc.7 <0.3.0`；`import type { Context } from 'cordis'` → `@deepseek-ai/cordis`；`repository` 改指 fork URL | 审计 C6（宿主只提供 scope 名，非 scope `cordis` 不在宿主树）+ C7（peer 越界） | C6、C7 |

## 保留并记录

- 核心计算引擎（`math/`、`solvers/`、`engine/`）未改：审计结论“计算内核可信”，命令注入/代码求值均无。
- `/api/dsh-electro-lab/external-solvers` 端点保留（供 UI“添加外部求解器”），已加同源守卫 + URL/headers 校验。

## 验证

- **源码改动经逐处审查完成**，但本机受限沙箱**无法运行 `pnpm build` 与 `vitest`**：
  1. `pnpm install` 在打开 store 操作锁（`%LOCALAPPDATA%\pnpm-store-operation-locks`）时被拒——该路径由 pnpm 的 `env-paths` 解析、不接受 `LOCALAPPDATA` 环境变量重定向（实测子进程可见重定向、pnpm 仍用原路径）；
  2. `tsdown` 构建会 spawn 原生 bundler（命名管道），沙箱 EPERM。
  两项均为本机沙箱限制（约束#7），非代码缺陷。
- **待办（干净环境）**：`pnpm install && pnpm build` → `git add lib/`（含 `lib/types`、`lib/client.js`、`lib/client-registry.js`）→ `npx vitest run` 补 C1/C2/C3/C6 回归 → `dsh --dump-config` 确认 `external_solver_*` 不在工具表、路由带守卫。

## 未改

- 保留上游 `author`、`LICENSE`（MIT）。
