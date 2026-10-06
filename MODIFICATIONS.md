# MODIFICATIONS.md —— 相对上游的修改

> 上游：curtainsmall/dsh-electro-lab @ c4454f28623a2a4b57f3f7403306a3be321deda2
> Fork 维护者：moqsting（GitHub）
> 原则：保留原 author 与 LICENSE；本文件是“相对原作者已修改”的权威记录，整合包文档直接引用。

## 修改清单

| # | 文件 | 修改 | 原因 | 对应审查结论 |
|---|---|---|---|---|
| 1 | `.gitignore` | 移除 `lib/`（保留 `dist/`） | PackForge 用 git 坐标安装、不跑 `prepublishOnly`，无 `lib/` 则加载失败 → 需提交构建产物 | C1（关键） |
| 2 | `src/index.ts` + `src/generate-server.ts` + 新增 `src/same-origin.ts` | 12 条 `/api/dsh-electro-lab/*` 路由加同源守卫：`sameOriginGuard`（Origin/Host 比对 + Sec-Fetch-Site），未通过即 403 | 审计 C1/C2/C4：无鉴权任意写、目录枚举、删记录、注册求解器 | C1、C2、C4 |
| 3 | `src/generate-server.ts`（新增导出 `resolveOutputTarget`） | 输出路径重写：`directory`+`fileName` 先 `resolve` 做**词法**包含校验，再用 **`realpathSync.native`** 做**链接纵深**校验（普通 `realpathSync` 在 Windows 上不解析 junction，实测返回 junction 自身路径；junction 是 Windows 不需管理员即可创建的逃逸路径），限制在 `outputRoot`（默认 `<home>/generated`）；`beginGenerate` 启动任务前先校验（fail-fast，不浪费 LLM token），写入前再校验；越界抛错 | 审计 C1：`join(directory,fileName)` 无包含性检查 → 任意位置写文件 | C1 |
| 4 | `src/index.ts` + `src/tools/declaration-tools.ts` + `src/tool.ts` | 不注册 `external_solver_add/update/delete`（本包用不到外部求解器）；`validateDeclaration` 增 URL 黑名单（拒绝 `127.0.0.0/8`、`10/8`、`172.16/12`、`192.168/16`、`169.254/16`、`::1`、`fc00::/7` 与 `localhost`/`.local`/`.internal`）与 `headers` 键白名单 | 审计 C3：SSRF（url 仅 scheme 校验、headers 不校验） | C3 |
| 5 | `tsdown.config.ts` + `package.json` + `src/index.ts` + `src/skill.ts` + `src/tools/engine-tools.ts` | client `CLIENT_EXTERNALS` 的 `cordis` → `@deepseek-ai/cordis`；peer/dev 依赖的 `cordis` → `@deepseek-ai/cordis`；`@deepseek-ai/dsh-tools`/`dsh-llm` 范围 `^0.1.0-rc.7` → `>=0.1.0-rc.7 <0.3.0`；`import type { Context } from 'cordis'` → `@deepseek-ai/cordis`；`repository` 改指 fork URL | 审计 C6（宿主只提供 scope 名，非 scope `cordis` 不在宿主树）+ C7（peer 越界） | C6、C7 |

## 保留并记录

- 核心计算引擎（`math/`、`solvers/`、`engine/`）未改：审计结论“计算内核可信”，命令注入/代码求值均无。
- `/api/dsh-electro-lab/external-solvers` 端点保留（供 UI“添加外部求解器”），已加同源守卫 + URL/headers 校验。

## 验证

- 用 `npm install --ignore-scripts --legacy-peer-deps`（绕开 pnpm store 操作锁）+ `node node_modules/typescript/bin/tsc -p tsconfig.build.json`（类型检查 exit 0）+ `npx tsdown`（exit 0）完成构建：`lib/index.js`、`lib/client.js`、`lib/client-registry.js`、`lib/types/*.d.ts` 全部生成并已提交。
- `npx vitest run` 在本机受限沙箱无法运行：vite 打包 `vitest.config.ts` 时 spawn 子进程解析 realpath（`optimizeSafeRealPathSync` → `execFile`）触发 EPERM（约束#7 本机限制，非代码缺陷）。
- 待办（干净环境）：`npx vitest run` 补 C1/C2/C3/C6 回归；`dsh --dump-config` 确认 `external_solver_*` 不在工具表、路由带守卫；`pnpm install` 重新生成与 package.json 对齐的 `pnpm-lock.yaml`。

## 未改

- 保留上游 `author`、`LICENSE`（MIT）。
