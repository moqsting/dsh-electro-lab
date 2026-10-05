window.__ModuleLoader__.load({
	id: "dsh-external/dsh-electro-lab",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region \0rolldown/runtime.js
		var __create = Object.create;
		var __defProp = Object.defineProperty;
		var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
		var __getOwnPropNames = Object.getOwnPropertyNames;
		var __getProtoOf = Object.getPrototypeOf;
		var __hasOwnProp = Object.prototype.hasOwnProperty;
		var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
		var __copyProps = (to, from, except, desc) => {
			if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
			return to;
		};
		var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
			value: mod,
			enumerable: true
		}) : target, mod));
		//#endregion
		let react = require("react");
		react = __toESM(react, 1);
		let react_dom_client = require("react-dom/client");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/locales.ts
		/**
		* ElectroLab UI dictionaries: zh/en copies for every user-facing string in
		* the panel and the records page, registered into the DSH locale service
		* (dsh-client-locale) so the active language is the one the user chose.
		* Components subscribe through useAppLocale (LocaleFace) and translate with
		* t().
		*/
		const LOCALE_NS = "dsh-electro-lab";
		const zh = {
			backToSession: "返回会话",
			tabRecords: "记录",
			tabExternal: "外部求解器",
			addExternalSolver: "添加外部求解器",
			editExternalSolver: "编辑外部求解器",
			editSolver: "编辑",
			deleteSolver: "删除",
			deleteSolverTitle: "删除外部求解器 “{name}”?",
			enabled: "已启用",
			disabled: "已停用",
			restartRequired: "有更改待生效——重启宿主后，外部求解器将按最新声明注册。",
			externalEmptyHint: "暂无外部求解器。可通过 LLM 的 external_solver_add，或点击“添加外部求解器”注册。",
			externalUnreachable: "外部求解器端点未响应，面板会自动重试；若刚更新插件，宿主可能需要重启。",
			saveFailed: "保存失败：{message}",
			warnHttp: "注意：启用后，该工具可向 {url} 发起网络请求。",
			nameLabel: "名称",
			descriptionLabel: "描述",
			enabledLabel: "启用",
			identityLabel: "基本信息",
			endpointLabel: "端点",
			urlLabel: "URL",
			timeoutLabel: "超时（毫秒，可选）",
			parametersLabel: "参数",
			addParameter: "添加参数",
			removeParameter: "移除参数",
			paramTypeLabel: "类型",
			paramKindLabel: "数量类别",
			paramItemsLabel: "数组元素",
			paramEnumLabel: "可选值（逗号分隔）",
			paramDescriptionLabel: "说明",
			paramRequiredLabel: "必填",
			unmodeledParams: "{count} 个参数无法用表单表示（如嵌套数组），保存时原样保留：",
			returnsLabel: "返回值（returns，必填）",
			returnsTypeLabel: "返回类型",
			returnsPreserved: "该声明的 returns 无法用表单表示（嵌套结构），保存时原样保留。",
			returnsVoidHint: "void：返回 null——端点必须应答 result: null。",
			returnsEmptyObjectHint: "空字段对象：端点应答的 result 必须是不带任何字段的对象。",
			addReturnField: "添加字段",
			fieldNameLabel: "字段名",
			emptyFieldName: "字段名不能为空。",
			duplicateFieldName: "字段名重复：“{name}”。",
			invalidName: "名称须以小写字母开头，仅含小写字母、数字与下划线。",
			invalidParamName: "参数名 “{name}” 不合法——须以小写字母开头，仅含小写字母、数字与下划线。",
			duplicateParamName: "参数名重复：“{name}”。",
			urlRequired: "请输入 http(s) URL。",
			positiveNumberRequired: "“{label}”须为正数。",
			emptyHint: "暂无 ElectroLab 记录——让智能体做一次计算。",
			unreachable: "暂未检测到记录——记录端点未响应,面板会自动重试;若刚更新插件,宿主可能需要重启。",
			confirm: "确定",
			irreversible: "此操作不可恢复。",
			cancel: "取消",
			delete: "删除",
			selectAll: "全选",
			enterSelectMode: "选择",
			exitSelectMode: "完成",
			selectedCount: "已选 {n} 条",
			selectRow: "选择记录",
			deleteSelected: "删除所选",
			deleteRecordsConfirm: "确定删除选中的 {n} 条记录？",
			deleteFailed: "{n} 条删除失败：{message}",
			incomplete: "未完成",
			backToRecords: "返回记录",
			displayAll: "显示全部",
			rowsCount: "{n} 行",
			failedCount: "{n} 次失败",
			recordUnreachable: "记录详情不可用——端点未响应；若刚更新插件，宿主可能需要重启。",
			writesGroup: "写入（{n}）",
			readsGroup: "读取（{n}）",
			failuresGroup: "失败尝试（{n}）",
			deleted: "（已删除）",
			callLabel: "调用",
			callSolver: "求解器",
			callTarget: "写入槽",
			jumpToSet: "跳到槽 {name} 的定义",
			callResult: "结果",
			articleGenerateMarkdown: "生成 Markdown",
			articleGenerateTex: "生成 LaTeX",
			generate: "生成",
			generateSetupMarkdown: "Markdown 生成设置",
			generateSetupLatex: "LaTeX 生成设置",
			generating: "生成中…",
			generateDone: "生成完成",
			generateFailed: "生成失败",
			generatedAt: "已生成至",
			openFile: "打开文件",
			openDirectory: "打开目录",
			phasePrepare: "读取记录…",
			phaseGenerate: "生成文章中…",
			phaseWrite: "写入文件…",
			phaseCompile: "编译 PDF 中…",
			minimize: "最小化",
			directoryRequired: "输出目录不能为空。",
			compilePdf: "编译为 PDF",
			toolchainMissing: "本机没有可用的 LaTeX 工具链（需要 latexmk 或 texify，以及 xelatex），无法编译 PDF。",
			macroHint: "可能缺少宏包：",
			generatedPdfAt: "PDF 已生成至",
			compileFailed: "PDF 编译失败：",
			compileFailedNoDetail: "PDF 编译失败：驱动没有给出原因，详情见日志。",
			language: "语言",
			languageAuto: "跟随问题",
			languageZh: "简体中文",
			languageEn: "English",
			directory: "目录",
			fileName: "文件名",
			browse: "浏览",
			browseDirectory: "选择输出目录",
			upLevel: "上一级",
			markerQuestion: "问题",
			markerAnalyse: "分析",
			markerAnswer: "答案",
			markerDuplicateStart: "重复开启（已按错误记录结算）",
			markerDuplicateEnd: "无记录时结算（错误记录）"
		};
		const en = {
			backToSession: "Back to session",
			tabRecords: "Records",
			tabExternal: "External solvers",
			addExternalSolver: "Add external solver",
			editExternalSolver: "Edit external solver",
			editSolver: "Edit",
			deleteSolver: "Delete",
			deleteSolverTitle: "Delete external solver “{name}”?",
			enabled: "Enabled",
			disabled: "Disabled",
			restartRequired: "Changes are pending — after a host restart, external solvers register from the latest declarations.",
			externalEmptyHint: "No external solvers yet. Register one through the LLM’s external_solver_add, or click “Add external solver”.",
			externalUnreachable: "The external-solvers endpoint is not responding; the panel keeps retrying automatically. If you just updated the plugin, the host process may need a restart.",
			saveFailed: "Save failed: {message}",
			warnHttp: "Caution: once enabled, this tool may send requests to {url}.",
			nameLabel: "Name",
			descriptionLabel: "Description",
			enabledLabel: "Enabled",
			identityLabel: "Identity",
			endpointLabel: "Endpoint",
			urlLabel: "URL",
			timeoutLabel: "Timeout (ms, optional)",
			parametersLabel: "Parameters",
			addParameter: "Add parameter",
			removeParameter: "Remove parameter",
			paramTypeLabel: "Type",
			paramKindLabel: "Quantity kind",
			paramItemsLabel: "Array items",
			paramEnumLabel: "Allowed values (comma-separated)",
			paramDescriptionLabel: "Description",
			paramRequiredLabel: "Required",
			unmodeledParams: "{count} parameter(s) cannot be represented in the form (e.g. nested arrays) and are preserved verbatim on save:",
			returnsLabel: "Returns (required)",
			returnsTypeLabel: "Return type",
			returnsPreserved: "The declaration’s returns cannot be represented in the form (nested structures) and is preserved verbatim on save.",
			returnsVoidHint: "void: returns null — the endpoint must answer result: null.",
			returnsEmptyObjectHint: "An object with no fields: the endpoint’s result must be an object without any field.",
			addReturnField: "Add field",
			fieldNameLabel: "Field name",
			emptyFieldName: "Field name must not be empty.",
			duplicateFieldName: "Duplicate field name: “{name}”.",
			invalidName: "Name must start with a lowercase letter; only lowercase letters, digits and underscores are allowed.",
			invalidParamName: "Parameter name “{name}” is invalid — it must start with a lowercase letter; only lowercase letters, digits and underscores are allowed.",
			duplicateParamName: "Duplicate parameter name: “{name}”.",
			urlRequired: "Enter an http(s) URL.",
			positiveNumberRequired: "“{label}” must be a positive number.",
			emptyHint: "No ElectroLab records yet — ask the agent for a calculation.",
			unreachable: "No records detected yet — the records endpoint is not responding; the panel keeps retrying automatically. If you just updated the plugin, the host process may need a restart.",
			confirm: "OK",
			irreversible: "This cannot be undone.",
			cancel: "Cancel",
			delete: "Delete",
			selectAll: "Select all",
			enterSelectMode: "Select",
			exitSelectMode: "Done",
			selectedCount: "{n} selected",
			selectRow: "Select record",
			deleteSelected: "Delete selected",
			deleteRecordsConfirm: "Delete the {n} selected record(s)?",
			deleteFailed: "{n} deletion(s) failed: {message}",
			incomplete: "incomplete",
			backToRecords: "Back to records",
			displayAll: "Display all",
			rowsCount: "{n} row(s)",
			failedCount: "{n} failure(s)",
			recordUnreachable: "Record detail unavailable — the endpoint is not responding; if you just updated the plugin, the host may need a restart.",
			writesGroup: "Writes ({n})",
			readsGroup: "Reads ({n})",
			failuresGroup: "Failed attempts ({n})",
			deleted: "(deleted)",
			callLabel: "Call",
			callSolver: "Solver",
			callTarget: "Written slot",
			jumpToSet: "Jump to slot {name}",
			callResult: "Result",
			articleGenerateMarkdown: "Generate Markdown",
			articleGenerateTex: "Generate LaTeX",
			generate: "Generate",
			generateSetupMarkdown: "Markdown generation setup",
			generateSetupLatex: "LaTeX generation setup",
			generating: "Generating…",
			generateDone: "Generation complete",
			generateFailed: "Generation failed",
			generatedAt: "Generated at",
			openFile: "Open file",
			openDirectory: "Open directory",
			phasePrepare: "Reading record…",
			phaseGenerate: "Generating article…",
			phaseWrite: "Writing file…",
			phaseCompile: "Compiling PDF…",
			minimize: "Minimize",
			directoryRequired: "The output directory is required.",
			compilePdf: "Compile to PDF",
			toolchainMissing: "No usable LaTeX toolchain on this machine (needs latexmk or texify, and xelatex) — PDF compilation is unavailable.",
			macroHint: "Packages may be missing:",
			generatedPdfAt: "PDF generated at",
			compileFailed: "PDF compilation failed:",
			compileFailedNoDetail: "PDF compilation failed: the driver gave no reason — see the log.",
			language: "Language",
			languageAuto: "Auto (follow the question)",
			languageZh: "简体中文",
			languageEn: "English",
			directory: "Directory",
			fileName: "File name",
			browse: "Browse",
			browseDirectory: "Select output directory",
			upLevel: "Up one level",
			markerQuestion: "Question",
			markerAnalyse: "Analysis",
			markerAnswer: "Answer",
			markerDuplicateStart: "Duplicate open (settled as an error record)",
			markerDuplicateEnd: "Settled with no open record (error record)"
		};
		/** Registered into the DSH locale service under LOCALE_NS. */
		const dictionaries = {
			zh,
			en
		};
		let current = {
			active: "zh",
			revision: 0
		};
		const listeners$1 = /* @__PURE__ */ new Set();
		/** Wire the DSH locale service (LocaleFace getSnapshot/subscribe) into this module. */
		function installLocale(locale) {
			current = locale.getSnapshot();
			locale.subscribe(() => {
				current = locale.getSnapshot();
				for (const listener of listeners$1) listener();
			});
		}
		function subscribe$1(solver) {
			listeners$1.add(solver);
			return () => {
				listeners$1.delete(solver);
			};
		}
		function getSnapshot$1() {
			return current;
		}
		/** Subscribe the calling component to the active language. */
		function useAppLocale() {
			return (0, react.useSyncExternalStore)(subscribe$1, getSnapshot$1).active;
		}
		function isZh(active) {
			return active.toLowerCase().startsWith("zh");
		}
		/** Translate one key in the active language; `{name}` placeholders are replaced from args. Unknown keys return themselves. */
		function t$1(key, args) {
			let text = (isZh(current.active) ? zh : en)[key];
			if (text === void 0) return key;
			if (args !== void 0) for (const [name, value] of Object.entries(args)) text = text.replace(`{${name}}`, String(value));
			return text;
		}
		//#endregion
		//#region src/client/ui.tsx
		/**
		* ElectroLab shared client UI: themed dialog + buttons and typed-value
		* display helpers. Pure presentational code with no record imports, so any
		* page (record list, detail, editors) can use it without import cycles.
		*/
		const UNIT_BY_KIND = {
			resistance: "Ω",
			capacitance: "F",
			inductance: "H",
			voltage: "V",
			current: "A",
			power: "W",
			time: "s",
			frequency: "Hz",
			temperature: "K",
			angle: "rad",
			pressure: "Pa",
			energy: "J",
			length: "m",
			mass: "kg",
			log: "dB",
			none: ""
		};
		const PREFIX_SYMBOL = {
			pico: "p",
			nano: "n",
			micro: "µ",
			milli: "m",
			kilo: "k",
			mega: "M",
			giga: "G",
			tera: "T"
		};
		const VARIANT_DISPLAY = {
			degC: "°C",
			degF: "°F",
			deg: "°",
			bar: "bar",
			psi: "psi",
			atm: "atm",
			cal: "cal",
			Wh: "Wh",
			hp: "hp",
			inch: "in",
			foot: "ft",
			yard: "yd",
			mile: "mi",
			lb: "lb",
			oz: "oz"
		};
		function fmt(n) {
			if (!Number.isFinite(n)) return String(n);
			const abs = Math.abs(n);
			if (abs !== 0 && (abs >= 1e6 || abs < .001)) return n.toExponential(4).replace(/\.?0+e/, "e");
			return String(Math.round(n * 1e4) / 1e4);
		}
		/** Render one typed value as human text. Slot values are returned as "@name" markers. */
		function displayValue(value) {
			if (value === null || value === void 0) return "null";
			if (typeof value !== "object") return String(value);
			const v = value;
			switch (v.type) {
				case "number": {
					const kind = String(v.kind ?? "none");
					const unit = UNIT_BY_KIND[kind] ?? "";
					if (v.variant !== void 0) {
						const variantName = String(v.variant);
						return `${fmt(Number(v.value))} ${VARIANT_DISPLAY[variantName] ?? variantName}`;
					}
					const prefix = v.prefix === void 0 ? "" : PREFIX_SYMBOL[String(v.prefix)] ?? String(v.prefix);
					return `${fmt(Number(v.value))} ${prefix}${unit}`.trim();
				}
				case "complex": {
					const box = v.value;
					const kind = String(v.kind ?? "none");
					const unit = UNIT_BY_KIND[kind] ?? "";
					if (box.mag !== void 0 && box.ang !== void 0) return `${fmt(box.mag)} ∠ ${fmt(box.ang)} rad ${unit}`.trim();
					const re = box.re ?? 0;
					const im = box.im ?? 0;
					const sign = im < 0 ? "−" : "+";
					return `${fmt(re)} ${sign} j${fmt(Math.abs(im))} ${unit}`.trim();
				}
				case "string": return String(v.value);
				case "boolean": return String(v.value);
				case "slot": return `@${String(v.value)}`;
				case "array": return `[ ${v.value.map((item) => displayValue(item)).join(", ")} ]`;
				case "object": return JSON.stringify(v.value);
				default: return JSON.stringify(value);
			}
		}
		/** Shared modal: mask, themed panel, title (optionally with right-side content), body, footer. */
		function Dialog({ open, title, width = 400, height, dismissible = true, headerRight, footer, children, onClose }) {
			if (!open) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 100,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "var(--dsw-alias-bg-mask-1)",
					pointerEvents: "auto"
				},
				onClick: dismissible ? onClose : void 0,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					role: "dialog",
					"aria-modal": "true",
					"aria-label": title,
					style: {
						width,
						maxWidth: "calc(100vw - 32px)",
						maxHeight: "calc(100vh - 48px)",
						...height === void 0 ? {} : { height },
						display: "flex",
						flexDirection: "column",
						background: "var(--dsw-alias-bg-layer-2)",
						border: "1px solid var(--dsw-alias-border-l2)",
						borderRadius: 10,
						padding: 16,
						boxShadow: "var(--dsw-shadow-lv3)"
					},
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								gap: 8
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									fontWeight: 600,
									fontSize: 14
								},
								children: title
							}), headerRight]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								marginTop: 12,
								flex: 1,
								minHeight: 0,
								display: "flex",
								flexDirection: "column",
								overflowY: "auto"
							},
							children
						}),
						footer !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								display: "flex",
								justifyContent: "flex-end",
								gap: 8,
								marginTop: 14,
								flex: "none"
							},
							children: footer
						})
					]
				})
			});
		}
		function ghostButtonStyle(hovered) {
			return {
				padding: "4px 12px",
				borderRadius: 6,
				border: "1px solid var(--dsw-alias-label-tertiary)",
				borderColor: hovered ? "var(--dsw-alias-label-primary)" : "var(--dsw-alias-label-tertiary)",
				background: hovered ? "var(--dsw-alias-interactive-bg-hover)" : "none",
				color: "var(--dsw-alias-label-primary)",
				cursor: "pointer",
				fontSize: 13
			};
		}
		function primaryButtonStyle(hovered, disabled = false) {
			return {
				padding: "4px 12px",
				borderRadius: 6,
				border: "1px solid var(--dsw-alias-button-info-fill)",
				background: hovered && !disabled ? "var(--dsw-alias-button-info-hover)" : "var(--dsw-alias-button-info-fill)",
				color: "var(--dsw-alias-label-primary-foreground)",
				cursor: disabled ? "default" : "pointer",
				fontSize: 13,
				fontWeight: 600,
				opacity: disabled ? .45 : 1
			};
		}
		/** Ghost button (secondary action). */
		function GhostButton({ children, onClick, disabled = false, style }) {
			const [hovered, setHovered] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				style: {
					...ghostButtonStyle(hovered),
					...style
				},
				disabled,
				onClick,
				onMouseEnter: () => setHovered(true),
				onMouseLeave: () => setHovered(false),
				children
			});
		}
		/** Primary button (primary action). */
		function PrimaryButton({ children, onClick, disabled = false }) {
			const [hovered, setHovered] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				style: primaryButtonStyle(hovered, disabled),
				disabled,
				onClick,
				onMouseEnter: () => setHovered(true),
				onMouseLeave: () => setHovered(false),
				children
			});
		}
		//#endregion
		//#region node_modules/@fortawesome/fontawesome-svg-core/index.mjs
		/*!
		* Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com
		* License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
		* Copyright 2026 Fonticons, Inc.
		*/
		function _arrayLikeToArray(r, a) {
			(null == a || a > r.length) && (a = r.length);
			for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
			return n;
		}
		function _arrayWithHoles(r) {
			if (Array.isArray(r)) return r;
		}
		function _arrayWithoutHoles(r) {
			if (Array.isArray(r)) return _arrayLikeToArray(r);
		}
		function _classCallCheck(a, n) {
			if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
		}
		function _defineProperties(e, r) {
			for (var t = 0; t < r.length; t++) {
				var o = r[t];
				o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
			}
		}
		function _createClass(e, r, t) {
			return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
		}
		function _createForOfIteratorHelper(r, e) {
			var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
			if (!t) {
				if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
					t && (r = t);
					var n = 0, F = function() {};
					return {
						s: F,
						n: function() {
							return n >= r.length ? { done: !0 } : {
								done: !1,
								value: r[n++]
							};
						},
						e: function(r) {
							throw r;
						},
						f: F
					};
				}
				throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
			}
			var o, a = !0, u = !1;
			return {
				s: function() {
					t = t.call(r);
				},
				n: function() {
					var r = t.next();
					return a = r.done, r;
				},
				e: function(r) {
					u = !0, o = r;
				},
				f: function() {
					try {
						a || null == t.return || t.return();
					} finally {
						if (u) throw o;
					}
				}
			};
		}
		function _defineProperty(e, r, t) {
			return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
				value: t,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[r] = t, e;
		}
		function _iterableToArray(r) {
			if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
		}
		function _iterableToArrayLimit(r, l) {
			var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
			if (null != t) {
				var e, n, i, u, a = [], f = !0, o = !1;
				try {
					if (i = (t = t.call(r)).next, 0 === l) {
						if (Object(t) !== t) return;
						f = !1;
					} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
				} catch (r) {
					o = !0, n = r;
				} finally {
					try {
						if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
					} finally {
						if (o) throw n;
					}
				}
				return a;
			}
		}
		function _nonIterableRest() {
			throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		function _nonIterableSpread() {
			throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		function ownKeys(e, r) {
			var t = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var o = Object.getOwnPropertySymbols(e);
				r && (o = o.filter(function(r) {
					return Object.getOwnPropertyDescriptor(e, r).enumerable;
				})), t.push.apply(t, o);
			}
			return t;
		}
		function _objectSpread2(e) {
			for (var r = 1; r < arguments.length; r++) {
				var t = null != arguments[r] ? arguments[r] : {};
				r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
					_defineProperty(e, r, t[r]);
				}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
					Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
				});
			}
			return e;
		}
		function _slicedToArray(r, e) {
			return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
		}
		function _toConsumableArray(r) {
			return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
		}
		function _toPrimitive(t, r) {
			if ("object" != typeof t || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r || "default");
				if ("object" != typeof i) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		function _toPropertyKey(t) {
			var i = _toPrimitive(t, "string");
			return "symbol" == typeof i ? i : i + "";
		}
		function _typeof(o) {
			"@babel/helpers - typeof";
			return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
				return typeof o;
			} : function(o) {
				return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
			}, _typeof(o);
		}
		function _unsupportedIterableToArray(r, a) {
			if (r) {
				if ("string" == typeof r) return _arrayLikeToArray(r, a);
				var t = {}.toString.call(r).slice(8, -1);
				return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
			}
		}
		var noop = function noop() {};
		var _WINDOW = {};
		var _DOCUMENT = {};
		var _MUTATION_OBSERVER = null;
		var _PERFORMANCE = {
			mark: noop,
			measure: noop
		};
		try {
			if (typeof window !== "undefined") _WINDOW = window;
			if (typeof document !== "undefined") _DOCUMENT = document;
			if (typeof MutationObserver !== "undefined") _MUTATION_OBSERVER = MutationObserver;
			if (typeof performance !== "undefined") _PERFORMANCE = performance;
		} catch (e) {}
		var _ref$userAgent = (_WINDOW.navigator || {}).userAgent;
		var userAgent = _ref$userAgent === void 0 ? "" : _ref$userAgent;
		var WINDOW = _WINDOW;
		var DOCUMENT = _DOCUMENT;
		var MUTATION_OBSERVER = _MUTATION_OBSERVER;
		var PERFORMANCE = _PERFORMANCE;
		WINDOW.document;
		var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === "function" && typeof DOCUMENT.createElement === "function";
		var IS_IE = ~userAgent.indexOf("MSIE") || ~userAgent.indexOf("Trident/");
		var _cl;
		var Z = /fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt|sldr|slpdr|pr|ms|vs)?[\-\ ]/;
		var $ = /Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Slab Duo|Slab Press Duo|Pixel|Mosaic|Vellum|Whiteboard)?.*/i;
		var rl = {
			classic: {
				fa: "solid",
				fas: "solid",
				"fa-solid": "solid",
				far: "regular",
				"fa-regular": "regular",
				fal: "light",
				"fa-light": "light",
				fat: "thin",
				"fa-thin": "thin",
				fab: "brands",
				"fa-brands": "brands"
			},
			duotone: {
				fa: "solid",
				fad: "solid",
				"fa-solid": "solid",
				"fa-duotone": "solid",
				fadr: "regular",
				"fa-regular": "regular",
				fadl: "light",
				"fa-light": "light",
				fadt: "thin",
				"fa-thin": "thin"
			},
			sharp: {
				fa: "solid",
				fass: "solid",
				"fa-solid": "solid",
				fasr: "regular",
				"fa-regular": "regular",
				fasl: "light",
				"fa-light": "light",
				fast: "thin",
				"fa-thin": "thin"
			},
			"sharp-duotone": {
				fa: "solid",
				fasds: "solid",
				"fa-solid": "solid",
				fasdr: "regular",
				"fa-regular": "regular",
				fasdl: "light",
				"fa-light": "light",
				fasdt: "thin",
				"fa-thin": "thin"
			},
			slab: {
				"fa-regular": "regular",
				faslr: "regular"
			},
			"slab-press": {
				"fa-regular": "regular",
				faslpr: "regular"
			},
			"slab-duo": {
				"fa-regular": "regular",
				fasldr: "regular"
			},
			"slab-press-duo": {
				"fa-regular": "regular",
				faslpdr: "regular"
			},
			thumbprint: {
				"fa-light": "light",
				fatl: "light"
			},
			vellum: {
				"fa-solid": "solid",
				favs: "solid"
			},
			pixel: {
				"fa-regular": "regular",
				fapr: "regular"
			},
			mosaic: {
				"fa-solid": "solid",
				fams: "solid"
			},
			whiteboard: {
				"fa-semibold": "semibold",
				fawsb: "semibold"
			},
			notdog: {
				"fa-solid": "solid",
				fans: "solid"
			},
			"notdog-duo": {
				"fa-solid": "solid",
				fands: "solid"
			},
			etch: {
				"fa-solid": "solid",
				faes: "solid"
			},
			graphite: {
				"fa-thin": "thin",
				fagt: "thin"
			},
			jelly: {
				"fa-regular": "regular",
				fajr: "regular"
			},
			"jelly-fill": {
				"fa-regular": "regular",
				fajfr: "regular"
			},
			"jelly-duo": {
				"fa-regular": "regular",
				fajdr: "regular"
			},
			chisel: {
				"fa-regular": "regular",
				facr: "regular"
			},
			utility: {
				"fa-semibold": "semibold",
				fausb: "semibold"
			},
			"utility-duo": {
				"fa-semibold": "semibold",
				faudsb: "semibold"
			},
			"utility-fill": {
				"fa-semibold": "semibold",
				faufsb: "semibold"
			}
		};
		var il = {
			GROUP: "duotone-group",
			SWAP_OPACITY: "swap-opacity",
			PRIMARY: "primary",
			SECONDARY: "secondary"
		};
		var dl = [
			"fa-classic",
			"fa-duotone",
			"fa-sharp",
			"fa-sharp-duotone",
			"fa-thumbprint",
			"fa-whiteboard",
			"fa-notdog",
			"fa-notdog-duo",
			"fa-chisel",
			"fa-etch",
			"fa-graphite",
			"fa-jelly",
			"fa-jelly-fill",
			"fa-jelly-duo",
			"fa-slab",
			"fa-slab-press",
			"fa-slab-press-duo",
			"fa-slab-duo",
			"fa-mosaic",
			"fa-pixel",
			"fa-vellum",
			"fa-utility",
			"fa-utility-duo",
			"fa-utility-fill"
		];
		var u = "classic";
		var l = "duotone";
		var h = "sharp";
		var t = "sharp-duotone";
		var g = "chisel";
		var n = "etch";
		var m = "graphite";
		var p = "jelly";
		var s = "jelly-duo";
		var y = "jelly-fill";
		var w = "mosaic";
		var x = "notdog";
		var e = "notdog-duo";
		var b = "pixel";
		var c = "slab";
		var o = "slab-duo";
		var I = "slab-press";
		var a = "slab-press-duo";
		var r = "thumbprint";
		var v = "utility";
		var i = "utility-duo";
		var F = "utility-fill";
		var d = "vellum";
		var S = "whiteboard";
		var A = "Classic";
		var P = "Duotone";
		var j = "Sharp";
		var B = "Sharp Duotone";
		var N = "Chisel";
		var D = "Etch";
		var k = "Graphite";
		var T = "Jelly";
		var C = "Jelly Duo";
		var W = "Jelly Fill";
		var R = "Mosaic";
		var K = "Notdog";
		var L = "Notdog Duo";
		var U = "Pixel";
		var J = "Slab";
		var _ = "Slab Duo";
		var M = "Slab Press";
		var E = "Slab Press Duo";
		var G = "Thumbprint";
		var V = "Utility";
		var z = "Utility Duo";
		var O = "Utility Fill";
		var Y = "Vellum";
		var q = "Whiteboard";
		var xl = [
			u,
			l,
			h,
			t,
			g,
			n,
			m,
			p,
			s,
			y,
			w,
			x,
			e,
			b,
			c,
			o,
			I,
			a,
			r,
			v,
			i,
			F,
			d,
			S
		];
		_cl = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_cl, u, A), l, P), h, j), t, B), g, N), n, D), m, k), p, T), s, C), y, W), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_cl, w, R), x, K), e, L), b, U), c, J), o, _), I, M), a, E), r, G), v, V), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_cl, i, z), F, O), d, Y), S, q);
		var Al = {
			classic: {
				900: "fas",
				400: "far",
				normal: "far",
				300: "fal",
				100: "fat"
			},
			duotone: {
				900: "fad",
				400: "fadr",
				300: "fadl",
				100: "fadt"
			},
			sharp: {
				900: "fass",
				400: "fasr",
				300: "fasl",
				100: "fast"
			},
			"sharp-duotone": {
				900: "fasds",
				400: "fasdr",
				300: "fasdl",
				100: "fasdt"
			},
			slab: { 400: "faslr" },
			"slab-press": { 400: "faslpr" },
			"slab-duo": { 400: "fasldr" },
			"slab-press-duo": { 400: "faslpdr" },
			vellum: { 900: "favs" },
			mosaic: { 900: "fams" },
			pixel: { 400: "fapr" },
			whiteboard: { 600: "fawsb" },
			thumbprint: { 300: "fatl" },
			notdog: { 900: "fans" },
			"notdog-duo": { 900: "fands" },
			etch: { 900: "faes" },
			graphite: { 100: "fagt" },
			chisel: { 400: "facr" },
			jelly: { 400: "fajr" },
			"jelly-fill": { 400: "fajfr" },
			"jelly-duo": { 400: "fajdr" },
			utility: { 600: "fausb" },
			"utility-duo": { 600: "faudsb" },
			"utility-fill": { 600: "faufsb" }
		};
		var zl = {
			"Font Awesome 7 Free": {
				900: "fas",
				400: "far"
			},
			"Font Awesome 7 Pro": {
				900: "fas",
				400: "far",
				normal: "far",
				300: "fal",
				100: "fat"
			},
			"Font Awesome 7 Brands": {
				400: "fab",
				normal: "fab"
			},
			"Font Awesome 7 Duotone": {
				900: "fad",
				400: "fadr",
				normal: "fadr",
				300: "fadl",
				100: "fadt"
			},
			"Font Awesome 7 Sharp": {
				900: "fass",
				400: "fasr",
				normal: "fasr",
				300: "fasl",
				100: "fast"
			},
			"Font Awesome 7 Sharp Duotone": {
				900: "fasds",
				400: "fasdr",
				normal: "fasdr",
				300: "fasdl",
				100: "fasdt"
			},
			"Font Awesome 7 Jelly": {
				400: "fajr",
				normal: "fajr"
			},
			"Font Awesome 7 Jelly Fill": {
				400: "fajfr",
				normal: "fajfr"
			},
			"Font Awesome 7 Jelly Duo": {
				400: "fajdr",
				normal: "fajdr"
			},
			"Font Awesome 7 Slab": {
				400: "faslr",
				normal: "faslr"
			},
			"Font Awesome 7 Slab Press": {
				400: "faslpr",
				normal: "faslpr"
			},
			"Font Awesome 7 Slab Duo": {
				400: "fasldr",
				normal: "fasldr"
			},
			"Font Awesome 7 Slab Press Duo": {
				400: "faslpdr",
				normal: "faslpdr"
			},
			"Font Awesome 7 Pixel": {
				400: "fapr",
				normal: "fapr"
			},
			"Font Awesome 7 Mosaic": {
				900: "fams",
				normal: "fams"
			},
			"Font Awesome 7 Vellum": {
				900: "favs",
				normal: "favs"
			},
			"Font Awesome 7 Thumbprint": {
				300: "fatl",
				normal: "fatl"
			},
			"Font Awesome 7 Notdog": {
				900: "fans",
				normal: "fans"
			},
			"Font Awesome 7 Notdog Duo": {
				900: "fands",
				normal: "fands"
			},
			"Font Awesome 7 Etch": {
				900: "faes",
				normal: "faes"
			},
			"Font Awesome 7 Graphite": {
				100: "fagt",
				normal: "fagt"
			},
			"Font Awesome 7 Chisel": {
				400: "facr",
				normal: "facr"
			},
			"Font Awesome 7 Whiteboard": {
				600: "fawsb",
				normal: "fawsb"
			},
			"Font Awesome 7 Utility": {
				600: "fausb",
				normal: "fausb"
			},
			"Font Awesome 7 Utility Duo": {
				600: "faudsb",
				normal: "faudsb"
			},
			"Font Awesome 7 Utility Fill": {
				600: "faufsb",
				normal: "faufsb"
			}
		};
		var Ql = /* @__PURE__ */ new Map([
			["classic", {
				defaultShortPrefixId: "fas",
				defaultStyleId: "solid",
				styleIds: [
					"solid",
					"regular",
					"light",
					"thin",
					"brands"
				],
				futureStyleIds: [],
				defaultFontWeight: 900
			}],
			["duotone", {
				defaultShortPrefixId: "fad",
				defaultStyleId: "solid",
				styleIds: [
					"solid",
					"regular",
					"light",
					"thin"
				],
				futureStyleIds: [],
				defaultFontWeight: 900
			}],
			["sharp", {
				defaultShortPrefixId: "fass",
				defaultStyleId: "solid",
				styleIds: [
					"solid",
					"regular",
					"light",
					"thin"
				],
				futureStyleIds: [],
				defaultFontWeight: 900
			}],
			["sharp-duotone", {
				defaultShortPrefixId: "fasds",
				defaultStyleId: "solid",
				styleIds: [
					"solid",
					"regular",
					"light",
					"thin"
				],
				futureStyleIds: [],
				defaultFontWeight: 900
			}],
			["chisel", {
				defaultShortPrefixId: "facr",
				defaultStyleId: "regular",
				styleIds: ["regular"],
				futureStyleIds: [],
				defaultFontWeight: 400
			}],
			["etch", {
				defaultShortPrefixId: "faes",
				defaultStyleId: "solid",
				styleIds: ["solid"],
				futureStyleIds: [],
				defaultFontWeight: 900
			}],
			["graphite", {
				defaultShortPrefixId: "fagt",
				defaultStyleId: "thin",
				styleIds: ["thin"],
				futureStyleIds: [],
				defaultFontWeight: 100
			}],
			["jelly", {
				defaultShortPrefixId: "fajr",
				defaultStyleId: "regular",
				styleIds: ["regular"],
				futureStyleIds: [],
				defaultFontWeight: 400
			}],
			["jelly-duo", {
				defaultShortPrefixId: "fajdr",
				defaultStyleId: "regular",
				styleIds: ["regular"],
				futureStyleIds: [],
				defaultFontWeight: 400
			}],
			["jelly-fill", {
				defaultShortPrefixId: "fajfr",
				defaultStyleId: "regular",
				styleIds: ["regular"],
				futureStyleIds: [],
				defaultFontWeight: 400
			}],
			["mosaic", {
				defaultShortPrefixId: "fams",
				defaultStyleId: "solid",
				styleIds: ["solid"],
				futureStyleIds: [],
				defaultFontWeight: 900
			}],
			["notdog", {
				defaultShortPrefixId: "fans",
				defaultStyleId: "solid",
				styleIds: ["solid"],
				futureStyleIds: [],
				defaultFontWeight: 900
			}],
			["notdog-duo", {
				defaultShortPrefixId: "fands",
				defaultStyleId: "solid",
				styleIds: ["solid"],
				futureStyleIds: [],
				defaultFontWeight: 900
			}],
			["pixel", {
				defaultShortPrefixId: "fapr",
				defaultStyleId: "regular",
				styleIds: ["regular"],
				futureStyleIds: [],
				defaultFontWeight: 400
			}],
			["slab", {
				defaultShortPrefixId: "faslr",
				defaultStyleId: "regular",
				styleIds: ["regular"],
				futureStyleIds: [],
				defaultFontWeight: 400
			}],
			["slab-duo", {
				defaultShortPrefixId: "fasldr",
				defaultStyleId: "regular",
				styleIds: ["regular"],
				futureStyleIds: [],
				defaultFontWeight: 400
			}],
			["slab-press", {
				defaultShortPrefixId: "faslpr",
				defaultStyleId: "regular",
				styleIds: ["regular"],
				futureStyleIds: [],
				defaultFontWeight: 400
			}],
			["slab-press-duo", {
				defaultShortPrefixId: "faslpdr",
				defaultStyleId: "regular",
				styleIds: ["regular"],
				futureStyleIds: [],
				defaultFontWeight: 400
			}],
			["thumbprint", {
				defaultShortPrefixId: "fatl",
				defaultStyleId: "light",
				styleIds: ["light"],
				futureStyleIds: [],
				defaultFontWeight: 300
			}],
			["utility", {
				defaultShortPrefixId: "fausb",
				defaultStyleId: "semibold",
				styleIds: ["semibold"],
				futureStyleIds: [],
				defaultFontWeight: 600
			}],
			["utility-duo", {
				defaultShortPrefixId: "faudsb",
				defaultStyleId: "semibold",
				styleIds: ["semibold"],
				futureStyleIds: [],
				defaultFontWeight: 600
			}],
			["utility-fill", {
				defaultShortPrefixId: "faufsb",
				defaultStyleId: "semibold",
				styleIds: ["semibold"],
				futureStyleIds: [],
				defaultFontWeight: 600
			}],
			["vellum", {
				defaultShortPrefixId: "favs",
				defaultStyleId: "solid",
				styleIds: ["solid"],
				futureStyleIds: [],
				defaultFontWeight: 900
			}],
			["whiteboard", {
				defaultShortPrefixId: "fawsb",
				defaultStyleId: "semibold",
				styleIds: ["semibold"],
				futureStyleIds: [],
				defaultFontWeight: 600
			}]
		]);
		var $l = {
			chisel: { regular: "facr" },
			classic: {
				brands: "fab",
				light: "fal",
				regular: "far",
				solid: "fas",
				thin: "fat"
			},
			duotone: {
				light: "fadl",
				regular: "fadr",
				solid: "fad",
				thin: "fadt"
			},
			etch: { solid: "faes" },
			graphite: { thin: "fagt" },
			jelly: { regular: "fajr" },
			"jelly-duo": { regular: "fajdr" },
			"jelly-fill": { regular: "fajfr" },
			mosaic: { solid: "fams" },
			notdog: { solid: "fans" },
			"notdog-duo": { solid: "fands" },
			pixel: { regular: "fapr" },
			sharp: {
				light: "fasl",
				regular: "fasr",
				solid: "fass",
				thin: "fast"
			},
			"sharp-duotone": {
				light: "fasdl",
				regular: "fasdr",
				solid: "fasds",
				thin: "fasdt"
			},
			slab: { regular: "faslr" },
			"slab-duo": { regular: "fasldr" },
			"slab-press": { regular: "faslpr" },
			"slab-press-duo": { regular: "faslpdr" },
			thumbprint: { light: "fatl" },
			utility: { semibold: "fausb" },
			"utility-duo": { semibold: "faudsb" },
			"utility-fill": { semibold: "faufsb" },
			vellum: { solid: "favs" },
			whiteboard: { semibold: "fawsb" }
		};
		var at = [
			"fak",
			"fa-kit",
			"fakd",
			"fa-kit-duotone"
		];
		var rt = {
			kit: {
				fak: "kit",
				"fa-kit": "kit"
			},
			"kit-duotone": {
				fakd: "kit-duotone",
				"fa-kit-duotone": "kit-duotone"
			}
		};
		var it = ["kit"];
		_defineProperty(_defineProperty({}, "kit", "Kit"), "kit-duotone", "Kit Duotone");
		var mt = {
			kit: { "fa-kit": "fak" },
			"kit-duotone": { "fa-kit-duotone": "fakd" }
		};
		var ct = {
			"Font Awesome Kit": {
				400: "fak",
				normal: "fak"
			},
			"Font Awesome Kit Duotone": {
				400: "fakd",
				normal: "fakd"
			}
		};
		var It = {
			kit: { fak: "fa-kit" },
			"kit-duotone": { fakd: "fa-kit-duotone" }
		};
		var St = {
			kit: { kit: "fak" },
			"kit-duotone": { "kit-duotone": "fakd" }
		};
		var _jl;
		var l$1 = {
			GROUP: "duotone-group",
			SWAP_OPACITY: "swap-opacity",
			PRIMARY: "primary",
			SECONDARY: "secondary"
		};
		var n$1 = [
			"fa-classic",
			"fa-duotone",
			"fa-sharp",
			"fa-sharp-duotone",
			"fa-thumbprint",
			"fa-whiteboard",
			"fa-notdog",
			"fa-notdog-duo",
			"fa-chisel",
			"fa-etch",
			"fa-graphite",
			"fa-jelly",
			"fa-jelly-fill",
			"fa-jelly-duo",
			"fa-slab",
			"fa-slab-press",
			"fa-slab-press-duo",
			"fa-slab-duo",
			"fa-mosaic",
			"fa-pixel",
			"fa-vellum",
			"fa-utility",
			"fa-utility-duo",
			"fa-utility-fill"
		];
		_jl = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_jl, "classic", "Classic"), "duotone", "Duotone"), "sharp", "Sharp"), "sharp-duotone", "Sharp Duotone"), "chisel", "Chisel"), "etch", "Etch"), "graphite", "Graphite"), "jelly", "Jelly"), "jelly-duo", "Jelly Duo"), "jelly-fill", "Jelly Fill"), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_jl, "mosaic", "Mosaic"), "notdog", "Notdog"), "notdog-duo", "Notdog Duo"), "pixel", "Pixel"), "slab", "Slab"), "slab-duo", "Slab Duo"), "slab-press", "Slab Press"), "slab-press-duo", "Slab Press Duo"), "thumbprint", "Thumbprint"), "utility", "Utility"), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_jl, "utility-duo", "Utility Duo"), "utility-fill", "Utility Fill"), "vellum", "Vellum"), "whiteboard", "Whiteboard");
		_defineProperty(_defineProperty({}, "kit", "Kit"), "kit-duotone", "Kit Duotone");
		var ra = {
			classic: {
				"fa-brands": "fab",
				"fa-duotone": "fad",
				"fa-light": "fal",
				"fa-regular": "far",
				"fa-solid": "fas",
				"fa-thin": "fat"
			},
			duotone: {
				"fa-regular": "fadr",
				"fa-light": "fadl",
				"fa-thin": "fadt"
			},
			sharp: {
				"fa-solid": "fass",
				"fa-regular": "fasr",
				"fa-light": "fasl",
				"fa-thin": "fast"
			},
			"sharp-duotone": {
				"fa-solid": "fasds",
				"fa-regular": "fasdr",
				"fa-light": "fasdl",
				"fa-thin": "fasdt"
			},
			slab: { "fa-regular": "faslr" },
			"slab-press": { "fa-regular": "faslpr" },
			"slab-duo": { "fa-regular": "fasldr" },
			"slab-press-duo": { "fa-regular": "faslpdr" },
			pixel: { "fa-regular": "fapr" },
			mosaic: { "fa-solid": "fams" },
			vellum: { "fa-solid": "favs" },
			whiteboard: { "fa-semibold": "fawsb" },
			thumbprint: { "fa-light": "fatl" },
			notdog: { "fa-solid": "fans" },
			"notdog-duo": { "fa-solid": "fands" },
			etch: { "fa-solid": "faes" },
			graphite: { "fa-thin": "fagt" },
			jelly: { "fa-regular": "fajr" },
			"jelly-fill": { "fa-regular": "fajfr" },
			"jelly-duo": { "fa-regular": "fajdr" },
			chisel: { "fa-regular": "facr" },
			utility: { "fa-semibold": "fausb" },
			"utility-duo": { "fa-semibold": "faudsb" },
			"utility-fill": { "fa-semibold": "faufsb" }
		};
		var al$1 = {
			classic: [
				"fas",
				"far",
				"fal",
				"fat",
				"fad"
			],
			duotone: [
				"fadr",
				"fadl",
				"fadt"
			],
			sharp: [
				"fass",
				"fasr",
				"fasl",
				"fast"
			],
			"sharp-duotone": [
				"fasds",
				"fasdr",
				"fasdl",
				"fasdt"
			],
			slab: ["faslr"],
			"slab-press": ["faslpr"],
			"slab-duo": ["fasldr"],
			"slab-press-duo": ["faslpdr"],
			pixel: ["fapr"],
			mosaic: ["fams"],
			vellum: ["favs"],
			whiteboard: ["fawsb"],
			thumbprint: ["fatl"],
			notdog: ["fans"],
			"notdog-duo": ["fands"],
			etch: ["faes"],
			graphite: ["fagt"],
			jelly: ["fajr"],
			"jelly-fill": ["fajfr"],
			"jelly-duo": ["fajdr"],
			chisel: ["facr"],
			utility: ["fausb"],
			"utility-duo": ["faudsb"],
			"utility-fill": ["faufsb"]
		};
		var da = {
			classic: {
				fab: "fa-brands",
				fad: "fa-duotone",
				fal: "fa-light",
				far: "fa-regular",
				fas: "fa-solid",
				fat: "fa-thin"
			},
			duotone: {
				fadr: "fa-regular",
				fadl: "fa-light",
				fadt: "fa-thin"
			},
			sharp: {
				fass: "fa-solid",
				fasr: "fa-regular",
				fasl: "fa-light",
				fast: "fa-thin"
			},
			"sharp-duotone": {
				fasds: "fa-solid",
				fasdr: "fa-regular",
				fasdl: "fa-light",
				fasdt: "fa-thin"
			},
			slab: { faslr: "fa-regular" },
			"slab-press": { faslpr: "fa-regular" },
			"slab-duo": { fasldr: "fa-regular" },
			"slab-press-duo": { faslpdr: "fa-regular" },
			pixel: { fapr: "fa-regular" },
			mosaic: { fams: "fa-solid" },
			vellum: { favs: "fa-solid" },
			whiteboard: { fawsb: "fa-semibold" },
			thumbprint: { fatl: "fa-light" },
			notdog: { fans: "fa-solid" },
			"notdog-duo": { fands: "fa-solid" },
			etch: { faes: "fa-solid" },
			graphite: { fagt: "fa-thin" },
			jelly: { fajr: "fa-regular" },
			"jelly-fill": { fajfr: "fa-regular" },
			"jelly-duo": { fajdr: "fa-regular" },
			chisel: { facr: "fa-regular" },
			utility: { fausb: "fa-semibold" },
			"utility-duo": { faudsb: "fa-semibold" },
			"utility-fill": { faufsb: "fa-semibold" }
		};
		var ha = [
			"fa",
			"fas",
			"far",
			"fal",
			"fat",
			"fad",
			"fadr",
			"fadl",
			"fadt",
			"fab",
			"fass",
			"fasr",
			"fasl",
			"fast",
			"fasds",
			"fasdr",
			"fasdl",
			"fasdt",
			"faslr",
			"faslpr",
			"fasldr",
			"faslpdr",
			"fapr",
			"fams",
			"favs",
			"fawsb",
			"fatl",
			"fans",
			"fands",
			"faes",
			"fagt",
			"fajr",
			"fajfr",
			"fajdr",
			"facr",
			"fausb",
			"faudsb",
			"faufsb"
		].concat(n$1, [
			"fa-solid",
			"fa-regular",
			"fa-light",
			"fa-thin",
			"fa-duotone",
			"fa-brands",
			"fa-semibold"
		]);
		var el$1 = [
			"solid",
			"regular",
			"light",
			"thin",
			"duotone",
			"brands",
			"semibold"
		];
		var sl$1 = [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10
		];
		var ol$1 = sl$1.concat([
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20
		]);
		var ga = [].concat(_toConsumableArray(Object.keys(al$1)), el$1, [
			"aw",
			"fw",
			"pull-left",
			"pull-right"
		], [
			"2xs",
			"xs",
			"sm",
			"lg",
			"xl",
			"2xl",
			"beat",
			"beat-fade",
			"border",
			"bounce",
			"buzz",
			"canvas-square",
			"canvas-roomy",
			"fade",
			"flip-360",
			"flip-both",
			"flip-horizontal",
			"flip-vertical",
			"flip",
			"float",
			"inverse",
			"jello",
			"layers",
			"layers-bottom-left",
			"layers-bottom-right",
			"layers-counter",
			"layers-text",
			"layers-top-left",
			"layers-top-right",
			"li",
			"pull-end",
			"pull-start",
			"pulse",
			"rotate-180",
			"rotate-270",
			"rotate-90",
			"rotate-by",
			"shake",
			"spin-pulse",
			"spin-reverse",
			"spin",
			"spin-snap",
			"spin-snap-4",
			"spin-snap-8",
			"stack-1x",
			"stack-2x",
			"stack",
			"swing",
			"ul",
			"wag",
			"width-auto",
			"width-fixed",
			l$1.GROUP,
			l$1.SWAP_OPACITY,
			l$1.PRIMARY,
			l$1.SECONDARY
		]).concat(sl$1.map(function(s) {
			return "".concat(s, "x");
		})).concat(ol$1.map(function(s) {
			return "w-".concat(s);
		}));
		var wa = {
			"Font Awesome 5 Free": {
				900: "fas",
				400: "far"
			},
			"Font Awesome 5 Pro": {
				900: "fas",
				400: "far",
				normal: "far",
				300: "fal"
			},
			"Font Awesome 5 Brands": {
				400: "fab",
				normal: "fab"
			},
			"Font Awesome 5 Duotone": { 900: "fad" }
		};
		var NAMESPACE_IDENTIFIER = "___FONT_AWESOME___";
		var UNITS_IN_GRID = 16;
		var DEFAULT_CSS_PREFIX = "fa";
		var DEFAULT_REPLACEMENT_CLASS = "svg-inline--fa";
		var DATA_FA_I2SVG = "data-fa-i2svg";
		var DATA_FA_PSEUDO_ELEMENT = "data-fa-pseudo-element";
		var DATA_FA_PSEUDO_ELEMENT_PENDING = "data-fa-pseudo-element-pending";
		var DATA_PREFIX = "data-prefix";
		var DATA_ICON = "data-icon";
		var HTML_CLASS_I2SVG_BASE_CLASS = "fontawesome-i2svg";
		var MUTATION_APPROACH_ASYNC = "async";
		var TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = [
			"HTML",
			"HEAD",
			"STYLE",
			"SCRIPT"
		];
		var PSEUDO_ELEMENTS = [
			"::before",
			"::after",
			":before",
			":after"
		];
		var PRODUCTION = function() {
			try {
				return true;
			} catch (e$$1) {
				return false;
			}
		}();
		function familyProxy(obj) {
			return new Proxy(obj, { get: function get(target, prop) {
				return prop in target ? target[prop] : target[u];
			} });
		}
		var _PREFIX_TO_STYLE = _objectSpread2({}, rl);
		_PREFIX_TO_STYLE[u] = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, { "fa-duotone": "duotone" }), rl[u]), rt["kit"]), rt["kit-duotone"]);
		var PREFIX_TO_STYLE = familyProxy(_PREFIX_TO_STYLE);
		var _STYLE_TO_PREFIX = _objectSpread2({}, $l);
		_STYLE_TO_PREFIX[u] = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, { duotone: "fad" }), _STYLE_TO_PREFIX[u]), St["kit"]), St["kit-duotone"]);
		var STYLE_TO_PREFIX = familyProxy(_STYLE_TO_PREFIX);
		var _PREFIX_TO_LONG_STYLE = _objectSpread2({}, da);
		_PREFIX_TO_LONG_STYLE[u] = _objectSpread2(_objectSpread2({}, _PREFIX_TO_LONG_STYLE[u]), It["kit"]);
		var PREFIX_TO_LONG_STYLE = familyProxy(_PREFIX_TO_LONG_STYLE);
		var _LONG_STYLE_TO_PREFIX = _objectSpread2({}, ra);
		_LONG_STYLE_TO_PREFIX[u] = _objectSpread2(_objectSpread2({}, _LONG_STYLE_TO_PREFIX[u]), mt["kit"]);
		familyProxy(_LONG_STYLE_TO_PREFIX);
		var ICON_SELECTION_SYNTAX_PATTERN = Z;
		var LAYERS_TEXT_CLASSNAME = "fa-layers-text";
		var FONT_FAMILY_PATTERN = $;
		familyProxy(_objectSpread2({}, Al));
		var ATTRIBUTES_WATCHED_FOR_MUTATION = [
			"class",
			"data-prefix",
			"data-icon",
			"data-fa-transform",
			"data-fa-mask"
		];
		var DUOTONE_CLASSES = il;
		var RESERVED_CLASSES = [].concat(_toConsumableArray(it), _toConsumableArray(ga));
		var initial = WINDOW.FontAwesomeConfig || {};
		function getAttrConfig(attr) {
			var element = DOCUMENT.querySelector("script[" + attr + "]");
			if (element) return element.getAttribute(attr);
		}
		function coerce(val) {
			if (val === "") return true;
			if (val === "false") return false;
			if (val === "true") return true;
			return val;
		}
		if (DOCUMENT && typeof DOCUMENT.querySelector === "function") [
			["data-family-prefix", "familyPrefix"],
			["data-css-prefix", "cssPrefix"],
			["data-family-default", "familyDefault"],
			["data-style-default", "styleDefault"],
			["data-replacement-class", "replacementClass"],
			["data-auto-replace-svg", "autoReplaceSvg"],
			["data-auto-add-css", "autoAddCss"],
			["data-search-pseudo-elements", "searchPseudoElements"],
			["data-search-pseudo-elements-warnings", "searchPseudoElementsWarnings"],
			["data-search-pseudo-elements-full-scan", "searchPseudoElementsFullScan"],
			["data-observe-mutations", "observeMutations"],
			["data-mutate-approach", "mutateApproach"],
			["data-keep-original-source", "keepOriginalSource"],
			["data-measure-performance", "measurePerformance"],
			["data-show-missing-icons", "showMissingIcons"]
		].forEach(function(_ref) {
			var _ref2 = _slicedToArray(_ref, 2), attr = _ref2[0], key = _ref2[1];
			var val = coerce(getAttrConfig(attr));
			if (val !== void 0 && val !== null) initial[key] = val;
		});
		var _default = {
			styleDefault: "solid",
			familyDefault: u,
			cssPrefix: DEFAULT_CSS_PREFIX,
			replacementClass: DEFAULT_REPLACEMENT_CLASS,
			autoReplaceSvg: true,
			autoAddCss: true,
			searchPseudoElements: false,
			searchPseudoElementsWarnings: true,
			searchPseudoElementsFullScan: false,
			observeMutations: true,
			mutateApproach: "async",
			keepOriginalSource: true,
			measurePerformance: false,
			showMissingIcons: true
		};
		if (initial.familyPrefix) initial.cssPrefix = initial.familyPrefix;
		var _config = _objectSpread2(_objectSpread2({}, _default), initial);
		if (!_config.autoReplaceSvg) _config.observeMutations = false;
		var config = {};
		Object.keys(_default).forEach(function(key) {
			Object.defineProperty(config, key, {
				enumerable: true,
				set: function set(val) {
					_config[key] = val;
					_onChangeCb.forEach(function(cb) {
						return cb(config);
					});
				},
				get: function get() {
					return _config[key];
				}
			});
		});
		Object.defineProperty(config, "familyPrefix", {
			enumerable: true,
			set: function set(val) {
				_config.cssPrefix = val;
				_onChangeCb.forEach(function(cb) {
					return cb(config);
				});
			},
			get: function get() {
				return _config.cssPrefix;
			}
		});
		WINDOW.FontAwesomeConfig = config;
		var _onChangeCb = [];
		function onChange(cb) {
			_onChangeCb.push(cb);
			return function() {
				_onChangeCb.splice(_onChangeCb.indexOf(cb), 1);
			};
		}
		var d$2 = UNITS_IN_GRID;
		var meaninglessTransform = {
			size: 16,
			x: 0,
			y: 0,
			rotate: 0,
			flipX: false,
			flipY: false
		};
		function insertCss(css) {
			if (!css || !IS_DOM) return;
			var style = DOCUMENT.createElement("style");
			style.setAttribute("type", "text/css");
			style.innerHTML = css;
			var headChildren = DOCUMENT.head.childNodes;
			var beforeChild = null;
			for (var i = headChildren.length - 1; i > -1; i--) {
				var child = headChildren[i];
				var tagName = (child.tagName || "").toUpperCase();
				if (["STYLE", "LINK"].indexOf(tagName) > -1) beforeChild = child;
			}
			DOCUMENT.head.insertBefore(style, beforeChild);
			return css;
		}
		var idPool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		function nextUniqueId() {
			var size = 12;
			var id = "";
			while (size-- > 0) id += idPool[Math.random() * 62 | 0];
			return id;
		}
		function toArray(obj) {
			var array = [];
			for (var i = (obj || []).length >>> 0; i--;) array[i] = obj[i];
			return array;
		}
		function classArray(node) {
			if (node.classList) return toArray(node.classList);
			else return (node.getAttribute("class") || "").split(" ").filter(function(i) {
				return i;
			});
		}
		function htmlEscape(str) {
			return "".concat(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		}
		function joinAttributes(attributes) {
			return Object.keys(attributes || {}).reduce(function(acc, attributeName) {
				return acc + "".concat(attributeName, "=\"").concat(htmlEscape(attributes[attributeName]), "\" ");
			}, "").trim();
		}
		function joinStyles(styles) {
			return Object.keys(styles || {}).reduce(function(acc, styleName) {
				return acc + "".concat(styleName, ": ").concat(styles[styleName].trim(), ";");
			}, "");
		}
		function transformIsMeaningful(transform) {
			return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
		}
		function transformForSvg(_ref) {
			var transform = _ref.transform, containerWidth = _ref.containerWidth, iconWidth = _ref.iconWidth;
			var outer = { transform: "translate(".concat(containerWidth / 2, " 256)") };
			var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
			var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
			var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
			return {
				outer,
				inner: { transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate) },
				path: { transform: "translate(".concat(iconWidth / 2 * -1, " -256)") }
			};
		}
		function transformForCss(_ref2) {
			var transform = _ref2.transform, _ref2$width = _ref2.width, width = _ref2$width === void 0 ? UNITS_IN_GRID : _ref2$width, _ref2$height = _ref2.height, height = _ref2$height === void 0 ? UNITS_IN_GRID : _ref2$height, _ref2$startCentered = _ref2.startCentered, startCentered = _ref2$startCentered === void 0 ? false : _ref2$startCentered;
			var val = "";
			if (startCentered && IS_IE) val += "translate(".concat(transform.x / d$2 - width / 2, "em, ").concat(transform.y / d$2 - height / 2, "em) ");
			else if (startCentered) val += "translate(calc(-50% + ".concat(transform.x / d$2, "em), calc(-50% + ").concat(transform.y / d$2, "em)) ");
			else val += "translate(".concat(transform.x / d$2, "em, ").concat(transform.y / d$2, "em) ");
			val += "scale(".concat(transform.size / d$2 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / d$2 * (transform.flipY ? -1 : 1), ") ");
			val += "rotate(".concat(transform.rotate, "deg) ");
			return val;
		}
		var baseStyles = ":root, :host {\n  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';\n  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';\n  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';\n  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';\n  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';\n  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';\n  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';\n  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';\n  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';\n  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';\n  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';\n  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';\n  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';\n  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';\n  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';\n  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';\n  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';\n  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';\n  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';\n  --fa-font-slab-duo-regular: normal 400 1em/1 'Font Awesome 7 Slab Duo';\n  --fa-font-slab-press-duo-regular: normal 400 1em/1 'Font Awesome 7 Slab Press Duo';\n  --fa-font-pixel-regular: normal 400 1em/1 'Font Awesome 7 Pixel';\n  --fa-font-mosaic-solid: normal 900 1em/1 'Font Awesome 7 Mosaic';\n  --fa-font-vellum-solid: normal 900 1em/1 'Font Awesome 7 Vellum';\n  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';\n  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';\n  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';\n  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';\n  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';\n  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';\n  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';\n  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';\n  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';\n  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';\n  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';\n  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';\n  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';\n}\n\n.svg-inline--fa {\n  box-sizing: content-box;\n  display: var(--fa-display, inline-block);\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n  width: var(--fa-width, 1.25em);\n}\n.svg-inline--fa.fa-2xs {\n  vertical-align: 0.1em;\n}\n.svg-inline--fa.fa-xs {\n  vertical-align: 0em;\n}\n.svg-inline--fa.fa-sm {\n  vertical-align: -0.0714285714em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.2em;\n}\n.svg-inline--fa.fa-xl {\n  vertical-align: -0.25em;\n}\n.svg-inline--fa.fa-2xl {\n  vertical-align: -0.3125em;\n}\n.svg-inline--fa.fa-pull-left,\n.svg-inline--fa .fa-pull-start {\n  float: inline-start;\n  margin-inline-end: var(--fa-pull-margin, 0.3em);\n}\n.svg-inline--fa.fa-pull-right,\n.svg-inline--fa .fa-pull-end {\n  float: inline-end;\n  margin-inline-start: var(--fa-pull-margin, 0.3em);\n}\n.svg-inline--fa.fa-li {\n  width: var(--fa-li-width, 2em);\n  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));\n  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: var(--fa-width, 1.25em);\n}\n.fa-layers .svg-inline--fa {\n  inset: 0;\n  margin: auto;\n  position: absolute;\n  transform-origin: center center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: var(--fa-counter-background-color, #ff253a);\n  border-radius: var(--fa-counter-border-radius, 1em);\n  box-sizing: border-box;\n  color: var(--fa-inverse, #fff);\n  line-height: var(--fa-counter-line-height, 1);\n  max-width: var(--fa-counter-max-width, 5em);\n  min-width: var(--fa-counter-min-width, 1.5em);\n  overflow: hidden;\n  padding: var(--fa-counter-padding, 0.25em 0.5em);\n  right: var(--fa-right, 0);\n  text-overflow: ellipsis;\n  top: var(--fa-top, 0);\n  transform: scale(var(--fa-counter-scale, 0.25));\n  transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: var(--fa-bottom, 0);\n  right: var(--fa-right, 0);\n  top: auto;\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: var(--fa-bottom, 0);\n  left: var(--fa-left, 0);\n  right: auto;\n  top: auto;\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  top: var(--fa-top, 0);\n  right: var(--fa-right, 0);\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: var(--fa-left, 0);\n  right: auto;\n  top: var(--fa-top, 0);\n  transform: scale(var(--fa-layers-scale, 0.25));\n  transform-origin: top left;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-2xs {\n  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-xs {\n  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-sm {\n  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-lg {\n  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-xl {\n  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-2xl {\n  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */\n  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */\n  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */\n}\n\n.fa-width-auto {\n  --fa-width: auto;\n}\n\n.fa-fw,\n.fa-width-fixed {\n  --fa-width: 1.25em;\n}\n\n.fa-canvas-square {\n  padding-block: 0.125em;\n  margin-block-end: -0.125em;\n}\n\n.fa-canvas-roomy {\n  padding-block: 0.25em;\n  padding-inline: 0.125em;\n  margin-block-end: -0.25em;\n  box-sizing: content-box;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-inline-start: var(--fa-li-margin, 2.5em);\n  padding-inline-start: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));\n  position: absolute;\n  text-align: center;\n  width: var(--fa-li-width, 2em);\n  line-height: inherit;\n}\n\n/* Heads Up: Bordered Icons will not be supported in the future!\n  - This feature will be deprecated in the next major release of Font Awesome (v8)!\n  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.\n*/\n/* Notes:\n* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)\n* --@{v.$css-prefix}-border-padding =\n  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)\n  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)\n*/\n.fa-border {\n  border-color: var(--fa-border-color, #eee);\n  border-radius: var(--fa-border-radius, 0.1em);\n  border-style: var(--fa-border-style, solid);\n  border-width: var(--fa-border-width, 0.0625em);\n  box-sizing: var(--fa-border-box-sizing, content-box);\n  padding: var(--fa-border-padding, 0.1875em 0.25em);\n}\n\n.fa-pull-left,\n.fa-pull-start {\n  float: inline-start;\n  margin-inline-end: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-pull-right,\n.fa-pull-end {\n  float: inline-end;\n  margin-inline-start: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-beat {\n  animation-name: fa-beat;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-bounce {\n  animation-name: fa-bounce;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n}\n\n.fa-fade {\n  animation-name: fa-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-beat-fade {\n  animation-name: fa-beat-fade;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-flip {\n  animation-name: fa-flip;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1.5s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-flip-360 {\n  animation-name: fa-flip-360;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-shake {\n  animation-name: fa-shake;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 0.75s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-spin {\n  animation-name: fa-spin;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 2s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin-reverse {\n  --fa-animation-direction: reverse;\n}\n\n.fa-pulse,\n.fa-spin-pulse {\n  animation-name: fa-spin;\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, steps(8));\n}\n\n.fa-spin-snap {\n  animation-name: fa-spin-snap;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 3s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin-snap-4 {\n  animation-name: fa-spin-snap-4;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 2.4s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin-snap-8 {\n  animation-name: fa-spin-snap-8;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 4s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-buzz {\n  animation-name: fa-buzz;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 0.6s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-wag {\n  animation-name: fa-wag;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 0.9s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-out);\n  transform-origin: bottom center;\n}\n\n.fa-float {\n  animation-name: fa-float;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 3s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-in-out);\n  will-change: transform;\n}\n\n.fa-swing {\n  animation-name: fa-swing;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 1.2s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-out);\n  transform-origin: top center;\n}\n\n.fa-jello {\n  animation-name: fa-jello;\n  animation-delay: var(--fa-animation-delay, 0s);\n  animation-direction: var(--fa-animation-direction, normal);\n  animation-duration: var(--fa-animation-duration, 0.9s);\n  animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  animation-timing-function: var(--fa-animation-timing, ease-out);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fa-beat,\n  .fa-bounce,\n  .fa-fade,\n  .fa-beat-fade,\n  .fa-flip,\n  .fa-flip-360,\n  .fa-pulse,\n  .fa-shake,\n  .fa-spin,\n  .fa-spin-pulse,\n  .fa-buzz,\n  .fa-float,\n  .fa-jello,\n  .fa-spin-snap,\n  .fa-spin-snap-4,\n  .fa-spin-snap-8,\n  .fa-swing,\n  .fa-wag {\n    animation: none !important;\n    transition: none !important;\n  }\n}\n@keyframes fa-beat {\n  0% {\n    transform: scale(1);\n  }\n  25% {\n    transform: scale(calc(1.25 * var(--fa-beat-scale, 1.25)));\n  }\n  45% {\n    transform: scale(calc(1.22 * var(--fa-beat-scale, 1.22)));\n  }\n  65% {\n    transform: scale(calc(1.25 * var(--fa-beat-scale, 1.25)));\n  }\n  90% {\n    transform: scale(1);\n  }\n}\n@keyframes fa-bounce {\n  0% {\n    transform: scale(1, 1) translateY(0);\n    animation-timing-function: var(--fa-animation-timing);\n  }\n  14% {\n    transform: scale(var(--fa-bounce-start-scale-x, 1.06), var(--fa-bounce-start-scale-y, 0.94)) translateY(var(--fa-bounce-anticipation, 3px));\n    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);\n  }\n  32% {\n    transform: scale(var(--fa-bounce-jump-scale-x, 0.94), var(--fa-bounce-jump-scale-y, 1.12)) translateY(calc(-1 * var(--fa-bounce-height, 0.5em)));\n    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);\n  }\n  52% {\n    transform: scale(1, 1) translateY(calc(-1 * var(--fa-bounce-height, 0.5em) * 1.1));\n    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);\n  }\n  70% {\n    transform: scale(var(--fa-bounce-land-scale-x, 1.06), var(--fa-bounce-land-scale-y, 0.92)) translateY(0);\n    animation-timing-function: cubic-bezier(0.33, 0.33, 0.66, 1);\n  }\n  85% {\n    transform: scale(0.98, 1.04) translateY(calc(-2px * var(--fa-bounce-rebound, 1)));\n    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);\n  }\n  100% {\n    transform: scale(1, 1) translateY(0);\n  }\n}\n@keyframes fa-fade {\n  0% {\n    opacity: 1;\n    transform: scale(1);\n    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);\n  }\n  40% {\n    opacity: var(--fa-fade-opacity, 0.4);\n    transform: scale(0.98);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);\n  }\n  100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes fa-beat-fade {\n  0% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    transform: scale(1);\n    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);\n  }\n  25% {\n    opacity: calc(var(--fa-beat-fade-opacity, 0.4) + 0.4);\n    transform: scale(var(--fa-beat-fade-scale, 1.28));\n    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);\n  }\n  45% {\n    opacity: 1;\n    transform: scale(var(--fa-beat-fade-scale, 1.25));\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  }\n  65% {\n    opacity: calc(var(--fa-beat-fade-opacity, 0.4) + 0.4);\n    transform: scale(var(--fa-beat-fade-scale, 1.28));\n    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);\n  }\n  100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    transform: scale(1);\n  }\n}\n@keyframes fa-flip {\n  0% {\n    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);\n    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);\n  }\n  8% {\n    transform: perspective(2em) scale(var(--fa-flip-anticipation-scale, 0.95)) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);\n    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);\n  }\n  35% {\n    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.6));\n    animation-timing-function: linear;\n  }\n  65% {\n    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.5));\n    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);\n  }\n  92% {\n    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * var(--fa-flip-overshoot, 1.04)));\n    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);\n  }\n  100% {\n    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -360deg));\n  }\n}\n@keyframes fa-flip-360 {\n  0% {\n    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);\n    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);\n  }\n  8% {\n    transform: perspective(2em) scale(var(--fa-flip-anticipation-scale, 0.95)) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);\n    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);\n  }\n  50% {\n    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.6));\n    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);\n  }\n  80% {\n    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * var(--fa-flip-overshoot, 1.04)));\n    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);\n  }\n  100% {\n    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -360deg));\n  }\n}\n@keyframes fa-shake {\n  0% {\n    transform: rotate(0deg);\n    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);\n  }\n  8% {\n    transform: rotate(35deg) translateX(1px);\n    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);\n  }\n  20% {\n    transform: rotate(-22deg) translateX(-1px);\n    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);\n  }\n  35% {\n    transform: rotate(15deg) translateX(1px);\n    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);\n  }\n  50% {\n    transform: rotate(-9deg);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);\n  }\n  65% {\n    transform: rotate(5deg);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);\n  }\n  78% {\n    transform: rotate(-3deg);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);\n  }\n  90% {\n    transform: rotate(1deg);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  }\n  100% {\n    transform: rotate(0deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes fa-spin-snap {\n  0% {\n    transform: rotate(0deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  12% {\n    transform: rotate(60deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  16.67% {\n    transform: rotate(60deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  28.67% {\n    transform: rotate(120deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  33.33% {\n    transform: rotate(120deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  45.33% {\n    transform: rotate(180deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  50% {\n    transform: rotate(180deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  62% {\n    transform: rotate(240deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  66.67% {\n    transform: rotate(240deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  78.67% {\n    transform: rotate(300deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  83.33% {\n    transform: rotate(300deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  95.33% {\n    transform: rotate(360deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes fa-spin-snap-4 {\n  0% {\n    transform: rotate(0deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  15% {\n    transform: rotate(90deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  25% {\n    transform: rotate(90deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  40% {\n    transform: rotate(180deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  50% {\n    transform: rotate(180deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  65% {\n    transform: rotate(270deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  75% {\n    transform: rotate(270deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  90% {\n    transform: rotate(360deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes fa-spin-snap-8 {\n  0% {\n    transform: rotate(0deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  9% {\n    transform: rotate(45deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  12.5% {\n    transform: rotate(45deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  21.5% {\n    transform: rotate(90deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  25% {\n    transform: rotate(90deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  34% {\n    transform: rotate(135deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  37.5% {\n    transform: rotate(135deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  46.5% {\n    transform: rotate(180deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  50% {\n    transform: rotate(180deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  59% {\n    transform: rotate(225deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  62.5% {\n    transform: rotate(225deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  71.5% {\n    transform: rotate(270deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  75% {\n    transform: rotate(270deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  84% {\n    transform: rotate(315deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  87.5% {\n    transform: rotate(315deg);\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  96.5% {\n    transform: rotate(360deg);\n    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes fa-buzz {\n  0% {\n    transform: translateX(0) rotate(0deg);\n    animation-timing-function: cubic-bezier(0.1, 0, 0.9, 1);\n  }\n  5% {\n    transform: translateX(var(--fa-buzz-distance, 4px)) rotate(0.5deg);\n  }\n  10% {\n    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px))) rotate(-0.5deg);\n  }\n  15% {\n    transform: translateX(var(--fa-buzz-distance, 4px)) rotate(0.3deg);\n  }\n  20% {\n    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px))) rotate(-0.3deg);\n  }\n  25% {\n    transform: translateX(calc(var(--fa-buzz-distance, 4px) * 0.7)) rotate(0.2deg);\n  }\n  30% {\n    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px) * 0.7)) rotate(-0.2deg);\n  }\n  35% {\n    transform: translateX(calc(var(--fa-buzz-distance, 4px) * 0.4)) rotate(0.1deg);\n  }\n  40% {\n    transform: translateX(0) rotate(0deg);\n  }\n  100% {\n    transform: translateX(0) rotate(0deg);\n  }\n}\n@keyframes fa-wag {\n  0% {\n    transform: rotate(0deg);\n    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);\n  }\n  12% {\n    transform: rotate(var(--fa-wag-angle, 12deg));\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  }\n  24% {\n    transform: rotate(2deg);\n    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);\n  }\n  36% {\n    transform: rotate(calc(var(--fa-wag-angle, 12deg) * 0.85));\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  }\n  48% {\n    transform: rotate(1deg);\n    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);\n  }\n  58% {\n    transform: rotate(calc(var(--fa-wag-angle, 12deg) * 0.6));\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  }\n  68% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(0deg);\n  }\n}\n@keyframes fa-float {\n  0% {\n    transform: translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));\n    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);\n  }\n  15% {\n    transform: translateY(calc(-0.4 * var(--fa-float-height, 6px))) translateX(var(--fa-float-drift, 1px)) rotate(var(--fa-float-tilt, 1deg)) scale(1, 1);\n    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);\n  }\n  35% {\n    transform: translateY(calc(-1 * var(--fa-float-height, 6px))) translateX(0) rotate(0deg) scale(var(--fa-float-stretch-x, 0.98), var(--fa-float-stretch-y, 1.03));\n    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 0);\n  }\n  50% {\n    transform: translateY(calc(-0.92 * var(--fa-float-height, 6px))) translateX(calc(-0.5 * var(--fa-float-drift, 1px))) rotate(calc(-0.5 * var(--fa-float-tilt, 1deg))) scale(0.995, 1.01);\n    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);\n  }\n  70% {\n    transform: translateY(calc(-0.3 * var(--fa-float-height, 6px))) translateX(calc(-1 * var(--fa-float-drift, 1px))) rotate(calc(-1 * var(--fa-float-tilt, 1deg))) scale(1, 1);\n    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);\n  }\n  90% {\n    transform: translateY(calc(0.05 * var(--fa-float-height, 6px))) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));\n    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);\n  }\n  100% {\n    transform: translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));\n  }\n}\n@keyframes fa-swing {\n  0% {\n    transform: rotate(0deg);\n    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);\n  }\n  8% {\n    transform: rotate(var(--fa-swing-angle, 22deg));\n    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);\n  }\n  18% {\n    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.85));\n    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);\n  }\n  28% {\n    transform: rotate(calc(var(--fa-swing-angle, 22deg) * 0.65));\n    animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);\n  }\n  38% {\n    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.45));\n    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);\n  }\n  48% {\n    transform: rotate(calc(var(--fa-swing-angle, 22deg) * 0.25));\n    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);\n  }\n  56% {\n    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.1));\n    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);\n  }\n  64% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(0deg);\n  }\n}\n@keyframes fa-jello {\n  0% {\n    transform: scale(1, 1);\n    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);\n  }\n  12% {\n    transform: scale(var(--fa-jello-scale-x, 1.15), calc(2 - var(--fa-jello-scale-x, 1.15)));\n    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);\n  }\n  24% {\n    transform: scale(calc(2 - var(--fa-jello-scale-y, 1.12)), var(--fa-jello-scale-y, 1.12));\n    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);\n  }\n  36% {\n    transform: scale(calc(1 + (var(--fa-jello-scale-x, 1.15) - 1) * 0.5), calc(2 - (1 + (var(--fa-jello-scale-x, 1.15) - 1) * 0.5)));\n    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);\n  }\n  48% {\n    transform: scale(calc(2 - (1 + (var(--fa-jello-scale-y, 1.12) - 1) * 0.3)), calc(1 + (var(--fa-jello-scale-y, 1.12) - 1) * 0.3));\n    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);\n  }\n  58% {\n    transform: scale(1.02, 0.98);\n    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  }\n  68% {\n    transform: scale(1, 1);\n  }\n  100% {\n    transform: scale(1, 1);\n  }\n}\n.fa-rotate-90 {\n  transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  transform: scale(1, -1);\n}\n\n.fa-flip-both,\n.fa-flip-horizontal.fa-flip-vertical {\n  transform: scale(-1, -1);\n}\n\n.fa-rotate-by {\n  transform: rotate(var(--fa-rotate-angle, 0));\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.svg-inline--fa.fa-inverse {\n  fill: var(--fa-inverse, #fff);\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  line-height: 2em;\n  position: relative;\n  vertical-align: middle;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}\n\n.svg-inline--fa.fa-stack-1x {\n  --fa-width: 1.25em;\n  height: 1em;\n  width: var(--fa-width);\n}\n.svg-inline--fa.fa-stack-2x {\n  --fa-width: 2.5em;\n  height: 2em;\n  width: var(--fa-width);\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  inset: 0;\n  margin: auto;\n  position: absolute;\n  z-index: var(--fa-stack-z-index, auto);\n}";
		function css() {
			var dcp = DEFAULT_CSS_PREFIX;
			var drc = DEFAULT_REPLACEMENT_CLASS;
			var fp = config.cssPrefix;
			var rc = config.replacementClass;
			var s = baseStyles;
			if (fp !== dcp || rc !== drc) {
				var dPatt = new RegExp("\\.".concat(dcp, "\\-"), "g");
				var customPropPatt = new RegExp("\\--".concat(dcp, "\\-"), "g");
				var rPatt = new RegExp("\\.".concat(drc), "g");
				s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
			}
			return s;
		}
		var _cssInserted = false;
		function ensureCss() {
			if (config.autoAddCss && !_cssInserted) {
				insertCss(css());
				_cssInserted = true;
			}
		}
		var InjectCSS = {
			mixout: function mixout() {
				return { dom: {
					css,
					insertCss: ensureCss
				} };
			},
			hooks: function hooks() {
				return {
					beforeDOMElementCreation: function beforeDOMElementCreation() {
						ensureCss();
					},
					beforeI2svg: function beforeI2svg() {
						ensureCss();
					}
				};
			}
		};
		var w$2 = WINDOW || {};
		if (!w$2[NAMESPACE_IDENTIFIER]) w$2[NAMESPACE_IDENTIFIER] = {};
		if (!w$2[NAMESPACE_IDENTIFIER].styles) w$2[NAMESPACE_IDENTIFIER].styles = {};
		if (!w$2[NAMESPACE_IDENTIFIER].hooks) w$2[NAMESPACE_IDENTIFIER].hooks = {};
		if (!w$2[NAMESPACE_IDENTIFIER].shims) w$2[NAMESPACE_IDENTIFIER].shims = [];
		var namespace = w$2[NAMESPACE_IDENTIFIER];
		var functions = [];
		var _listener = function listener() {
			DOCUMENT.removeEventListener("DOMContentLoaded", _listener);
			loaded = 1;
			functions.map(function(fn) {
				return fn();
			});
		};
		var loaded = false;
		if (IS_DOM) {
			loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
			if (!loaded) DOCUMENT.addEventListener("DOMContentLoaded", _listener);
		}
		function domready(fn) {
			if (!IS_DOM) return;
			loaded ? setTimeout(fn, 0) : functions.push(fn);
		}
		function toHtml(abstractNodes) {
			var tag = abstractNodes.tag, _abstractNodes$attrib = abstractNodes.attributes, attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib, _abstractNodes$childr = abstractNodes.children, children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;
			if (typeof abstractNodes === "string") return htmlEscape(abstractNodes);
			else return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(""), "</").concat(tag, ">");
		}
		function iconFromMapping(mapping, prefix, iconName) {
			if (mapping && mapping[prefix] && mapping[prefix][iconName]) return {
				prefix,
				iconName,
				icon: mapping[prefix][iconName]
			};
		}
		/**
		* Internal helper to bind a function known to have 4 arguments
		* to a given context.
		*/
		var bindInternal4 = function bindInternal4(func, thisContext) {
			return function(a, b, c, d) {
				return func.call(thisContext, a, b, c, d);
			};
		};
		/**
		* # Reduce
		*
		* A fast object `.reduce()` implementation.
		*
		* @param  {Object}   subject      The object to reduce over.
		* @param  {Function} fn           The reducer function.
		* @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
		* @param  {Object}   thisContext  The context for the reducer.
		* @return {mixed}                 The final result.
		*/
		var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
			var keys = Object.keys(subject), length = keys.length, iterator = thisContext !== void 0 ? bindInternal4(fn, thisContext) : fn, i, key, result;
			if (initialValue === void 0) {
				i = 1;
				result = subject[keys[0]];
			} else {
				i = 0;
				result = initialValue;
			}
			for (; i < length; i++) {
				key = keys[i];
				result = iterator(result, subject[key], key, subject);
			}
			return result;
		};
		/**
		* Return hexadecimal string for a unicode character
		* Returns `null` when more than one character (not bytes!) are passed
		* For example: 'K' → '7B'
		*/
		function toHex(unicode) {
			if (_toConsumableArray(unicode).length !== 1) return null;
			return unicode.codePointAt(0).toString(16);
		}
		function normalizeIcons(icons) {
			return Object.keys(icons).reduce(function(acc, iconName) {
				var icon = icons[iconName];
				if (!!icon.icon) acc[icon.iconName] = icon.icon;
				else acc[iconName] = icon;
				return acc;
			}, {});
		}
		function defineIcons(prefix, icons) {
			var _params$skipHooks = (arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}).skipHooks, skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
			var normalized = normalizeIcons(icons);
			if (typeof namespace.hooks.addPack === "function" && !skipHooks) namespace.hooks.addPack(prefix, normalizeIcons(icons));
			else namespace.styles[prefix] = _objectSpread2(_objectSpread2({}, namespace.styles[prefix] || {}), normalized);
			/**
			* Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
			* of new styles we needed to differentiate between them. Prefix `fa` is now an alias
			* for `fas` so we'll ease the upgrade process for our users by automatically defining
			* this as well.
			*/
			if (prefix === "fas") defineIcons("fa", icons);
		}
		var styles = namespace.styles;
		var shims = namespace.shims;
		var FAMILY_NAMES = Object.keys(PREFIX_TO_LONG_STYLE);
		var PREFIXES_FOR_FAMILY = FAMILY_NAMES.reduce(function(acc, familyId) {
			acc[familyId] = Object.keys(PREFIX_TO_LONG_STYLE[familyId]);
			return acc;
		}, {});
		var _defaultUsablePrefix = null;
		var _byUnicode = {};
		var _byLigature = {};
		var _byOldName = {};
		var _byOldUnicode = {};
		var _byAlias = {};
		function isReserved(name) {
			return ~RESERVED_CLASSES.indexOf(name);
		}
		function getIconName(cssPrefix, cls) {
			var parts = cls.split("-");
			var prefix = parts[0];
			var iconName = parts.slice(1).join("-");
			if (prefix === cssPrefix && iconName !== "" && !isReserved(iconName)) return iconName;
			else return null;
		}
		var build = function build() {
			var lookup = function lookup(reducer) {
				return reduce(styles, function(o$$1, style, prefix) {
					o$$1[prefix] = reduce(style, reducer, {});
					return o$$1;
				}, {});
			};
			_byUnicode = lookup(function(acc, icon, iconName) {
				if (icon[3]) acc[icon[3]] = iconName;
				if (icon[2]) icon[2].filter(function(a$$1) {
					return typeof a$$1 === "number";
				}).forEach(function(alias) {
					acc[alias.toString(16)] = iconName;
				});
				return acc;
			});
			_byLigature = lookup(function(acc, icon, iconName) {
				acc[iconName] = iconName;
				if (icon[2]) icon[2].filter(function(a$$1) {
					return typeof a$$1 === "string";
				}).forEach(function(alias) {
					acc[alias] = iconName;
				});
				return acc;
			});
			_byAlias = lookup(function(acc, icon, iconName) {
				var aliases = icon[2];
				acc[iconName] = iconName;
				aliases.forEach(function(alias) {
					acc[alias] = iconName;
				});
				return acc;
			});
			var hasRegular = "far" in styles || config.autoFetchSvg;
			var shimLookups = reduce(shims, function(acc, shim) {
				var maybeNameMaybeUnicode = shim[0];
				var prefix = shim[1];
				var iconName = shim[2];
				if (prefix === "far" && !hasRegular) prefix = "fas";
				if (typeof maybeNameMaybeUnicode === "string") acc.names[maybeNameMaybeUnicode] = {
					prefix,
					iconName
				};
				if (typeof maybeNameMaybeUnicode === "number") acc.unicodes[maybeNameMaybeUnicode.toString(16)] = {
					prefix,
					iconName
				};
				return acc;
			}, {
				names: {},
				unicodes: {}
			});
			_byOldName = shimLookups.names;
			_byOldUnicode = shimLookups.unicodes;
			_defaultUsablePrefix = getCanonicalPrefix(config.styleDefault, { family: config.familyDefault });
		};
		onChange(function(c$$1) {
			_defaultUsablePrefix = getCanonicalPrefix(c$$1.styleDefault, { family: config.familyDefault });
		});
		build();
		function byUnicode(prefix, unicode) {
			return (_byUnicode[prefix] || {})[unicode];
		}
		function byLigature(prefix, ligature) {
			return (_byLigature[prefix] || {})[ligature];
		}
		function byAlias(prefix, alias) {
			return (_byAlias[prefix] || {})[alias];
		}
		function byOldName(name) {
			return _byOldName[name] || {
				prefix: null,
				iconName: null
			};
		}
		function byOldUnicode(unicode) {
			var oldUnicode = _byOldUnicode[unicode];
			var newUnicode = byUnicode("fas", unicode);
			return oldUnicode || (newUnicode ? {
				prefix: "fas",
				iconName: newUnicode
			} : null) || {
				prefix: null,
				iconName: null
			};
		}
		function getDefaultUsablePrefix() {
			return _defaultUsablePrefix;
		}
		var emptyCanonicalIcon = function emptyCanonicalIcon() {
			return {
				prefix: null,
				iconName: null,
				rest: []
			};
		};
		function getFamilyId(values) {
			var family = u;
			var famProps = FAMILY_NAMES.reduce(function(acc, familyId) {
				acc[familyId] = "".concat(config.cssPrefix, "-").concat(familyId);
				return acc;
			}, {});
			xl.forEach(function(familyId) {
				if (values.includes(famProps[familyId]) || values.some(function(v$$1) {
					return PREFIXES_FOR_FAMILY[familyId].includes(v$$1);
				})) family = familyId;
			});
			return family;
		}
		function getCanonicalPrefix(styleOrPrefix) {
			var _params$family = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}).family, family = _params$family === void 0 ? u : _params$family;
			var style = PREFIX_TO_STYLE[family][styleOrPrefix];
			if (family === l && !styleOrPrefix) return "fad";
			var prefix = STYLE_TO_PREFIX[family][styleOrPrefix] || STYLE_TO_PREFIX[family][style];
			var defined = styleOrPrefix in namespace.styles ? styleOrPrefix : null;
			return prefix || defined || null;
		}
		function moveNonFaClassesToRest(classNames) {
			var rest = [];
			var iconName = null;
			classNames.forEach(function(cls) {
				var result = getIconName(config.cssPrefix, cls);
				if (result) iconName = result;
				else if (cls) rest.push(cls);
			});
			return {
				iconName,
				rest
			};
		}
		function sortedUniqueValues(arr) {
			return arr.sort().filter(function(value, index, arr) {
				return arr.indexOf(value) === index;
			});
		}
		var _faCombinedClasses = ha.concat(at);
		function getCanonicalIcon(values) {
			var _params$skipLookups = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}).skipLookups, skipLookups = _params$skipLookups === void 0 ? false : _params$skipLookups;
			var givenPrefix = null;
			var faStyleOrFamilyClasses = sortedUniqueValues(values.filter(function(cls) {
				return _faCombinedClasses.includes(cls);
			}));
			var nonStyleOrFamilyClasses = sortedUniqueValues(values.filter(function(cls) {
				return !_faCombinedClasses.includes(cls);
			}));
			var _faStyles$ = _slicedToArray(faStyleOrFamilyClasses.filter(function(cls) {
				givenPrefix = cls;
				return !dl.includes(cls);
			}), 1)[0], styleFromValues = _faStyles$ === void 0 ? null : _faStyles$;
			var family = getFamilyId(faStyleOrFamilyClasses);
			var canonical = _objectSpread2(_objectSpread2({}, moveNonFaClassesToRest(nonStyleOrFamilyClasses)), {}, { prefix: getCanonicalPrefix(styleFromValues, { family }) });
			return _objectSpread2(_objectSpread2(_objectSpread2({}, canonical), getDefaultCanonicalPrefix({
				values,
				family,
				styles,
				config,
				canonical,
				givenPrefix
			})), applyShimAndAlias(skipLookups, givenPrefix, canonical));
		}
		function applyShimAndAlias(skipLookups, givenPrefix, canonical) {
			var prefix = canonical.prefix, iconName = canonical.iconName;
			if (skipLookups || !prefix || !iconName) return {
				prefix,
				iconName
			};
			var shim = givenPrefix === "fa" ? byOldName(iconName) : {};
			var aliasIconName = byAlias(prefix, iconName);
			iconName = shim.iconName || aliasIconName || iconName;
			prefix = shim.prefix || prefix;
			if (prefix === "far" && !styles["far"] && styles["fas"] && !config.autoFetchSvg) prefix = "fas";
			return {
				prefix,
				iconName
			};
		}
		var newCanonicalFamilies = xl.filter(function(familyId) {
			return familyId !== u || familyId !== l;
		});
		var newCanonicalStyles = Object.keys(da).filter(function(key) {
			return key !== u;
		}).map(function(key) {
			return Object.keys(da[key]);
		}).flat();
		function getDefaultCanonicalPrefix(prefixOptions) {
			var values = prefixOptions.values, family = prefixOptions.family, canonical = prefixOptions.canonical, _prefixOptions$givenP = prefixOptions.givenPrefix, givenPrefix = _prefixOptions$givenP === void 0 ? "" : _prefixOptions$givenP, _prefixOptions$styles = prefixOptions.styles, styles = _prefixOptions$styles === void 0 ? {} : _prefixOptions$styles, _prefixOptions$config = prefixOptions.config, config$$1 = _prefixOptions$config === void 0 ? {} : _prefixOptions$config;
			var isDuotoneFamily = family === l;
			var valuesHasDuotone = values.includes("fa-duotone") || values.includes("fad");
			var defaultFamilyIsDuotone = config$$1.familyDefault === "duotone";
			var canonicalPrefixIsDuotone = canonical.prefix === "fad" || canonical.prefix === "fa-duotone";
			if (!isDuotoneFamily && (valuesHasDuotone || defaultFamilyIsDuotone || canonicalPrefixIsDuotone)) canonical.prefix = "fad";
			if (values.includes("fa-brands") || values.includes("fab")) canonical.prefix = "fab";
			if (!canonical.prefix && newCanonicalFamilies.includes(family)) {
				if (Object.keys(styles).find(function(key) {
					return newCanonicalStyles.includes(key);
				}) || config$$1.autoFetchSvg) {
					canonical.prefix = Ql.get(family).defaultShortPrefixId;
					canonical.iconName = byAlias(canonical.prefix, canonical.iconName) || canonical.iconName;
				}
			}
			if (canonical.prefix === "fa" || givenPrefix === "fa") canonical.prefix = getDefaultUsablePrefix() || "fas";
			return canonical;
		}
		var Library = /*#__PURE__*/ function() {
			function Library() {
				_classCallCheck(this, Library);
				this.definitions = {};
			}
			return _createClass(Library, [
				{
					key: "add",
					value: function add() {
						var _this = this;
						for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) definitions[_key] = arguments[_key];
						var additions = definitions.reduce(this._pullDefinitions, {});
						Object.keys(additions).forEach(function(key) {
							_this.definitions[key] = _objectSpread2(_objectSpread2({}, _this.definitions[key] || {}), additions[key]);
							defineIcons(key, additions[key]);
							var longPrefix = PREFIX_TO_LONG_STYLE[u][key];
							if (longPrefix) defineIcons(longPrefix, additions[key]);
							build();
						});
					}
				},
				{
					key: "reset",
					value: function reset() {
						this.definitions = {};
					}
				},
				{
					key: "_pullDefinitions",
					value: function _pullDefinitions(additions, definition) {
						var normalized = definition.prefix && definition.iconName && definition.icon ? { 0: definition } : definition;
						Object.keys(normalized).map(function(key) {
							var _normalized$key = normalized[key], prefix = _normalized$key.prefix, iconName = _normalized$key.iconName, icon = _normalized$key.icon;
							var aliases = icon[2];
							if (!additions[prefix]) additions[prefix] = {};
							if (aliases.length > 0) aliases.forEach(function(alias) {
								if (typeof alias === "string") additions[prefix][alias] = icon;
							});
							additions[prefix][iconName] = icon;
						});
						return additions;
					}
				}
			]);
		}();
		var _plugins = [];
		var _hooks = {};
		var providers = {};
		var defaultProviderKeys = Object.keys(providers);
		function registerPlugins(nextPlugins, _ref) {
			var obj = _ref.mixoutsTo;
			_plugins = nextPlugins;
			_hooks = {};
			Object.keys(providers).forEach(function(k) {
				if (defaultProviderKeys.indexOf(k) === -1) delete providers[k];
			});
			_plugins.forEach(function(plugin) {
				var mixout = plugin.mixout ? plugin.mixout() : {};
				Object.keys(mixout).forEach(function(tk) {
					if (typeof mixout[tk] === "function") obj[tk] = mixout[tk];
					if (_typeof(mixout[tk]) === "object") Object.keys(mixout[tk]).forEach(function(sk) {
						if (!obj[tk]) obj[tk] = {};
						obj[tk][sk] = mixout[tk][sk];
					});
				});
				if (plugin.hooks) {
					var hooks = plugin.hooks();
					Object.keys(hooks).forEach(function(hook) {
						if (!_hooks[hook]) _hooks[hook] = [];
						_hooks[hook].push(hooks[hook]);
					});
				}
				if (plugin.provides) plugin.provides(providers);
			});
			return obj;
		}
		function chainHooks(hook, accumulator) {
			for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
			(_hooks[hook] || []).forEach(function(hookFn) {
				accumulator = hookFn.apply(null, [accumulator].concat(args));
			});
			return accumulator;
		}
		function callHooks(hook) {
			for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
			(_hooks[hook] || []).forEach(function(hookFn) {
				hookFn.apply(null, args);
			});
		}
		function callProvided() {
			var hook = arguments[0];
			var args = Array.prototype.slice.call(arguments, 1);
			return providers[hook] ? providers[hook].apply(null, args) : void 0;
		}
		function findIconDefinition(iconLookup) {
			if (iconLookup.prefix === "fa") iconLookup.prefix = "fas";
			var iconName = iconLookup.iconName;
			var prefix = iconLookup.prefix || getDefaultUsablePrefix();
			if (!iconName) return;
			iconName = byAlias(prefix, iconName) || iconName;
			return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
		}
		var library = new Library();
		var api = {
			noAuto: function noAuto() {
				config.autoReplaceSvg = false;
				config.observeMutations = false;
				callHooks("noAuto");
			},
			config,
			dom: {
				i2svg: function i2svg() {
					var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
					if (IS_DOM) {
						callHooks("beforeI2svg", params);
						callProvided("pseudoElements2svg", params);
						return callProvided("i2svg", params);
					} else return Promise.reject(/* @__PURE__ */ new Error("Operation requires a DOM of some kind."));
				},
				watch: function watch() {
					var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
					var autoReplaceSvgRoot = params.autoReplaceSvgRoot;
					if (config.autoReplaceSvg === false) config.autoReplaceSvg = true;
					config.observeMutations = true;
					domready(function() {
						autoReplace({ autoReplaceSvgRoot });
						callHooks("watch", params);
					});
				}
			},
			parse: { icon: function icon(_icon) {
				if (_icon === null) return null;
				if (_typeof(_icon) === "object" && _icon.prefix && _icon.iconName) return {
					prefix: _icon.prefix,
					iconName: byAlias(_icon.prefix, _icon.iconName) || _icon.iconName
				};
				if (Array.isArray(_icon) && _icon.length === 2) {
					var iconName = _icon[1].indexOf("fa-") === 0 ? _icon[1].slice(3) : _icon[1];
					var prefix = getCanonicalPrefix(_icon[0]);
					return {
						prefix,
						iconName: byAlias(prefix, iconName) || iconName
					};
				}
				if (typeof _icon === "string" && (_icon.indexOf("".concat(config.cssPrefix, "-")) > -1 || _icon.match(ICON_SELECTION_SYNTAX_PATTERN))) {
					var canonicalIcon = getCanonicalIcon(_icon.split(" "), { skipLookups: true });
					return {
						prefix: canonicalIcon.prefix || getDefaultUsablePrefix(),
						iconName: byAlias(canonicalIcon.prefix, canonicalIcon.iconName) || canonicalIcon.iconName
					};
				}
				if (typeof _icon === "string") {
					var _prefix = getDefaultUsablePrefix();
					return {
						prefix: _prefix,
						iconName: byAlias(_prefix, _icon) || _icon
					};
				}
			} },
			library,
			findIconDefinition,
			toHtml
		};
		var autoReplace = function autoReplace() {
			var _params$autoReplaceSv = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}).autoReplaceSvgRoot, autoReplaceSvgRoot = _params$autoReplaceSv === void 0 ? DOCUMENT : _params$autoReplaceSv;
			if ((Object.keys(namespace.styles).length > 0 || config.autoFetchSvg) && IS_DOM && config.autoReplaceSvg) api.dom.i2svg({ node: autoReplaceSvgRoot });
		};
		function domVariants(val, abstractCreator) {
			Object.defineProperty(val, "abstract", { get: abstractCreator });
			Object.defineProperty(val, "html", { get: function get() {
				return val.abstract.map(function(a) {
					return toHtml(a);
				});
			} });
			Object.defineProperty(val, "node", { get: function get() {
				if (!IS_DOM) return void 0;
				var container = DOCUMENT.createElement("div");
				container.innerHTML = val.html;
				return container.children;
			} });
			return val;
		}
		function asIcon(_ref) {
			var children = _ref.children, main = _ref.main, mask = _ref.mask, attributes = _ref.attributes, styles = _ref.styles, transform = _ref.transform;
			if (transformIsMeaningful(transform) && main.found && !mask.found) {
				var offset = {
					x: main.width / main.height / 2,
					y: .5
				};
				attributes["style"] = joinStyles(_objectSpread2(_objectSpread2({}, styles), {}, { "transform-origin": "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em") }));
			}
			return [{
				tag: "svg",
				attributes,
				children
			}];
		}
		function asSymbol(_ref) {
			var prefix = _ref.prefix, iconName = _ref.iconName, children = _ref.children, attributes = _ref.attributes, symbol = _ref.symbol;
			var id = symbol === true ? "".concat(prefix, "-").concat(config.cssPrefix, "-").concat(iconName) : symbol;
			return [{
				tag: "svg",
				attributes: { style: "display: none;" },
				children: [{
					tag: "symbol",
					attributes: _objectSpread2(_objectSpread2({}, attributes), {}, { id }),
					children
				}]
			}];
		}
		function isLabeled(attributes) {
			return [
				"aria-label",
				"aria-labelledby",
				"title",
				"role"
			].some(function(label) {
				return label in attributes;
			});
		}
		function makeInlineSvgAbstract(params) {
			var _params$icons = params.icons, main = _params$icons.main, mask = _params$icons.mask, prefix = params.prefix, iconName = params.iconName, transform = params.transform, symbol = params.symbol, maskId = params.maskId, extra = params.extra, _params$watchable = params.watchable, watchable = _params$watchable === void 0 ? false : _params$watchable;
			var _ref = mask.found ? mask : main, width = _ref.width, height = _ref.height;
			var attrClass = [config.replacementClass, iconName ? "".concat(config.cssPrefix, "-").concat(iconName) : ""].filter(function(c) {
				return extra.classes.indexOf(c) === -1;
			}).filter(function(c) {
				return c !== "" || !!c;
			}).concat(extra.classes).join(" ");
			var content = {
				children: [],
				attributes: _objectSpread2(_objectSpread2({}, extra.attributes), {}, {
					"data-prefix": prefix,
					"data-icon": iconName,
					"class": attrClass,
					"role": extra.attributes.role || "img",
					"viewBox": "0 0 ".concat(width, " ").concat(height)
				})
			};
			if (!isLabeled(extra.attributes) && !extra.attributes["aria-hidden"]) content.attributes["aria-hidden"] = "true";
			if (watchable) content.attributes[DATA_FA_I2SVG] = "";
			var args = _objectSpread2(_objectSpread2({}, content), {}, {
				prefix,
				iconName,
				main,
				mask,
				maskId,
				transform,
				symbol,
				styles: _objectSpread2({}, extra.styles)
			});
			var _ref2 = mask.found && main.found ? callProvided("generateAbstractMask", args) || {
				children: [],
				attributes: {}
			} : callProvided("generateAbstractIcon", args) || {
				children: [],
				attributes: {}
			}, children = _ref2.children, attributes = _ref2.attributes;
			args.children = children;
			args.attributes = attributes;
			if (symbol) return asSymbol(args);
			else return asIcon(args);
		}
		function makeLayersTextAbstract(params) {
			var content = params.content, width = params.width, height = params.height, transform = params.transform, extra = params.extra, _params$watchable2 = params.watchable, watchable = _params$watchable2 === void 0 ? false : _params$watchable2;
			var attributes = _objectSpread2(_objectSpread2({}, extra.attributes), {}, { class: extra.classes.join(" ") });
			if (watchable) attributes[DATA_FA_I2SVG] = "";
			var styles = _objectSpread2({}, extra.styles);
			if (transformIsMeaningful(transform)) {
				styles["transform"] = transformForCss({
					transform,
					startCentered: true,
					width,
					height
				});
				styles["-webkit-transform"] = styles["transform"];
			}
			var styleString = joinStyles(styles);
			if (styleString.length > 0) attributes["style"] = styleString;
			var val = [];
			val.push({
				tag: "span",
				attributes,
				children: [content]
			});
			return val;
		}
		function makeLayersCounterAbstract(params) {
			var content = params.content, extra = params.extra;
			var attributes = _objectSpread2(_objectSpread2({}, extra.attributes), {}, { class: extra.classes.join(" ") });
			var styleString = joinStyles(extra.styles);
			if (styleString.length > 0) attributes["style"] = styleString;
			var val = [];
			val.push({
				tag: "span",
				attributes,
				children: [content]
			});
			return val;
		}
		var styles$1 = namespace.styles;
		function asFoundIcon(icon) {
			var width = icon[0];
			var height = icon[1];
			var vectorData = _slicedToArray(icon.slice(4), 1)[0];
			var element = null;
			if (Array.isArray(vectorData)) element = {
				tag: "g",
				attributes: { class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.GROUP) },
				children: [{
					tag: "path",
					attributes: {
						class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
						fill: "currentColor",
						d: vectorData[0]
					}
				}, {
					tag: "path",
					attributes: {
						class: "".concat(config.cssPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
						fill: "currentColor",
						d: vectorData[1]
					}
				}]
			};
			else element = {
				tag: "path",
				attributes: {
					fill: "currentColor",
					d: vectorData
				}
			};
			return {
				found: true,
				width,
				height,
				icon: element
			};
		}
		var missingIconResolutionMixin = {
			found: false,
			width: 512,
			height: 512
		};
		function maybeNotifyMissing(iconName, prefix) {
			if (!PRODUCTION && !config.showMissingIcons && iconName) console.error("Icon with name \"".concat(iconName, "\" and prefix \"").concat(prefix, "\" is missing."));
		}
		function findIcon(iconName, prefix) {
			var givenPrefix = prefix;
			if (prefix === "fa" && config.styleDefault !== null) prefix = getDefaultUsablePrefix();
			return new Promise(function(resolve, reject) {
				if (givenPrefix === "fa") {
					var shim = byOldName(iconName) || {};
					iconName = shim.iconName || iconName;
					prefix = shim.prefix || prefix;
				}
				if (iconName && prefix && styles$1[prefix] && styles$1[prefix][iconName]) {
					var icon = styles$1[prefix][iconName];
					return resolve(asFoundIcon(icon));
				}
				maybeNotifyMissing(iconName, prefix);
				resolve(_objectSpread2(_objectSpread2({}, missingIconResolutionMixin), {}, { icon: config.showMissingIcons && iconName ? callProvided("missingIconAbstract") || {} : {} }));
			});
		}
		var noop$1 = function noop() {};
		var p$2 = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
			mark: noop$1,
			measure: noop$1
		};
		var preamble = "FA \"7.3.1\"";
		var begin = function begin(name) {
			p$2.mark("".concat(preamble, " ").concat(name, " begins"));
			return function() {
				return end(name);
			};
		};
		var end = function end(name) {
			p$2.mark("".concat(preamble, " ").concat(name, " ends"));
			p$2.measure("".concat(preamble, " ").concat(name), "".concat(preamble, " ").concat(name, " begins"), "".concat(preamble, " ").concat(name, " ends"));
		};
		var perf = {
			begin,
			end
		};
		var noop$2 = function noop() {};
		function isWatched(node) {
			return typeof (node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null) === "string";
		}
		function hasPrefixAndIcon(node) {
			var prefix = node.getAttribute ? node.getAttribute(DATA_PREFIX) : null;
			var icon = node.getAttribute ? node.getAttribute(DATA_ICON) : null;
			return prefix && icon;
		}
		function hasBeenReplaced(node) {
			return node && node.classList && node.classList.contains && node.classList.contains(config.replacementClass);
		}
		function getMutator() {
			if (config.autoReplaceSvg === true) return mutators.replace;
			return mutators[config.autoReplaceSvg] || mutators.replace;
		}
		function createElementNS(tag) {
			return DOCUMENT.createElementNS("http://www.w3.org/2000/svg", tag);
		}
		function createElement(tag) {
			return DOCUMENT.createElement(tag);
		}
		function convertSVG(abstractObj) {
			var _params$ceFn = (arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}).ceFn, ceFn = _params$ceFn === void 0 ? abstractObj.tag === "svg" ? createElementNS : createElement : _params$ceFn;
			if (typeof abstractObj === "string") return DOCUMENT.createTextNode(abstractObj);
			var tag = ceFn(abstractObj.tag);
			Object.keys(abstractObj.attributes || []).forEach(function(key) {
				tag.setAttribute(key, abstractObj.attributes[key]);
			});
			(abstractObj.children || []).forEach(function(child) {
				tag.appendChild(convertSVG(child, { ceFn }));
			});
			return tag;
		}
		function nodeAsComment(node) {
			var comment = " ".concat(node.outerHTML, " ");
			comment = "".concat(comment, "Font Awesome fontawesome.com ");
			return comment;
		}
		var mutators = {
			replace: function replace(mutation) {
				var node = mutation[0];
				if (node.parentNode) {
					mutation[1].forEach(function(abstract) {
						node.parentNode.insertBefore(convertSVG(abstract), node);
					});
					if (node.getAttribute(DATA_FA_I2SVG) === null && config.keepOriginalSource) {
						var comment = DOCUMENT.createComment(nodeAsComment(node));
						node.parentNode.replaceChild(comment, node);
					} else node.remove();
				}
			},
			nest: function nest(mutation) {
				var node = mutation[0];
				var abstract = mutation[1];
				if (~classArray(node).indexOf(config.replacementClass)) return mutators.replace(mutation);
				var forSvg = new RegExp("".concat(config.cssPrefix, "-.*"));
				delete abstract[0].attributes.id;
				if (abstract[0].attributes.class) {
					var splitClasses = abstract[0].attributes.class.split(" ").reduce(function(acc, cls) {
						if (cls === config.replacementClass || cls.match(forSvg)) acc.toSvg.push(cls);
						else acc.toNode.push(cls);
						return acc;
					}, {
						toNode: [],
						toSvg: []
					});
					abstract[0].attributes.class = splitClasses.toSvg.join(" ");
					if (splitClasses.toNode.length === 0) node.removeAttribute("class");
					else node.setAttribute("class", splitClasses.toNode.join(" "));
				}
				var newInnerHTML = abstract.map(function(a) {
					return toHtml(a);
				}).join("\n");
				node.setAttribute(DATA_FA_I2SVG, "");
				node.innerHTML = newInnerHTML;
			}
		};
		function performOperationSync(op) {
			op();
		}
		function perform(mutations, callback) {
			var callbackFunction = typeof callback === "function" ? callback : noop$2;
			if (mutations.length === 0) callbackFunction();
			else {
				var frame = performOperationSync;
				if (config.mutateApproach === MUTATION_APPROACH_ASYNC) frame = WINDOW.requestAnimationFrame || performOperationSync;
				frame(function() {
					var mutator = getMutator();
					var mark = perf.begin("mutate");
					mutations.map(mutator);
					mark();
					callbackFunction();
				});
			}
		}
		var disabled = false;
		function disableObservation() {
			disabled = true;
		}
		function enableObservation() {
			disabled = false;
		}
		var mo = null;
		function observe(options) {
			if (!MUTATION_OBSERVER) return;
			if (!config.observeMutations) return;
			var _options$treeCallback = options.treeCallback, treeCallback = _options$treeCallback === void 0 ? noop$2 : _options$treeCallback, _options$nodeCallback = options.nodeCallback, nodeCallback = _options$nodeCallback === void 0 ? noop$2 : _options$nodeCallback, _options$pseudoElemen = options.pseudoElementsCallback, pseudoElementsCallback = _options$pseudoElemen === void 0 ? noop$2 : _options$pseudoElemen, _options$observeMutat = options.observeMutationsRoot, observeMutationsRoot = _options$observeMutat === void 0 ? DOCUMENT : _options$observeMutat;
			mo = new MUTATION_OBSERVER(function(objects) {
				if (disabled) return;
				var defaultPrefix = getDefaultUsablePrefix();
				toArray(objects).forEach(function(mutationRecord) {
					if (mutationRecord.type === "childList" && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
						if (config.searchPseudoElements) pseudoElementsCallback(mutationRecord.target);
						treeCallback(mutationRecord.target);
					}
					if (mutationRecord.type === "attributes" && mutationRecord.target.parentNode && config.searchPseudoElements) pseudoElementsCallback([mutationRecord.target], true);
					if (mutationRecord.type === "attributes" && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
						if (mutationRecord.attributeName === "class" && hasPrefixAndIcon(mutationRecord.target)) {
							var _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target)), prefix = _getCanonicalIcon.prefix, iconName = _getCanonicalIcon.iconName;
							mutationRecord.target.setAttribute(DATA_PREFIX, prefix || defaultPrefix);
							if (iconName) mutationRecord.target.setAttribute(DATA_ICON, iconName);
						} else if (hasBeenReplaced(mutationRecord.target)) nodeCallback(mutationRecord.target);
					}
				});
			});
			if (!IS_DOM) return;
			mo.observe(observeMutationsRoot, {
				childList: true,
				attributes: true,
				characterData: true,
				subtree: true
			});
		}
		function disconnect() {
			if (!mo) return;
			mo.disconnect();
		}
		function styleParser(node) {
			var style = node.getAttribute("style");
			var val = [];
			if (style) val = style.split(";").reduce(function(acc, style) {
				var styles = style.split(":");
				var prop = styles[0];
				var value = styles.slice(1);
				if (prop && value.length > 0) acc[prop] = value.join(":").trim();
				return acc;
			}, {});
			return val;
		}
		function classParser(node) {
			var existingPrefix = node.getAttribute("data-prefix");
			var existingIconName = node.getAttribute("data-icon");
			var innerText = node.innerText !== void 0 ? node.innerText.trim() : "";
			var val = getCanonicalIcon(classArray(node));
			if (!val.prefix) val.prefix = getDefaultUsablePrefix();
			if (existingPrefix && existingIconName) {
				val.prefix = existingPrefix;
				val.iconName = existingIconName;
			}
			if (val.iconName && val.prefix) return val;
			if (val.prefix && innerText.length > 0) val.iconName = byLigature(val.prefix, node.innerText) || byUnicode(val.prefix, toHex(node.innerText));
			if (!val.iconName && config.autoFetchSvg && node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) val.iconName = node.firstChild.data;
			return val;
		}
		function attributesParser(node) {
			return toArray(node.attributes).reduce(function(acc, attr) {
				if (acc.name !== "class" && acc.name !== "style") acc[attr.name] = attr.value;
				return acc;
			}, {});
		}
		function blankMeta() {
			return {
				iconName: null,
				prefix: null,
				transform: meaninglessTransform,
				symbol: false,
				mask: {
					iconName: null,
					prefix: null,
					rest: []
				},
				maskId: null,
				extra: {
					classes: [],
					styles: {},
					attributes: {}
				}
			};
		}
		function parseMeta(node) {
			var parser = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { styleParser: true };
			var _classParser = classParser(node), iconName = _classParser.iconName, prefix = _classParser.prefix, extraClasses = _classParser.rest;
			var extraAttributes = attributesParser(node);
			var pluginMeta = chainHooks("parseNodeAttributes", {}, node);
			return _objectSpread2({
				iconName,
				prefix,
				transform: meaninglessTransform,
				mask: {
					iconName: null,
					prefix: null,
					rest: []
				},
				maskId: null,
				symbol: false,
				extra: {
					classes: extraClasses,
					styles: parser.styleParser ? styleParser(node) : [],
					attributes: extraAttributes
				}
			}, pluginMeta);
		}
		var styles$2 = namespace.styles;
		function generateMutation(node) {
			var nodeMeta = config.autoReplaceSvg === "nest" ? parseMeta(node, { styleParser: false }) : parseMeta(node);
			if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) return callProvided("generateLayersText", node, nodeMeta);
			else return callProvided("generateSvgReplacementMutation", node, nodeMeta);
		}
		function getKnownPrefixes() {
			return [].concat(_toConsumableArray(at), _toConsumableArray(ha));
		}
		function onTree(root) {
			var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
			if (!IS_DOM) return Promise.resolve();
			var htmlClassList = DOCUMENT.documentElement.classList;
			var hclAdd = function hclAdd(suffix) {
				return htmlClassList.add("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
			};
			var hclRemove = function hclRemove(suffix) {
				return htmlClassList.remove("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
			};
			var prefixes = config.autoFetchSvg ? getKnownPrefixes() : dl.concat(Object.keys(styles$2));
			if (!prefixes.includes("fa")) prefixes.push("fa");
			var prefixesDomQuery = [".".concat(LAYERS_TEXT_CLASSNAME, ":not([").concat(DATA_FA_I2SVG, "])")].concat(prefixes.map(function(p$$1) {
				return ".".concat(p$$1, ":not([").concat(DATA_FA_I2SVG, "])");
			})).join(", ");
			if (prefixesDomQuery.length === 0) return Promise.resolve();
			var candidates = [];
			try {
				candidates = toArray(root.querySelectorAll(prefixesDomQuery));
			} catch (e$$1) {}
			if (candidates.length > 0) {
				hclAdd("pending");
				hclRemove("complete");
			} else return Promise.resolve();
			var mark = perf.begin("onTree");
			var mutations = candidates.reduce(function(acc, node) {
				try {
					var mutation = generateMutation(node);
					if (mutation) acc.push(mutation);
				} catch (e$$1) {
					if (!PRODUCTION) {
						if (e$$1.name === "MissingIcon") console.error(e$$1);
					}
				}
				return acc;
			}, []);
			return new Promise(function(resolve, reject) {
				Promise.all(mutations).then(function(resolvedMutations) {
					perform(resolvedMutations, function() {
						hclAdd("active");
						hclAdd("complete");
						hclRemove("pending");
						if (typeof callback === "function") callback();
						mark();
						resolve();
					});
				}).catch(function(e$$1) {
					mark();
					reject(e$$1);
				});
			});
		}
		function onNode(node) {
			var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
			generateMutation(node).then(function(mutation) {
				if (mutation) perform([mutation], callback);
			});
		}
		function resolveIcons(next) {
			return function(maybeIconDefinition) {
				var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
				var mask = params.mask;
				if (mask) mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
				return next(iconDefinition, _objectSpread2(_objectSpread2({}, params), {}, { mask }));
			};
		}
		var render = function render(iconDefinition) {
			var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
			var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$symbol = params.symbol, symbol = _params$symbol === void 0 ? false : _params$symbol, _params$mask = params.mask, mask = _params$mask === void 0 ? null : _params$mask, _params$maskId = params.maskId, maskId = _params$maskId === void 0 ? null : _params$maskId, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles = _params$styles === void 0 ? {} : _params$styles;
			if (!iconDefinition) return;
			var prefix = iconDefinition.prefix, iconName = iconDefinition.iconName, icon = iconDefinition.icon;
			return domVariants(_objectSpread2({ type: "icon" }, iconDefinition), function() {
				callHooks("beforeDOMElementCreation", {
					iconDefinition,
					params
				});
				return makeInlineSvgAbstract({
					icons: {
						main: asFoundIcon(icon),
						mask: mask ? asFoundIcon(mask.icon) : {
							found: false,
							width: null,
							height: null,
							icon: {}
						}
					},
					prefix,
					iconName,
					transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
					symbol,
					maskId,
					extra: {
						attributes,
						styles,
						classes
					}
				});
			});
		};
		var ReplaceElements = {
			mixout: function mixout() {
				return { icon: resolveIcons(render) };
			},
			hooks: function hooks() {
				return { mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
					accumulator.treeCallback = onTree;
					accumulator.nodeCallback = onNode;
					return accumulator;
				} };
			},
			provides: function provides(providers$$1) {
				providers$$1.i2svg = function(params) {
					var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT : _params$node, _params$callback = params.callback;
					return onTree(node, _params$callback === void 0 ? function() {} : _params$callback);
				};
				providers$$1.generateSvgReplacementMutation = function(node, nodeMeta) {
					var iconName = nodeMeta.iconName, prefix = nodeMeta.prefix, transform = nodeMeta.transform, symbol = nodeMeta.symbol, mask = nodeMeta.mask, maskId = nodeMeta.maskId, extra = nodeMeta.extra;
					return new Promise(function(resolve, reject) {
						Promise.all([findIcon(iconName, prefix), mask.iconName ? findIcon(mask.iconName, mask.prefix) : Promise.resolve({
							found: false,
							width: 512,
							height: 512,
							icon: {}
						})]).then(function(_ref) {
							var _ref2 = _slicedToArray(_ref, 2), main = _ref2[0], mask = _ref2[1];
							resolve([node, makeInlineSvgAbstract({
								icons: {
									main,
									mask
								},
								prefix,
								iconName,
								transform,
								symbol,
								maskId,
								extra,
								watchable: true
							})]);
						}).catch(reject);
					});
				};
				providers$$1.generateAbstractIcon = function(_ref3) {
					var children = _ref3.children, attributes = _ref3.attributes, main = _ref3.main, transform = _ref3.transform, styles = _ref3.styles;
					var styleString = joinStyles(styles);
					if (styleString.length > 0) attributes["style"] = styleString;
					var nextChild;
					if (transformIsMeaningful(transform)) nextChild = callProvided("generateAbstractTransformGrouping", {
						main,
						transform,
						containerWidth: main.width,
						iconWidth: main.width
					});
					children.push(nextChild || main.icon);
					return {
						children,
						attributes
					};
				};
			}
		};
		var Layers = { mixout: function mixout() {
			return { layer: function layer(assembler) {
				var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				var _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes;
				return domVariants({ type: "layer" }, function() {
					callHooks("beforeDOMElementCreation", {
						assembler,
						params
					});
					var children = [];
					assembler(function(args) {
						Array.isArray(args) ? args.map(function(a) {
							children = children.concat(a.abstract);
						}) : children = children.concat(args.abstract);
					});
					return [{
						tag: "span",
						attributes: { class: ["".concat(config.cssPrefix, "-layers")].concat(_toConsumableArray(classes)).join(" ") },
						children
					}];
				});
			} };
		} };
		var LayersCounter = { mixout: function mixout() {
			return { counter: function counter(content) {
				var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				var _params$title = params.title, title = _params$title === void 0 ? null : _params$title, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles = _params$styles === void 0 ? {} : _params$styles;
				return domVariants({
					type: "counter",
					content
				}, function() {
					callHooks("beforeDOMElementCreation", {
						content,
						params
					});
					return makeLayersCounterAbstract({
						content: content.toString(),
						title,
						extra: {
							attributes,
							styles,
							classes: ["".concat(config.cssPrefix, "-layers-counter")].concat(_toConsumableArray(classes))
						}
					});
				});
			} };
		} };
		var LayersText = {
			mixout: function mixout() {
				return { text: function text(content) {
					var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
					var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles = _params$styles === void 0 ? {} : _params$styles;
					return domVariants({
						type: "text",
						content
					}, function() {
						callHooks("beforeDOMElementCreation", {
							content,
							params
						});
						return makeLayersTextAbstract({
							content,
							transform: _objectSpread2(_objectSpread2({}, meaninglessTransform), transform),
							extra: {
								attributes,
								styles,
								classes: ["".concat(config.cssPrefix, "-layers-text")].concat(_toConsumableArray(classes))
							}
						});
					});
				} };
			},
			provides: function provides(providers$$1) {
				providers$$1.generateLayersText = function(node, nodeMeta) {
					var transform = nodeMeta.transform, extra = nodeMeta.extra;
					var width = null;
					var height = null;
					if (IS_IE) {
						var computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
						var boundingClientRect = node.getBoundingClientRect();
						width = boundingClientRect.width / computedFontSize;
						height = boundingClientRect.height / computedFontSize;
					}
					return Promise.resolve([node, makeLayersTextAbstract({
						content: node.innerHTML,
						width,
						height,
						transform,
						extra,
						watchable: true
					})]);
				};
			}
		};
		var CLEAN_CONTENT_PATTERN = /* @__PURE__ */ new RegExp("\"", "ug");
		var SECONDARY_UNICODE_RANGE = [1105920, 1112319];
		var _FONT_FAMILY_WEIGHT_TO_PREFIX = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, { FontAwesome: {
			normal: "fas",
			400: "fas"
		} }), zl), wa), ct);
		var FONT_FAMILY_WEIGHT_TO_PREFIX = Object.keys(_FONT_FAMILY_WEIGHT_TO_PREFIX).reduce(function(acc, key) {
			acc[key.toLowerCase()] = _FONT_FAMILY_WEIGHT_TO_PREFIX[key];
			return acc;
		}, {});
		var FONT_FAMILY_WEIGHT_FALLBACK = Object.keys(FONT_FAMILY_WEIGHT_TO_PREFIX).reduce(function(acc, fontFamily) {
			var weights = FONT_FAMILY_WEIGHT_TO_PREFIX[fontFamily];
			acc[fontFamily] = weights[900] || _toConsumableArray(Object.entries(weights))[0][1];
			return acc;
		}, {});
		function hexValueFromContent(content) {
			return toHex(_toConsumableArray(content.replace(CLEAN_CONTENT_PATTERN, ""))[0] || "");
		}
		function isSecondaryLayer(styles) {
			var hasStylisticSet = styles.getPropertyValue("font-feature-settings").includes("ss01");
			var cleaned = styles.getPropertyValue("content").replace(CLEAN_CONTENT_PATTERN, "");
			var codePoint = cleaned.codePointAt(0);
			var isPrependTen = codePoint >= SECONDARY_UNICODE_RANGE[0] && codePoint <= SECONDARY_UNICODE_RANGE[1];
			var isDoubled = cleaned.length === 2 ? cleaned[0] === cleaned[1] : false;
			return isPrependTen || isDoubled || hasStylisticSet;
		}
		function getPrefix(fontFamily, fontWeight) {
			var fontFamilySanitized = fontFamily.replace(/^['"]|['"]$/g, "").toLowerCase();
			var fontWeightInteger = parseInt(fontWeight);
			var fontWeightSanitized = isNaN(fontWeightInteger) ? "normal" : fontWeightInteger;
			return (FONT_FAMILY_WEIGHT_TO_PREFIX[fontFamilySanitized] || {})[fontWeightSanitized] || FONT_FAMILY_WEIGHT_FALLBACK[fontFamilySanitized];
		}
		function replaceForPosition(node, position) {
			var pendingAttribute = "".concat(DATA_FA_PSEUDO_ELEMENT_PENDING).concat(position.replace(":", "-"));
			return new Promise(function(resolve, reject) {
				if (node.getAttribute(pendingAttribute) !== null) return resolve();
				var alreadyProcessedPseudoElement = toArray(node.children).filter(function(c$$1) {
					return c$$1.getAttribute(DATA_FA_PSEUDO_ELEMENT) === position;
				})[0];
				var styles = WINDOW.getComputedStyle(node, position);
				var fontFamily = styles.getPropertyValue("font-family");
				var fontFamilyMatch = fontFamily.match(FONT_FAMILY_PATTERN);
				var fontWeight = styles.getPropertyValue("font-weight");
				var content = styles.getPropertyValue("content");
				if (alreadyProcessedPseudoElement && !fontFamilyMatch) {
					node.removeChild(alreadyProcessedPseudoElement);
					return resolve();
				} else if (fontFamilyMatch && content !== "none" && content !== "") {
					var _content = styles.getPropertyValue("content");
					var prefix = getPrefix(fontFamily, fontWeight);
					var hexValue = hexValueFromContent(_content);
					var isV4 = fontFamilyMatch[0].startsWith("FontAwesome");
					var isSecondary = isSecondaryLayer(styles);
					var iconName = byUnicode(prefix, hexValue);
					var iconIdentifier = iconName;
					if (isV4) {
						var iconName4 = byOldUnicode(hexValue);
						if (iconName4.iconName && iconName4.prefix) {
							iconName = iconName4.iconName;
							prefix = iconName4.prefix;
						}
					}
					if (iconName && !isSecondary && (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconIdentifier)) {
						node.setAttribute(pendingAttribute, iconIdentifier);
						if (alreadyProcessedPseudoElement) node.removeChild(alreadyProcessedPseudoElement);
						var meta = blankMeta();
						var extra = meta.extra;
						extra.attributes[DATA_FA_PSEUDO_ELEMENT] = position;
						findIcon(iconName, prefix).then(function(main) {
							var abstract = makeInlineSvgAbstract(_objectSpread2(_objectSpread2({}, meta), {}, {
								icons: {
									main,
									mask: emptyCanonicalIcon()
								},
								prefix,
								iconName: iconIdentifier,
								extra,
								watchable: true
							}));
							var element = DOCUMENT.createElementNS("http://www.w3.org/2000/svg", "svg");
							if (position === "::before") node.insertBefore(element, node.firstChild);
							else node.appendChild(element);
							element.outerHTML = abstract.map(function(a$$1) {
								return toHtml(a$$1);
							}).join("\n");
							node.removeAttribute(pendingAttribute);
							resolve();
						}).catch(reject);
					} else resolve();
				} else resolve();
			});
		}
		function replace(node) {
			return Promise.all([replaceForPosition(node, "::before"), replaceForPosition(node, "::after")]);
		}
		function processable(node) {
			return node.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(node.tagName.toUpperCase()) && !node.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!node.parentNode || node.parentNode.tagName !== "svg");
		}
		var hasPseudoElement = function hasPseudoElement(selector) {
			return !!selector && PSEUDO_ELEMENTS.some(function(pseudoSelector) {
				return selector.includes(pseudoSelector);
			});
		};
		var parseCSSRuleForPseudos = function parseCSSRuleForPseudos(selectorText) {
			if (!selectorText) return [];
			var selectorSet = /* @__PURE__ */ new Set();
			var selectors = selectorText.split(/,(?![^()]*\))/).map(function(s$$1) {
				return s$$1.trim();
			});
			selectors = selectors.flatMap(function(selector) {
				return selector.includes("(") ? selector : selector.split(",").map(function(s$$1) {
					return s$$1.trim();
				});
			});
			var _iterator = _createForOfIteratorHelper(selectors), _step;
			try {
				for (_iterator.s(); !(_step = _iterator.n()).done;) {
					var selector = _step.value;
					if (hasPseudoElement(selector)) {
						var selectorWithoutPseudo = PSEUDO_ELEMENTS.reduce(function(acc, pseudoSelector) {
							return acc.replace(pseudoSelector, "");
						}, selector);
						if (selectorWithoutPseudo !== "" && selectorWithoutPseudo !== "*") selectorSet.add(selectorWithoutPseudo);
					}
				}
			} catch (err) {
				_iterator.e(err);
			} finally {
				_iterator.f();
			}
			return selectorSet;
		};
		function searchPseudoElements(root) {
			var useAsNodeList = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
			if (!IS_DOM) return;
			var nodeList;
			if (useAsNodeList) nodeList = root;
			else if (config.searchPseudoElementsFullScan) nodeList = root.querySelectorAll("*");
			else {
				var selectorSet = /* @__PURE__ */ new Set();
				var _iterator2 = _createForOfIteratorHelper(document.styleSheets), _step2;
				try {
					for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
						var stylesheet = _step2.value;
						try {
							var _iterator3 = _createForOfIteratorHelper(stylesheet.cssRules), _step3;
							try {
								for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
									var rule = _step3.value;
									var _iterator4 = _createForOfIteratorHelper(parseCSSRuleForPseudos(rule.selectorText)), _step4;
									try {
										for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
											var selector = _step4.value;
											selectorSet.add(selector);
										}
									} catch (err) {
										_iterator4.e(err);
									} finally {
										_iterator4.f();
									}
								}
							} catch (err) {
								_iterator3.e(err);
							} finally {
								_iterator3.f();
							}
						} catch (e$$1) {
							if (config.searchPseudoElementsWarnings) console.warn("Font Awesome: cannot parse stylesheet: ".concat(stylesheet.href, " (").concat(e$$1.message, ")\nIf it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin=\"anonymous\" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false."));
						}
					}
				} catch (err) {
					_iterator2.e(err);
				} finally {
					_iterator2.f();
				}
				if (!selectorSet.size) return;
				var cleanSelectors = Array.from(selectorSet).join(", ");
				try {
					nodeList = root.querySelectorAll(cleanSelectors);
				} catch (_unused) {}
			}
			return new Promise(function(resolve, reject) {
				var operations = toArray(nodeList).filter(processable).map(replace);
				var end = perf.begin("searchPseudoElements");
				disableObservation();
				Promise.all(operations).then(function() {
					end();
					enableObservation();
					resolve();
				}).catch(function() {
					end();
					enableObservation();
					reject();
				});
			});
		}
		var PseudoElements = {
			hooks: function hooks() {
				return { mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
					accumulator.pseudoElementsCallback = searchPseudoElements;
					return accumulator;
				} };
			},
			provides: function provides(providers) {
				providers.pseudoElements2svg = function(params) {
					var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT : _params$node;
					if (config.searchPseudoElements) searchPseudoElements(node);
				};
			}
		};
		var _unwatched = false;
		var MutationObserver$1 = {
			mixout: function mixout() {
				return { dom: { unwatch: function unwatch() {
					disableObservation();
					_unwatched = true;
				} } };
			},
			hooks: function hooks() {
				return {
					bootstrap: function bootstrap() {
						observe(chainHooks("mutationObserverCallbacks", {}));
					},
					noAuto: function noAuto() {
						disconnect();
					},
					watch: function watch(params) {
						var observeMutationsRoot = params.observeMutationsRoot;
						if (_unwatched) enableObservation();
						else observe(chainHooks("mutationObserverCallbacks", { observeMutationsRoot }));
					}
				};
			}
		};
		var parseTransformString = function parseTransformString(transformString) {
			return transformString.toLowerCase().split(" ").reduce(function(acc, n) {
				var parts = n.toLowerCase().split("-");
				var first = parts[0];
				var rest = parts.slice(1).join("-");
				if (first && rest === "h") {
					acc.flipX = true;
					return acc;
				}
				if (first && rest === "v") {
					acc.flipY = true;
					return acc;
				}
				rest = parseFloat(rest);
				if (isNaN(rest)) return acc;
				switch (first) {
					case "grow":
						acc.size = acc.size + rest;
						break;
					case "shrink":
						acc.size = acc.size - rest;
						break;
					case "left":
						acc.x = acc.x - rest;
						break;
					case "right":
						acc.x = acc.x + rest;
						break;
					case "up":
						acc.y = acc.y - rest;
						break;
					case "down":
						acc.y = acc.y + rest;
						break;
					case "rotate": acc.rotate = acc.rotate + rest;
				}
				return acc;
			}, {
				size: 16,
				x: 0,
				y: 0,
				flipX: false,
				flipY: false,
				rotate: 0
			});
		};
		var PowerTransforms = {
			mixout: function mixout() {
				return { parse: { transform: function transform(transformString) {
					return parseTransformString(transformString);
				} } };
			},
			hooks: function hooks() {
				return { parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
					var transformString = node.getAttribute("data-fa-transform");
					if (transformString) accumulator.transform = parseTransformString(transformString);
					return accumulator;
				} };
			},
			provides: function provides(providers) {
				providers.generateAbstractTransformGrouping = function(_ref) {
					var main = _ref.main, transform = _ref.transform, containerWidth = _ref.containerWidth, iconWidth = _ref.iconWidth;
					var outer = { transform: "translate(".concat(containerWidth / 2, " 256)") };
					var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
					var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
					var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
					var operations = {
						outer,
						inner: { transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate) },
						path: { transform: "translate(".concat(iconWidth / 2 * -1, " -256)") }
					};
					return {
						tag: "g",
						attributes: _objectSpread2({}, operations.outer),
						children: [{
							tag: "g",
							attributes: _objectSpread2({}, operations.inner),
							children: [{
								tag: main.icon.tag,
								children: main.icon.children,
								attributes: _objectSpread2(_objectSpread2({}, main.icon.attributes), operations.path)
							}]
						}]
					};
				};
			}
		};
		var ALL_SPACE = {
			x: 0,
			y: 0,
			width: "100%",
			height: "100%"
		};
		function fillBlack(abstract) {
			var force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
			if (abstract.attributes && (abstract.attributes.fill || force)) abstract.attributes.fill = "black";
			return abstract;
		}
		function deGroup(abstract) {
			if (abstract.tag === "g") return abstract.children;
			else return [abstract];
		}
		registerPlugins([
			InjectCSS,
			ReplaceElements,
			Layers,
			LayersCounter,
			LayersText,
			PseudoElements,
			MutationObserver$1,
			PowerTransforms,
			{
				hooks: function hooks() {
					return { parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
						var maskData = node.getAttribute("data-fa-mask");
						var mask = !maskData ? emptyCanonicalIcon() : getCanonicalIcon(maskData.split(" ").map(function(i) {
							return i.trim();
						}));
						if (!mask.prefix) mask.prefix = getDefaultUsablePrefix();
						accumulator.mask = mask;
						accumulator.maskId = node.getAttribute("data-fa-mask-id");
						return accumulator;
					} };
				},
				provides: function provides(providers) {
					providers.generateAbstractMask = function(_ref) {
						var children = _ref.children, attributes = _ref.attributes, main = _ref.main, mask = _ref.mask, explicitMaskId = _ref.maskId, transform = _ref.transform;
						var mainWidth = main.width, mainPath = main.icon;
						var maskWidth = mask.width, maskPath = mask.icon;
						var trans = transformForSvg({
							transform,
							containerWidth: maskWidth,
							iconWidth: mainWidth
						});
						var maskRect = {
							tag: "rect",
							attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, { fill: "white" })
						};
						var maskInnerGroupChildrenMixin = mainPath.children ? { children: mainPath.children.map(fillBlack) } : {};
						var maskInnerGroup = {
							tag: "g",
							attributes: _objectSpread2({}, trans.inner),
							children: [fillBlack(_objectSpread2({
								tag: mainPath.tag,
								attributes: _objectSpread2(_objectSpread2({}, mainPath.attributes), trans.path)
							}, maskInnerGroupChildrenMixin))]
						};
						var maskOuterGroup = {
							tag: "g",
							attributes: _objectSpread2({}, trans.outer),
							children: [maskInnerGroup]
						};
						var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
						var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
						var maskTag = {
							tag: "mask",
							attributes: _objectSpread2(_objectSpread2({}, ALL_SPACE), {}, {
								id: maskId,
								maskUnits: "userSpaceOnUse",
								maskContentUnits: "userSpaceOnUse"
							}),
							children: [maskRect, maskOuterGroup]
						};
						var defs = {
							tag: "defs",
							children: [{
								tag: "clipPath",
								attributes: { id: clipId },
								children: deGroup(maskPath)
							}, maskTag]
						};
						children.push(defs, {
							tag: "rect",
							attributes: _objectSpread2({
								"fill": "currentColor",
								"clip-path": "url(#".concat(clipId, ")"),
								"mask": "url(#".concat(maskId, ")")
							}, ALL_SPACE)
						});
						return {
							children,
							attributes
						};
					};
				}
			},
			{ provides: function provides(providers) {
				var reduceMotion = false;
				if (WINDOW.matchMedia) reduceMotion = WINDOW.matchMedia("(prefers-reduced-motion: reduce)").matches;
				providers.missingIconAbstract = function() {
					var gChildren = [];
					var FILL = { fill: "currentColor" };
					var ANIMATION_BASE = {
						attributeType: "XML",
						repeatCount: "indefinite",
						dur: "2s"
					};
					gChildren.push({
						tag: "path",
						attributes: _objectSpread2(_objectSpread2({}, FILL), {}, { d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z" })
					});
					var OPACITY_ANIMATE = _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, { attributeName: "opacity" });
					var dot = {
						tag: "circle",
						attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
							cx: "256",
							cy: "364",
							r: "28"
						}),
						children: []
					};
					if (!reduceMotion) dot.children.push({
						tag: "animate",
						attributes: _objectSpread2(_objectSpread2({}, ANIMATION_BASE), {}, {
							attributeName: "r",
							values: "28;14;28;28;14;28;"
						})
					}, {
						tag: "animate",
						attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, { values: "1;0;1;1;0;1;" })
					});
					gChildren.push(dot);
					gChildren.push({
						tag: "path",
						attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
							opacity: "1",
							d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
						}),
						children: reduceMotion ? [] : [{
							tag: "animate",
							attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, { values: "1;0;0;0;0;1;" })
						}]
					});
					if (!reduceMotion) gChildren.push({
						tag: "path",
						attributes: _objectSpread2(_objectSpread2({}, FILL), {}, {
							opacity: "0",
							d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
						}),
						children: [{
							tag: "animate",
							attributes: _objectSpread2(_objectSpread2({}, OPACITY_ANIMATE), {}, { values: "0;0;1;1;0;0;" })
						}]
					});
					return {
						tag: "g",
						attributes: { class: "missing" },
						children: gChildren
					};
				};
			} },
			{ hooks: function hooks() {
				return { parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
					var symbolData = node.getAttribute("data-fa-symbol");
					accumulator["symbol"] = symbolData === null ? false : symbolData === "" ? true : symbolData;
					return accumulator;
				} };
			} }
		], { mixoutsTo: api });
		api.noAuto;
		var config$1 = api.config;
		api.library;
		api.dom;
		var parse$1 = api.parse;
		api.findIconDefinition;
		api.toHtml;
		var icon = api.icon;
		api.layer;
		api.text;
		api.counter;
		//#endregion
		//#region node_modules/@fortawesome/react-fontawesome/dist/index.js
		function _isNumerical(object) {
			object = object - 0;
			return object === object;
		}
		function camelize(string) {
			if (_isNumerical(string)) return string;
			string = string.replace(/[_-]+(.)?/g, (_, chr) => {
				return chr ? chr.toUpperCase() : "";
			});
			return string.charAt(0).toLowerCase() + string.slice(1);
		}
		var createGradientStops = (stop, index) => react.default.createElement("stop", {
			key: `${index}-${stop.offset}`,
			offset: stop.offset,
			stopColor: stop.color,
			...stop.opacity !== void 0 && { stopOpacity: stop.opacity }
		});
		function capitalize(val) {
			return val.charAt(0).toUpperCase() + val.slice(1);
		}
		var styleCache = /* @__PURE__ */ new Map();
		var STYLE_CACHE_LIMIT = 1e3;
		function styleToObject(style) {
			if (styleCache.has(style)) return styleCache.get(style);
			const result = {};
			let start = 0;
			const len = style.length;
			while (start < len) {
				const semicolonIndex = style.indexOf(";", start);
				const end = semicolonIndex === -1 ? len : semicolonIndex;
				const pair = style.slice(start, end).trim();
				if (pair) {
					const colonIndex = pair.indexOf(":");
					if (colonIndex > 0) {
						const rawProp = pair.slice(0, colonIndex).trim();
						const value = pair.slice(colonIndex + 1).trim();
						if (rawProp && value) {
							const prop = camelize(rawProp);
							result[prop.startsWith("webkit") ? capitalize(prop) : prop] = value;
						}
					}
				}
				start = end + 1;
			}
			if (styleCache.size === STYLE_CACHE_LIMIT) {
				const oldestKey = styleCache.keys().next().value;
				if (oldestKey) styleCache.delete(oldestKey);
			}
			styleCache.set(style, result);
			return result;
		}
		function convert(createElement, element, extraProps = {}) {
			if (typeof element === "string") return element;
			const children = (element.children || []).map((child) => {
				let element2 = child;
				if (("fill" in extraProps || extraProps.gradientFill) && child.tag === "path" && "fill" in child.attributes) element2 = {
					...child,
					attributes: {
						...child.attributes,
						fill: void 0
					}
				};
				return convert(createElement, element2);
			});
			const elementAttributes = element.attributes || {};
			const attrs = {};
			for (const [key, val] of Object.entries(elementAttributes)) switch (true) {
				case key === "class":
					attrs.className = val;
					break;
				case key === "style":
					attrs.style = styleToObject(String(val));
					break;
				case key.startsWith("aria-"):
				case key.startsWith("data-"):
					attrs[key.toLowerCase()] = val;
					break;
				default: attrs[camelize(key)] = val;
			}
			const { style: existingStyle, role: existingRole, "aria-label": ariaLabel, gradientFill, ...remaining } = extraProps;
			if (existingStyle) attrs.style = attrs.style ? {
				...attrs.style,
				...existingStyle
			} : existingStyle;
			if (existingRole) attrs.role = existingRole;
			if (ariaLabel) {
				attrs["aria-label"] = ariaLabel;
				attrs["aria-hidden"] = "false";
			}
			if (gradientFill) {
				attrs.fill = `url(#${gradientFill.id})`;
				const { type: gradientType, stops: gradientStops = [], ...gradientProps } = gradientFill;
				children.unshift(createElement(gradientType === "linear" ? "linearGradient" : "radialGradient", {
					...gradientProps,
					id: gradientFill.id
				}, gradientStops.map(createGradientStops)));
			}
			return createElement(element.tag, {
				...attrs,
				...remaining
			}, ...children);
		}
		var makeReactConverter = convert.bind(null, react.default.createElement);
		var useAccessibilityId = (id, hasAccessibleProps) => {
			const generatedId = (0, react.useId)();
			return id || (hasAccessibleProps ? generatedId : void 0);
		};
		var Logger = class {
			constructor(scope = "react-fontawesome") {
				this.enabled = false;
				let IS_DEV = false;
				try {
					IS_DEV = typeof process !== "undefined" && false;
				} catch {}
				this.scope = scope;
				this.enabled = IS_DEV;
			}
			/**
			* Logs messages to the console if not in production.
			* @param args - The message and/or data to log.
			*/
			log(...args) {
				if (!this.enabled) return;
				console.log(`[${this.scope}]`, ...args);
			}
			/**
			* Logs warnings to the console if not in production.
			* @param args - The warning message and/or data to log.
			*/
			warn(...args) {
				if (!this.enabled) return;
				console.warn(`[${this.scope}]`, ...args);
			}
			/**
			* Logs errors to the console if not in production.
			* @param args - The error message and/or data to log.
			*/
			error(...args) {
				if (!this.enabled) return;
				console.error(`[${this.scope}]`, ...args);
			}
		};
		typeof process !== "undefined" && process.env?.FA_VERSION;
		var SVG_CORE_VERSION = "searchPseudoElementsFullScan" in config$1 && typeof config$1.searchPseudoElementsFullScan === "boolean" ? "7.0.0" : "6.0.0";
		var IS_VERSION_7_OR_LATER = Number.parseInt(SVG_CORE_VERSION) >= 7;
		var getIsVersion7OrLater = () => IS_VERSION_7_OR_LATER;
		var DEFAULT_CLASSNAME_PREFIX = "fa";
		var ANIMATION_CLASSES = {
			beat: "fa-beat",
			fade: "fa-fade",
			beatFade: "fa-beat-fade",
			bounce: "fa-bounce",
			shake: "fa-shake",
			spin: "fa-spin",
			spinPulse: "fa-spin-pulse",
			spinReverse: "fa-spin-reverse",
			pulse: "fa-pulse",
			flip360: "fa-flip-360",
			buzz: "fa-buzz",
			float: "fa-float",
			jello: "fa-jello",
			spinSnap: "fa-spin-snap",
			spinSnap4: "fa-spin-snap-4",
			spinSnap8: "fa-spin-snap-8",
			swing: "fa-swing",
			wag: "fa-wag"
		};
		var PULL_CLASSES = {
			left: "fa-pull-left",
			right: "fa-pull-right"
		};
		var ROTATE_CLASSES = {
			"90": "fa-rotate-90",
			"180": "fa-rotate-180",
			"270": "fa-rotate-270"
		};
		var SIZE_CLASSES = {
			"2xs": "fa-2xs",
			xs: "fa-xs",
			sm: "fa-sm",
			lg: "fa-lg",
			xl: "fa-xl",
			"2xl": "fa-2xl",
			"1x": "fa-1x",
			"2x": "fa-2x",
			"3x": "fa-3x",
			"4x": "fa-4x",
			"5x": "fa-5x",
			"6x": "fa-6x",
			"7x": "fa-7x",
			"8x": "fa-8x",
			"9x": "fa-9x",
			"10x": "fa-10x"
		};
		var STYLE_CLASSES = {
			border: "fa-border",
			/** @deprecated */
			fixedWidth: "fa-fw",
			flip: "fa-flip",
			flipHorizontal: "fa-flip-horizontal",
			flipVertical: "fa-flip-vertical",
			inverse: "fa-inverse",
			rotateBy: "fa-rotate-by",
			swapOpacity: "fa-swap-opacity",
			widthAuto: "fa-width-auto",
			canvasSquare: "fa-canvas-square",
			canvasRoomy: "fa-canvas-roomy"
		};
		var LAYER_CLASSES = { default: "fa-layers" };
		function withPrefix(cls) {
			const prefix = config$1.cssPrefix || config$1.familyPrefix || DEFAULT_CLASSNAME_PREFIX;
			return prefix === DEFAULT_CLASSNAME_PREFIX ? cls : cls.replace(new RegExp(String.raw`(?<=^|\s)${DEFAULT_CLASSNAME_PREFIX}-`, "g"), `${prefix}-`);
		}
		function getClassListFromProps(props) {
			const { beat, fade, beatFade, bounce, shake, spin, spinPulse, spinReverse, pulse, fixedWidth, inverse, border, flip, size, rotation, pull, swapOpacity, rotateBy, widthAuto, canvasSquare, canvasRoomy, flip360, buzz, float, jello, spinSnap, spinSnap4, spinSnap8, swing, wag, className } = props;
			const result = [];
			if (className) result.push(...className.split(" "));
			if (beat) result.push(ANIMATION_CLASSES.beat);
			if (fade) result.push(ANIMATION_CLASSES.fade);
			if (beatFade) result.push(ANIMATION_CLASSES.beatFade);
			if (bounce) result.push(ANIMATION_CLASSES.bounce);
			if (shake) result.push(ANIMATION_CLASSES.shake);
			if (spin) result.push(ANIMATION_CLASSES.spin);
			if (spinReverse) result.push(ANIMATION_CLASSES.spinReverse);
			if (spinPulse) result.push(ANIMATION_CLASSES.spinPulse);
			if (pulse) result.push(ANIMATION_CLASSES.pulse);
			if (fixedWidth) result.push(STYLE_CLASSES.fixedWidth);
			if (inverse) result.push(STYLE_CLASSES.inverse);
			if (border) result.push(STYLE_CLASSES.border);
			if (flip === true) result.push(STYLE_CLASSES.flip);
			if (flip === "horizontal" || flip === "both") result.push(STYLE_CLASSES.flipHorizontal);
			if (flip === "vertical" || flip === "both") result.push(STYLE_CLASSES.flipVertical);
			if (size !== void 0 && size !== null) result.push(SIZE_CLASSES[size]);
			if (rotation !== void 0 && rotation !== null && rotation !== 0) result.push(ROTATE_CLASSES[rotation]);
			if (pull !== void 0 && pull !== null) result.push(PULL_CLASSES[pull]);
			if (swapOpacity) result.push(STYLE_CLASSES.swapOpacity);
			if (!getIsVersion7OrLater()) return result;
			if (rotateBy) result.push(STYLE_CLASSES.rotateBy);
			if (widthAuto) result.push(STYLE_CLASSES.widthAuto);
			if (canvasSquare) result.push(STYLE_CLASSES.canvasSquare);
			if (canvasRoomy) result.push(STYLE_CLASSES.canvasRoomy);
			if (flip360) result.push(ANIMATION_CLASSES.flip360);
			if (buzz) result.push(ANIMATION_CLASSES.buzz);
			if (float) result.push(ANIMATION_CLASSES.float);
			if (jello) result.push(ANIMATION_CLASSES.jello);
			if (spinSnap) result.push(ANIMATION_CLASSES.spinSnap);
			if (spinSnap4) result.push(ANIMATION_CLASSES.spinSnap4);
			if (spinSnap8) result.push(ANIMATION_CLASSES.spinSnap8);
			if (swing) result.push(ANIMATION_CLASSES.swing);
			if (wag) result.push(ANIMATION_CLASSES.wag);
			return (config$1.cssPrefix || config$1.familyPrefix || DEFAULT_CLASSNAME_PREFIX) === DEFAULT_CLASSNAME_PREFIX ? result : result.map(withPrefix);
		}
		var isIconDefinition = (icon) => typeof icon === "object" && "icon" in icon && !!icon.icon;
		function normalizeIconArgs(icon) {
			if (!icon) return;
			if (isIconDefinition(icon)) return icon;
			return parse$1.icon(icon);
		}
		function typedObjectKeys(obj) {
			return Object.keys(obj);
		}
		var logger = new Logger("FontAwesomeIcon");
		var DEFAULT_PROPS = {
			border: false,
			className: "",
			mask: void 0,
			maskId: void 0,
			fixedWidth: false,
			inverse: false,
			flip: false,
			icon: void 0,
			listItem: false,
			pull: void 0,
			pulse: false,
			rotation: void 0,
			rotateBy: false,
			size: void 0,
			spin: false,
			spinPulse: false,
			spinReverse: false,
			beat: false,
			fade: false,
			beatFade: false,
			bounce: false,
			shake: false,
			symbol: false,
			title: "",
			titleId: void 0,
			transform: void 0,
			swapOpacity: false,
			widthAuto: false,
			canvasSquare: false,
			canvasRoomy: false,
			flip360: false,
			buzz: false,
			float: false,
			jello: false,
			spinSnap: false,
			spinSnap4: false,
			spinSnap8: false,
			swing: false,
			wag: false
		};
		var DEFAULT_PROP_KEYS = new Set(Object.keys(DEFAULT_PROPS));
		var FontAwesomeIcon = react.default.forwardRef((props, ref) => {
			const allProps = {
				...DEFAULT_PROPS,
				...props
			};
			const { icon: iconArgs, mask: maskArgs, symbol, title, titleId: titleIdFromProps, maskId: maskIdFromProps, transform } = allProps;
			const maskId = useAccessibilityId(maskIdFromProps, Boolean(maskArgs));
			const titleId = useAccessibilityId(titleIdFromProps, Boolean(title));
			const iconLookup = normalizeIconArgs(iconArgs);
			if (!iconLookup) {
				logger.error("Icon lookup is undefined", iconArgs);
				return null;
			}
			const classList = getClassListFromProps(allProps);
			const transformProps = typeof transform === "string" ? parse$1.transform(transform) : transform;
			const normalizedMaskArgs = normalizeIconArgs(maskArgs);
			const renderedIcon = icon(iconLookup, {
				...classList.length > 0 && { classes: classList },
				...transformProps && { transform: transformProps },
				...normalizedMaskArgs && { mask: normalizedMaskArgs },
				symbol,
				title,
				titleId,
				maskId
			});
			if (!renderedIcon) {
				logger.error("Could not find icon", iconLookup);
				return null;
			}
			const { abstract } = renderedIcon;
			const extraProps = { ref };
			for (const key of typedObjectKeys(allProps)) {
				if (DEFAULT_PROP_KEYS.has(key)) continue;
				extraProps[key] = allProps[key];
			}
			return makeReactConverter(abstract[0], extraProps);
		});
		FontAwesomeIcon.displayName = "FontAwesomeIcon";
		`${LAYER_CLASSES.default}${STYLE_CLASSES.fixedWidth}`;
		//#endregion
		//#region node_modules/@fortawesome/free-solid-svg-icons/faChevronLeft.js
		var require_faChevronLeft = /* @__PURE__ */ __commonJSMin(((exports) => {
			Object.defineProperty(exports, "__esModule", { value: true });
			var prefix = "fas";
			var iconName = "chevron-left";
			var width = 320;
			var height = 512;
			var aliases = [9001];
			var unicode = "f053";
			var svgPathData = "M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z";
			exports.definition = {
				prefix,
				iconName,
				icon: [
					width,
					height,
					aliases,
					unicode,
					svgPathData
				]
			};
			exports.faChevronLeft = exports.definition;
			exports.prefix = prefix;
			exports.iconName = iconName;
			exports.width = width;
			exports.height = height;
			exports.ligatures = aliases;
			exports.unicode = unicode;
			exports.svgPathData = svgPathData;
			exports.aliases = aliases;
		}));
		//#endregion
		//#region node_modules/@fortawesome/free-solid-svg-icons/faArrowUp.js
		var require_faArrowUp = /* @__PURE__ */ __commonJSMin(((exports) => {
			Object.defineProperty(exports, "__esModule", { value: true });
			var prefix = "fas";
			var iconName = "arrow-up";
			var width = 384;
			var height = 512;
			var aliases = [8593];
			var unicode = "f062";
			var svgPathData = "M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-370.7 105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z";
			exports.definition = {
				prefix,
				iconName,
				icon: [
					width,
					height,
					aliases,
					unicode,
					svgPathData
				]
			};
			exports.faArrowUp = exports.definition;
			exports.prefix = prefix;
			exports.iconName = iconName;
			exports.width = width;
			exports.height = height;
			exports.ligatures = aliases;
			exports.unicode = unicode;
			exports.svgPathData = svgPathData;
			exports.aliases = aliases;
		}));
		//#endregion
		//#region node_modules/@fortawesome/free-solid-svg-icons/faFolder.js
		var require_faFolder = /* @__PURE__ */ __commonJSMin(((exports) => {
			Object.defineProperty(exports, "__esModule", { value: true });
			var prefix = "fas";
			var iconName = "folder";
			var width = 512;
			var height = 512;
			var aliases = [
				128193,
				128447,
				61716,
				"folder-blank"
			];
			var unicode = "f07b";
			var svgPathData = "M64 448l384 0c35.3 0 64-28.7 64-64l0-240c0-35.3-28.7-64-64-64L298.7 80c-6.9 0-13.7-2.2-19.2-6.4L241.1 44.8C230 36.5 216.5 32 202.7 32L64 32C28.7 32 0 60.7 0 96L0 384c0 35.3 28.7 64 64 64z";
			exports.definition = {
				prefix,
				iconName,
				icon: [
					width,
					height,
					aliases,
					unicode,
					svgPathData
				]
			};
			exports.faFolder = exports.definition;
			exports.prefix = prefix;
			exports.iconName = iconName;
			exports.width = width;
			exports.height = height;
			exports.ligatures = aliases;
			exports.unicode = unicode;
			exports.svgPathData = svgPathData;
			exports.aliases = aliases;
		}));
		//#endregion
		//#region node_modules/@fortawesome/free-solid-svg-icons/faFile.js
		var require_faFile = /* @__PURE__ */ __commonJSMin(((exports) => {
			Object.defineProperty(exports, "__esModule", { value: true });
			var prefix = "fas";
			var iconName = "file";
			var width = 384;
			var height = 512;
			var aliases = [
				128196,
				128459,
				61462
			];
			var unicode = "f15b";
			var svgPathData = "M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-277.5c0-17-6.7-33.3-18.7-45.3L258.7 18.7C246.7 6.7 230.5 0 213.5 0L64 0zM325.5 176L232 176c-13.3 0-24-10.7-24-24L208 58.5 325.5 176z";
			exports.definition = {
				prefix,
				iconName,
				icon: [
					width,
					height,
					aliases,
					unicode,
					svgPathData
				]
			};
			exports.faFile = exports.definition;
			exports.prefix = prefix;
			exports.iconName = iconName;
			exports.width = width;
			exports.height = height;
			exports.ligatures = aliases;
			exports.unicode = unicode;
			exports.svgPathData = svgPathData;
			exports.aliases = aliases;
		}));
		//#endregion
		//#region node_modules/@fortawesome/free-solid-svg-icons/faMinus.js
		var require_faMinus = /* @__PURE__ */ __commonJSMin(((exports) => {
			Object.defineProperty(exports, "__esModule", { value: true });
			var prefix = "fas";
			var iconName = "minus";
			var width = 448;
			var height = 512;
			var aliases = [
				8211,
				8722,
				10134,
				"subtract"
			];
			var unicode = "f068";
			var svgPathData = "M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z";
			exports.definition = {
				prefix,
				iconName,
				icon: [
					width,
					height,
					aliases,
					unicode,
					svgPathData
				]
			};
			exports.faMinus = exports.definition;
			exports.prefix = prefix;
			exports.iconName = iconName;
			exports.width = width;
			exports.height = height;
			exports.ligatures = aliases;
			exports.unicode = unicode;
			exports.svgPathData = svgPathData;
			exports.aliases = aliases;
		}));
		//#endregion
		//#region node_modules/@fortawesome/free-brands-svg-icons/faMarkdown.js
		var require_faMarkdown = /* @__PURE__ */ __commonJSMin(((exports) => {
			Object.defineProperty(exports, "__esModule", { value: true });
			var prefix = "fab";
			var iconName = "markdown";
			var width = 640;
			var height = 512;
			var aliases = [];
			var unicode = "f60f";
			var svgPathData = "M593.8 59.1l-547.6 0C20.7 59.1 0 79.8 0 105.2L0 406.7c0 25.5 20.7 46.2 46.2 46.2l547.7 0c25.5 0 46.2-20.7 46.1-46.1l0-301.6c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6l-61.5 0 0-120-61.5 76.9-61.5-76.9 0 120-61.7 0 0-209.2 61.5 0 61.5 76.9 61.5-76.9 61.5 0 0 209.2 .2 0zm135.3 3.1l-92.3-107.7 61.5 0 0-104.6 61.5 0 0 104.6 61.5 0-92.2 107.7z";
			exports.definition = {
				prefix,
				iconName,
				icon: [
					width,
					height,
					aliases,
					unicode,
					svgPathData
				]
			};
			exports.faMarkdown = exports.definition;
			exports.prefix = prefix;
			exports.iconName = iconName;
			exports.width = width;
			exports.height = height;
			exports.ligatures = aliases;
			exports.unicode = unicode;
			exports.svgPathData = svgPathData;
			exports.aliases = aliases;
		}));
		//#endregion
		//#region node_modules/@fortawesome/free-brands-svg-icons/faTex.js
		var require_faTex = /* @__PURE__ */ __commonJSMin(((exports) => {
			Object.defineProperty(exports, "__esModule", { value: true });
			var prefix = "fab";
			var iconName = "tex";
			var width = 640;
			var height = 512;
			var aliases = [];
			var unicode = "e7ff";
			var svgPathData = "M620.8 95.4c-30.8 .4-42.1 16.6-47.7 24.5l-.1 .1-55.7 80.5 82.8 121.1c7.5 10.6 11.3 12.5 35.4 12.5l0 9.1c-9.1-.7-28-.7-37.7-.7-12.4 0-30.8 0-42.9 .7l0-9.1c13.2-.8 16.6-7.3 16.6-10.2 0-1.1 0-2.3-3-6.4l-65.5-96.3-60.2 87.9c-1.9 2.7-3.8 5.4-3.8 10.2 0 6.1 3.4 13.6 15 14.7l0 9.1c-9.4-.7-27.1-.7-37.2-.7l-2.8 0-11.7 82.6-195.9 0 0-9.1c26.7 0 30.9 0 30.9-16.9l0-203.2c0-16.9-4.3-16.9-30.9-16.9l0-10.3 19.8 0c-4.8-61.1-10.8-71.7-68-71.8l-20.7 0c-6.8 1.5-6.8 6.1-6.8 14.4l0 205c0 13.6 1.1 17.8 32.4 17.8l10.5 0 0 9.1-.4 0c-17.9-.3-36.7-.7-54.9-.7s-36.9 .3-54.8 .7l-.6 0 0-9.1 10.7 0c31.7 0 32.8-4.1 32.8-17.8l0-205c0-8.7 0-13.2-7.2-14.3l-20.8 0c-58.4 0-63.7 10.9-68.6 73.3l-6.8 0 6.3-83.3 217.5 0 6.1 81.8 164.1 0 9 83.3-6.8 0c-5.3-49.8-12.1-73-70.3-73l-51.5 0c-15 0-15.8 1.9-15.8 14.6l0 93.3 35.5 0c35.5 0 38.9-12.8 38.9-44l6 0 0 97.9-6 0c0-31.8-3.4-44.8-38.9-44.8l-35.5 0 0 105.2c0 13 .7 14.8 15.8 14.8l52.2 0c61.1 0 69.9-25.8 77.4-73.6-7.7 0-16.3 .2-22.2 .7l0-9.1c7.2 0 31.7-.4 47.8-23.8l65.5-95.7-72.7-106.7c-8.3-11.7-15.1-12.5-35.8-12.5l0-9.1c9.1 .7 27.9 .7 37.7 .7 12.4 0 30.8 0 42.9-.7l0 9.1c-12.5 .4-16.6 6.8-16.6 10.2 0 1.1 .4 2.3 3 6.4l55.7 81.6 49.7-72.1c2.7-3.7 4.5-6.8 4.5-11.3 0-6.1-3-13.6-15-14.8l0-9.1c9.4 .7 24.8 .7 37.2 .7 9 0 23.3 0 32-.7l0 9.1z";
			exports.definition = {
				prefix,
				iconName,
				icon: [
					width,
					height,
					aliases,
					unicode,
					svgPathData
				]
			};
			exports.faTex = exports.definition;
			exports.prefix = prefix;
			exports.iconName = iconName;
			exports.width = width;
			exports.height = height;
			exports.ligatures = aliases;
			exports.unicode = unicode;
			exports.svgPathData = svgPathData;
			exports.aliases = aliases;
		}));
		//#endregion
		//#region src/client/icons.tsx
		/**
		* UI icons — Font Awesome free tier (SVG/JS core, no font files shipped).
		* Per-icon deep imports keep the bundle tiny: the set root exports are not
		* side-effect-free, so importing from it would pull in every icon.
		* Icons by Font Awesome — https://fontawesome.com (CC BY 4.0).
		*
		* Sizing note: react-fontawesome v3 ignores width/height props, so the size
		* is forced through inline style (CSS beats the default 1em sizing).
		*/
		var import_faChevronLeft = require_faChevronLeft();
		var import_faArrowUp = require_faArrowUp();
		var import_faFolder = require_faFolder();
		var import_faFile = require_faFile();
		var import_faMinus = require_faMinus();
		var import_faMarkdown = require_faMarkdown();
		var import_faTex = require_faTex();
		/** Shared inline sizing: react-fontawesome v3 does not honor width/height props. */
		function sized(size) {
			return {
				width: size,
				height: size,
				display: "block",
				flex: "none"
			};
		}
		/** ‹ back / collapse. */
		function IconChevronLeft({ size = 16 }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: import_faChevronLeft.faChevronLeft,
				style: sized(size)
			});
		}
		/** ↑ up one level. */
		function IconArrowUp({ size = 14 }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: import_faArrowUp.faArrowUp,
				style: sized(size)
			});
		}
		/** folder glyph (directory tree). */
		function IconFolder({ size = 14 }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: import_faFolder.faFolder,
				style: sized(size)
			});
		}
		/** file glyph (directory tree). */
		function IconFile({ size = 14 }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: import_faFile.faFile,
				style: sized(size)
			});
		}
		/** — minimize / collapse. */
		function IconMinus({ size = 14 }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: import_faMinus.faMinus,
				style: sized(size)
			});
		}
		/** Markdown brand glyph. */
		function IconMarkdown({ size = 16 }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: import_faMarkdown.faMarkdown,
				style: sized(size)
			});
		}
		/** TeX brand glyph; optically smaller, so it defaults larger than normal. */
		function IconTex({ size = 18 }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: import_faTex.faTex,
				style: sized(size)
			});
		}
		//#endregion
		//#region src/client/generation.ts
		/**
		* Module-level article-generation state and job runner.
		*
		* The generation job lives here — NOT in a page component — so it survives
		* every kind of navigation: back to the records list, into the session chat,
		* even closing the panel. The progress dialog and the minimized status pill
		* render in their own body-level React root (panel.tsx) and subscribe to this
		* store, so the job is never lost while it runs.
		*/
		const GENERATE_ENDPOINT = "/api/dsh-electro-lab/generate";
		const GENERATE_PROGRESS_ENDPOINT = "/api/dsh-electro-lab/generate-progress";
		const GENERATE_CANCEL_ENDPOINT = "/api/dsh-electro-lab/generate-cancel";
		const listeners = /* @__PURE__ */ new Set();
		let state = {
			progress: null,
			minimized: false,
			elapsed: 0
		};
		let jobId = null;
		let timer = null;
		function emit() {
			for (const listener of listeners) listener();
		}
		function startTimer() {
			if (timer !== null) return;
			timer = setInterval(() => {
				state = {
					...state,
					elapsed: state.elapsed + 1
				};
				emit();
			}, 1e3);
		}
		function stopTimer() {
			if (timer === null) return;
			clearInterval(timer);
			timer = null;
		}
		function setProgress(progress) {
			state = {
				...state,
				progress
			};
			if (progress !== null && progress.status === "running") startTimer();
			else stopTimer();
			emit();
		}
		function subscribe(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		}
		function getSnapshot() {
			return state;
		}
		/** Parse the wire phase string back to the enum; unknown values fall back to Prepare. */
		function parsePhase(value) {
			switch (value) {
				case "prepare":
				case "generate":
				case "write":
				case "compile": return value;
				default: return "prepare";
			}
		}
		/** Subscribe a component to the generation state (useSyncExternalStore). */
		function useGenState() {
			return (0, react.useSyncExternalStore)(subscribe, getSnapshot);
		}
		/** Start a generation job and poll it to completion; safe to call from any page. */
		function startGenerate(request) {
			if (state.progress?.status === "running") return;
			jobId = null;
			state = {
				...state,
				minimized: false,
				elapsed: 0
			};
			setProgress({
				percent: 0,
				phase: "prepare",
				status: "running"
			});
			(async () => {
				try {
					const res = await fetch(`${GENERATE_ENDPOINT}?recordId=${encodeURIComponent(request.recordId)}&format=${encodeURIComponent(request.format)}&language=${encodeURIComponent(request.language)}&directory=${encodeURIComponent(request.directory)}&fileName=${encodeURIComponent(request.fileName)}&compile=${request.compile ? "true" : "false"}`, { method: "POST" });
					const body = await res.json();
					if (!res.ok) throw new Error(body.error ?? `generate returned ${res.status}`);
					if (body.jobId === void 0) throw new Error("no job id returned");
					jobId = body.jobId;
					for (;;) {
						await new Promise((resolve) => setTimeout(resolve, 500));
						const pr = await fetch(`${GENERATE_PROGRESS_ENDPOINT}?jobId=${encodeURIComponent(body.jobId)}`);
						if (!pr.ok) throw new Error(`progress returned ${pr.status}`);
						const job = await pr.json();
						if (job.status === "done") {
							setProgress({
								percent: 100,
								phase: parsePhase(job.phase),
								status: "done",
								path: job.path,
								...job.pdfPath === void 0 ? {} : { pdfPath: job.pdfPath },
								...job.compileError === void 0 ? {} : { compileError: job.compileError }
							});
							return;
						}
						if (job.status === "error") {
							setProgress({
								percent: job.percent ?? 0,
								phase: parsePhase(job.phase),
								status: "error",
								error: job.error ?? "unknown error"
							});
							return;
						}
						if (job.percent !== void 0 && job.phase !== void 0) setProgress({
							percent: job.percent,
							phase: parsePhase(job.phase),
							status: "running"
						});
					}
				} catch (error) {
					setProgress({
						percent: 0,
						phase: "prepare",
						status: "error",
						error: error instanceof Error ? error.message : String(error)
					});
				}
			})();
		}
		/** Collapse the progress dialog into the corner pill; the job keeps running. */
		function setMinimized(minimized) {
			state = {
				...state,
				minimized
			};
			emit();
		}
		/** Abort a running job and close the progress UI. */
		function cancelGenerate() {
			const id = jobId;
			jobId = null;
			if (id !== null) fetch(`${GENERATE_CANCEL_ENDPOINT}?jobId=${encodeURIComponent(id)}`, { method: "POST" }).catch(() => {});
			setProgress(null);
			state = {
				...state,
				minimized: false,
				elapsed: 0
			};
			emit();
		}
		/** Dismiss a settled progress (done or error) and reset the UI. */
		function clearProgress() {
			jobId = null;
			setProgress(null);
			state = {
				...state,
				minimized: false,
				elapsed: 0
			};
			emit();
		}
		//#endregion
		//#region src/client/generation-ui.tsx
		/**
		* Generation UI: the format setup dialog (language / output directory with
		* the host-driven directory browser / file name / optional PDF compile) and
		* the body-level generation overlay (progress dialog + minimized pill). The
		* running job itself lives in the module-level generation store so it
		* survives navigation; the overlay is mounted by panel.tsx into a
		* body-level React root.
		*/
		const GENERATE_DIR_ENDPOINT = "/api/dsh-electro-lab/generate-dir";
		const GENERATE_CAPABILITY_ENDPOINT = "/api/dsh-electro-lab/generate-capability";
		const REVEAL_ENDPOINT = "/api/dsh-electro-lab/reveal";
		const LIST_DIRS_ENDPOINT = "/api/dsh-electro-lab/list-dirs";
		const LIST_ROOTS_ENDPOINT = "/api/dsh-electro-lab/list-roots";
		/** Text input inside the generation setup dialog. */
		const genInputStyle = {
			flex: 1,
			minWidth: 0,
			padding: "6px 8px",
			fontSize: 13,
			color: "var(--dsw-alias-label-primary)",
			background: "var(--dsw-specific-input-major)",
			border: "1px solid var(--dsw-alias-border-l2)",
			borderRadius: 6,
			outline: "none",
			fontFamily: "ui-monospace, monospace"
		};
		/** Dropdown inside the generation setup dialog. */
		const genSelectStyle = {
			flex: 1,
			padding: "6px 8px",
			fontSize: 13,
			color: "var(--dsw-alias-label-primary)",
			background: "var(--dsw-specific-input-major)",
			border: "1px solid var(--dsw-alias-border-l2)",
			borderRadius: 6
		};
		/** Map a generation phase code to its translated label. */
		function genPhaseKey(phase) {
			switch (phase) {
				case "prepare": return "phasePrepare";
				case "generate": return "phaseGenerate";
				case "write": return "phaseWrite";
				case "compile": return "phaseCompile";
			}
		}
		/** mm:ss elapsed-time display. */
		function formatElapsed(totalSeconds) {
			const minutes = Math.floor(totalSeconds / 60);
			const seconds = totalSeconds % 60;
			return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
		}
		/** Parse the remembered/typed language from its raw string (unknown values → undefined). */
		function parseArticleLanguage(value) {
			switch (value) {
				case "auto":
				case "zh-CN":
				case "en": return value;
				default: return;
			}
		}
		/** The file extension for an output format. */
		function formatExtension(format) {
			switch (format) {
				case "latex": return "tex";
				case "markdown": return "md";
			}
		}
		/**
		* The setup dialog for one format (the dialog never switches formats — the
		* caller picks Markdown or LaTeX by which button opened it).
		*/
		function GenerationSetupDialog({ open, format, recordId, onClose }) {
			useAppLocale();
			const [genDir, setGenDir] = (0, react.useState)("");
			const [genLanguage, setGenLanguage] = (0, react.useState)("auto");
			const [genCompile, setGenCompile] = (0, react.useState)(false);
			const [genFile, setGenFile] = (0, react.useState)("");
			const [genSetupError, setGenSetupError] = (0, react.useState)(null);
			const [capability, setCapability] = (0, react.useState)(null);
			const [settingsLoaded, setSettingsLoaded] = (0, react.useState)(false);
			const { progress: genProgress } = useGenState();
			const genRunning = genProgress?.status === "running";
			const [dirBrowserOpen, setDirBrowserOpen] = (0, react.useState)(false);
			const [dirEntries, setDirEntries] = (0, react.useState)([]);
			const [dirExpanded, setDirExpanded] = (0, react.useState)(/* @__PURE__ */ new Set());
			const [dirSelected, setDirSelected] = (0, react.useState)("");
			const [dirLoading, setDirLoading] = (0, react.useState)(false);
			const [dirSnapshot, setDirSnapshot] = (0, react.useState)(null);
			const treeListRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (!open) return;
				let alive = true;
				setSettingsLoaded(false);
				fetch(GENERATE_DIR_ENDPOINT).then((r) => r.json()).then((body) => {
					if (!alive) return;
					if (body.directory !== void 0 && body.directory !== "") setGenDir(body.directory);
					const language = parseArticleLanguage(body.language);
					if (language !== void 0) setGenLanguage(language);
					if (typeof body.compile === "boolean") setGenCompile(body.compile);
				}).catch(() => {}).finally(() => {
					if (alive) setSettingsLoaded(true);
				});
				return () => {
					alive = false;
				};
			}, [open]);
			/**
			* What this machine can compile with (LaTeX only): the host probes for a driver and for the
			* document shell's macros. A missing driver blocks the button; missing macros are only a hint,
			* because a TeX distribution may install them on demand. Asked once the remembered settings have
			* arrived, so the check runs for the language the dialog actually shows.
			*/
			(0, react.useEffect)(() => {
				if (!open || !settingsLoaded || format !== "latex") return;
				let alive = true;
				fetch(`${GENERATE_CAPABILITY_ENDPOINT}?language=${encodeURIComponent(genLanguage)}`).then((r) => r.json()).then((body) => {
					if (alive) setCapability(body);
				}).catch(() => {
					if (alive) setCapability(null);
				});
				return () => {
					alive = false;
				};
			}, [
				open,
				settingsLoaded,
				format,
				genLanguage
			]);
			/** Default file name placeholder of the dialog. */
			const defaultFileName = `electro-lab-${recordId.slice(0, 8)}.${formatExtension(format)}`;
			const compileBlocked = format === "latex" && capability !== null && !capability.ready && genCompile;
			const toolchainDetail = capability === null ? "" : capability.driver === null ? capability.drivers.find((probe) => !probe.ok && probe.detail !== void 0)?.detail ?? "" : capability.engine.ok ? "" : capability.engine.detail ?? "";
			const missingPackages = genCompile && capability !== null && capability.ready ? capability.missingPackages : [];
			/** Persist the directory and language, and — LaTeX only — the PDF-compile toggle. */
			const saveGenState = () => {
				const dir = genDir.trim();
				const params = new URLSearchParams();
				if (dir.length > 0) params.set("dir", dir);
				params.set("language", genLanguage);
				if (format === "latex") params.set("compile", String(genCompile));
				fetch(`${GENERATE_DIR_ENDPOINT}?${params.toString()}`, { method: "PUT" }).catch(() => {});
			};
			const closeDialog = () => {
				saveGenState();
				setGenSetupError(null);
				onClose();
			};
			/** Ask the host to generate the article (LLM) and write it to disk. */
			const runGenerate = () => {
				const dir = genDir.trim();
				if (dir.length === 0) {
					setGenSetupError(t$1("directoryRequired"));
					return;
				}
				setGenSetupError(null);
				saveGenState();
				onClose();
				startGenerate({
					recordId,
					format,
					language: genLanguage,
					directory: dir,
					fileName: genFile.trim(),
					compile: format === "latex" && genCompile
				});
			};
			/** Load one directory's subdirectories AND files through the host (pure HTTP). */
			const loadDirListing = async (path) => {
				const res = await fetch(`${LIST_DIRS_ENDPOINT}?path=${encodeURIComponent(path)}`);
				if (!res.ok) throw new Error(`list-dirs returned ${res.status}`);
				const body = await res.json();
				return {
					path: body.path ?? path,
					entries: body.entries ?? [],
					files: body.files ?? [],
					parent: body.parent ?? ""
				};
			};
			/** Immutably attach lazily loaded children to one node in the tree. */
			const attachChildren = (nodes, path, children) => nodes.map((node) => {
				if (node.absolutePath === path) return {
					...node,
					children
				};
				if (node.children !== void 0) return {
					...node,
					children: attachChildren(node.children, path, children)
				};
				return node;
			});
			/** Find one entry by absolute path (depth-first over the loaded tree). */
			const findEntry = (nodes, path) => {
				for (const node of nodes) {
					if (node.absolutePath === path) return node;
					if (node.children !== void 0) {
						const found = findEntry(node.children, path);
						if (found !== void 0) return found;
					}
				}
			};
			/** Open the directory browser at the current output directory. */
			const openDirBrowser = async () => {
				try {
					const res = await fetch(LIST_ROOTS_ENDPOINT);
					if (!res.ok) throw new Error(`list-roots returned ${res.status}`);
					const roots = (await res.json()).roots ?? [];
					if (roots.length === 0) return;
					let tree = roots.map((root) => ({
						name: root,
						type: "directory",
						absolutePath: root
					}));
					const expanded = /* @__PURE__ */ new Set();
					const current = genDir.trim();
					setDirSelected(current);
					setDirSnapshot({
						dir: genDir,
						file: genFile
					});
					setDirBrowserOpen(true);
					if (current.length > 0) {
						const chain = [];
						let probe = current;
						try {
							for (;;) {
								const snap = await loadDirListing(probe);
								chain.push({
									path: snap.path,
									parent: snap.parent
								});
								if (snap.parent === snap.path) break;
								probe = snap.parent;
							}
						} catch {
							chain.length = 0;
						}
						for (const item of [...chain].reverse()) {
							if (item.parent === item.path) continue;
							try {
								const { entries, files } = await loadDirListing(item.parent);
								const base = item.parent.replace(/[\\/]+$/, "");
								const children = [...entries.map((name) => ({
									name,
									type: "directory",
									absolutePath: `${base}/${name}`
								})), ...files.map((name) => ({
									name,
									type: "file",
									absolutePath: `${base}/${name}`
								}))];
								tree = attachChildren(tree, item.parent, children);
								expanded.add(item.parent);
							} catch {}
						}
						setDirSelected(current);
					}
					setDirEntries(tree);
					setDirExpanded(expanded);
					setDirLoading(false);
					if (current.length > 0) setTimeout(() => {
						treeListRef.current?.querySelector(`[data-path="${CSS.escape(current)}"]`)?.scrollIntoView({ block: "start" });
					}, 0);
				} catch (error) {
					window.alert(`Cannot browse directories: ${error instanceof Error ? error.message : String(error)}`);
				}
			};
			/** Navigate the browser up one level. */
			const goUpLevel = async () => {
				const current = dirSelected.trim();
				if (current.length === 0) return;
				let parent;
				try {
					parent = (await loadDirListing(current)).parent;
				} catch {
					return;
				}
				if (parent === current) return;
				const parentNode = findEntry(dirEntries, parent);
				if (parentNode === void 0) return;
				if (parentNode.children === void 0) try {
					const { entries, files } = await loadDirListing(parent);
					const base = parent.replace(/[\\/]+$/, "");
					const children = [...entries.map((name) => ({
						name,
						type: "directory",
						absolutePath: `${base}/${name}`
					})), ...files.map((name) => ({
						name,
						type: "file",
						absolutePath: `${base}/${name}`
					}))];
					setDirEntries((prev) => attachChildren(prev, parent, children));
				} catch {
					return;
				}
				setDirExpanded((prev) => new Set(prev).add(parent));
				setDirSelected(parent);
				setGenDir(parent);
				setTimeout(() => {
					treeListRef.current?.querySelector(`[data-path="${CSS.escape(parent)}"]`)?.scrollIntoView({ block: "start" });
				}, 0);
			};
			/** Click a tree row: directories lazily load + toggle expand; files fill the name + its directory. */
			const onDirClick = async (node) => {
				setDirSelected(node.absolutePath);
				if (node.type === "file") {
					const parent = node.absolutePath.slice(0, node.absolutePath.lastIndexOf("/") + 1) || node.absolutePath;
					setGenDir(parent);
					setGenFile(node.name);
					return;
				}
				setGenDir(node.absolutePath);
				if (node.children === void 0) {
					setDirLoading(true);
					try {
						const { entries, files } = await loadDirListing(node.absolutePath);
						const base = node.absolutePath.replace(/[\\/]+$/, "");
						const children = [...entries.map((name) => ({
							name,
							type: "directory",
							absolutePath: `${base}/${name}`
						})), ...files.map((name) => ({
							name,
							type: "file",
							absolutePath: `${base}/${name}`
						}))];
						setDirEntries((prev) => attachChildren(prev, node.absolutePath, children));
					} catch (error) {
						window.alert(`Cannot browse directories: ${error instanceof Error ? error.message : String(error)}`);
						setDirLoading(false);
						return;
					}
					setDirLoading(false);
				}
				setDirExpanded((prev) => {
					const next = new Set(prev);
					if (next.has(node.absolutePath)) next.delete(node.absolutePath);
					else next.add(node.absolutePath);
					return next;
				});
			};
			/** Recursive tree node renderer (flat state: entries tree + expanded set). */
			const renderDirNode = (node, depth) => {
				const expanded = dirExpanded.has(node.absolutePath);
				const isSelected = dirSelected === node.absolutePath;
				const isDir = node.type === "directory";
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					"data-path": node.absolutePath,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						role: "button",
						className: "directory-tree-entry flex items-center cursor-pointer relative select-none text-xs leading-tight w-full",
						style: {
							paddingLeft: 8 + depth * 14,
							paddingRight: 8,
							height: 26,
							gap: 4,
							color: "var(--dsw-alias-label-primary)",
							background: isSelected ? "var(--dsw-alias-interactive-bg-active)" : "none",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							userSelect: "none",
							WebkitUserSelect: "none"
						},
						onClick: () => void onDirClick(node),
						onMouseEnter: (e) => {
							if (!isSelected) e.currentTarget.style.background = "var(--dsw-alias-interactive-bg-hover)";
						},
						onMouseLeave: (e) => {
							if (!isSelected) e.currentTarget.style.background = "none";
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "directory-tree-expand-icon w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center",
								style: { color: "var(--dsw-alias-label-secondary)" },
								children: isDir ? expanded ? "▾" : "▸" : ""
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "directory-tree-type-icon w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center",
								children: isDir ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconFolder, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconFile, { size: 14 })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "directory-tree-name flex-1 min-w-0",
								style: {
									overflow: "hidden",
									textOverflow: "ellipsis"
								},
								children: node.name
							})
						]
					}), isDir && expanded && node.children !== void 0 && node.children.map((child) => renderDirNode(child, depth + 1))]
				}, node.absolutePath);
			};
			/** Cancel the browse: revert the setup fields to their pre-browse values and close. */
			const closeDirBrowser = () => {
				if (dirSnapshot !== null) {
					setGenDir(dirSnapshot.dir);
					setGenFile(dirSnapshot.file);
				}
				setDirBrowserOpen(false);
			};
			if (!open) return null;
			/** One label span of the setup grid (fixed label column). */
			const setupLabel = (text) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				style: {
					fontSize: 12,
					fontWeight: 600,
					color: "var(--dsw-alias-label-secondary)",
					textAlign: "left"
				},
				children: text
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Dialog, {
				open: true,
				title: format === "markdown" ? t$1("generateSetupMarkdown") : t$1("generateSetupLatex"),
				width: 430,
				onClose: closeDialog,
				footer: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GhostButton, {
					onClick: closeDialog,
					children: t$1("cancel")
				}, "cancel"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PrimaryButton, {
					disabled: genRunning || compileBlocked,
					onClick: runGenerate,
					children: t$1("generate")
				}, "generate")],
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "104px 1fr",
						gap: "12px 10px",
						alignItems: "center"
					},
					children: [
						setupLabel(t$1("language")),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							value: genLanguage,
							onChange: (e) => {
								const language = parseArticleLanguage(e.target.value);
								if (language !== void 0) setGenLanguage(language);
							},
							style: { ...genSelectStyle },
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "auto",
									children: t$1("languageAuto")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "zh-CN",
									children: t$1("languageZh")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "en",
									children: t$1("languageEn")
								})
							]
						}),
						setupLabel(t$1("directory")),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								gap: 8,
								minWidth: 0
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "text",
								value: genDir,
								onChange: (e) => {
									setGenDir(e.target.value);
									if (genSetupError !== null) setGenSetupError(null);
								},
								placeholder: "/path/to/output",
								style: { ...genInputStyle }
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(GhostButton, {
								onClick: () => void openDirBrowser(),
								children: t$1("browse")
							})]
						}),
						setupLabel(t$1("fileName")),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "text",
							value: genFile,
							onChange: (e) => setGenFile(e.target.value),
							placeholder: defaultFileName,
							style: { ...genInputStyle }
						}),
						format === "latex" && setupLabel(t$1("compilePdf")),
						format === "latex" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: genCompile,
							onChange: (e) => setGenCompile(e.target.checked),
							style: {
								width: 14,
								height: 14,
								accentColor: "var(--dsw-alias-state-business-primary)",
								cursor: "pointer"
							}
						}),
						compileBlocked && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								marginTop: 8,
								fontSize: 12,
								lineHeight: 1.5,
								color: "var(--dsw-alias-state-error-primary)"
							},
							children: [t$1("toolchainMissing"), toolchainDetail.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									marginTop: 2,
									color: "var(--dsw-alias-label-tertiary)",
									wordBreak: "break-word"
								},
								children: toolchainDetail
							})]
						}),
						missingPackages.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								marginTop: 8,
								fontSize: 12,
								lineHeight: 1.5,
								color: "var(--dsw-alias-state-warn-primary)",
								wordBreak: "break-word"
							},
							children: [
								t$1("macroHint"),
								" ",
								missingPackages.join(", ")
							]
						})
					]
				}), genSetupError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						marginTop: 10,
						fontSize: 12,
						color: "var(--dsw-alias-state-error-primary)"
					},
					children: genSetupError
				})]
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Dialog, {
				open: dirBrowserOpen,
				title: t$1("browseDirectory"),
				width: 440,
				height: 420,
				onClose: closeDirBrowser,
				footer: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GhostButton, {
					onClick: closeDirBrowser,
					children: t$1("cancel")
				}, "cancel"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PrimaryButton, {
					onClick: () => setDirBrowserOpen(false),
					children: t$1("confirm")
				}, "confirm")],
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 8,
						flex: "none"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						title: t$1("upLevel"),
						onClick: () => void goUpLevel(),
						style: {
							width: 30,
							height: 30,
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							borderRadius: 6,
							border: "none",
							background: "none",
							color: "var(--dsw-alias-label-secondary)",
							cursor: "pointer"
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconArrowUp, { size: 18 })
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							font: "12px ui-monospace, monospace",
							color: "var(--dsw-alias-label-secondary)",
							wordBreak: "break-all",
							minWidth: 0,
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap"
						},
						children: dirSelected
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					ref: treeListRef,
					style: {
						marginTop: 8,
						flex: 1,
						minHeight: 0,
						overflowY: "auto",
						border: "1px solid var(--dsw-alias-border-l2)",
						borderRadius: 6,
						padding: "4px 0"
					},
					children: [dirLoading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							padding: "4px 8px",
							fontSize: 12,
							color: "var(--dsw-alias-label-tertiary)"
						},
						children: "…"
					}), dirEntries.map((node) => renderDirNode(node, 0))]
				})]
			})] });
		}
		/** Reveal a generated file in the OS file manager, or open it with its default application. */
		async function launchPath(path, action) {
			try {
				const res = await fetch(`${REVEAL_ENDPOINT}?path=${encodeURIComponent(path)}&action=${action}`, { method: "POST" });
				const body = await res.json();
				if (!res.ok || body.result !== "ok") throw new Error(body.result ?? `reveal returned ${res.status}`);
			} catch (error) {
				window.alert(`Cannot open: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
		/**
		* The title of the progress dialog and of the minimized pill: one word per job status.
		*/
		function statusTitle(status) {
			switch (status) {
				case "done": return t$1("generateDone");
				case "error": return t$1("generateFailed");
				default: return t$1("generating");
			}
		}
		/**
		* The generation overlay: the progress dialog and the minimized status pill,
		* rendered in a body-level React root (panel.tsx). Driven by the module-level
		* generation store, so a running job survives any navigation.
		*/
		function GenerationOverlay() {
			useAppLocale();
			const [minimizeHover, setMinimizeHover] = (0, react.useState)(false);
			const { progress, minimized, elapsed } = useGenState();
			if (progress === null) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					font: "13px/1.5 var(--dsw-font-family, ui-sans-serif, system-ui, sans-serif)",
					color: "var(--dsw-alias-label-primary)"
				},
				children: [!minimized && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Dialog, {
					open: true,
					title: statusTitle(progress.status),
					width: 380,
					height: 190,
					dismissible: false,
					onClose: () => {},
					headerRight: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8,
							flex: "none"
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 13,
								color: "var(--dsw-alias-label-secondary)",
								fontVariantNumeric: "tabular-nums"
							},
							children: formatElapsed(elapsed)
						}), progress.status === "running" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							title: t$1("minimize"),
							"aria-label": t$1("minimize"),
							onClick: () => setMinimized(true),
							onMouseEnter: () => setMinimizeHover(true),
							onMouseLeave: () => setMinimizeHover(false),
							style: {
								width: 28,
								height: 28,
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 6,
								border: "none",
								background: minimizeHover ? "var(--dsw-alias-interactive-bg-hover)" : "none",
								color: minimizeHover ? "var(--dsw-alias-label-primary)" : "var(--dsw-alias-label-secondary)",
								cursor: "pointer"
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconMinus, { size: 16 })
						})]
					}),
					footer: [
						progress.status === "running" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(GhostButton, {
							onClick: cancelGenerate,
							children: t$1("cancel")
						}, "cancel"),
						progress.status === "done" && progress.path !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GhostButton, {
							onClick: () => void launchPath(progress.pdfPath ?? progress.path, "open"),
							children: t$1("openFile")
						}, "openfile"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(GhostButton, {
							onClick: () => void launchPath(progress.path, "reveal"),
							children: t$1("openDirectory")
						}, "opendir")] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PrimaryButton, {
							disabled: progress.status === "running",
							onClick: clearProgress,
							children: t$1("confirm")
						}, "confirm")
					].filter(Boolean),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							flex: 1,
							minHeight: 0,
							display: "flex"
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								margin: "auto",
								width: "100%",
								textAlign: "center"
							},
							children: [
								progress.status === "running" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 13,
										color: "var(--dsw-alias-label-primary)",
										fontWeight: 600
									},
									children: t$1(genPhaseKey(progress.phase))
								}),
								progress.status === "done" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										style: {
											fontSize: 13,
											color: "var(--dsw-alias-label-primary)",
											wordBreak: "break-all"
										},
										children: [
											t$1("generatedAt"),
											" ",
											progress.path ?? ""
										]
									}),
									progress.pdfPath !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										style: {
											marginTop: 6,
											fontSize: 12,
											color: "var(--dsw-alias-label-secondary)",
											wordBreak: "break-all"
										},
										children: [
											t$1("generatedPdfAt"),
											" ",
											progress.pdfPath
										]
									}),
									progress.compileError !== void 0 && progress.pdfPath === void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										style: {
											marginTop: 6,
											fontSize: 12,
											color: "var(--dsw-alias-state-error-primary)",
											whiteSpace: "pre-wrap",
											wordBreak: "break-word"
										},
										children: progress.compileError.length > 0 ? `${t$1("compileFailed")} ${progress.compileError}` : t$1("compileFailedNoDetail")
									})
								] }),
								progress.status === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 12,
										color: "var(--dsw-alias-state-error-primary)",
										whiteSpace: "pre-wrap",
										wordBreak: "break-word"
									},
									children: progress.error ?? "unknown error"
								})
							]
						})
					})
				}), minimized && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setMinimized(false),
					title: statusTitle(progress.status),
					style: {
						position: "fixed",
						right: 16,
						bottom: 16,
						zIndex: 90,
						display: "flex",
						alignItems: "center",
						gap: 8,
						padding: "8px 14px",
						borderRadius: 8,
						background: "var(--dsw-alias-bg-layer-2)",
						border: "1px solid var(--dsw-alias-border-l2)",
						boxShadow: "var(--dsw-shadow-lv3)",
						fontSize: 13,
						color: "var(--dsw-alias-label-primary)",
						cursor: "pointer",
						pointerEvents: "auto"
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { style: {
							width: 8,
							height: 8,
							borderRadius: "50%",
							flex: "none",
							background: progress.status === "error" ? "var(--dsw-alias-state-error-primary)" : progress.status === "done" ? "var(--dsw-alias-state-success-primary)" : "var(--dsw-alias-label-secondary)"
						} }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: statusTitle(progress.status) }),
						progress.status === "running" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: {
								fontVariantNumeric: "tabular-nums",
								color: "var(--dsw-alias-label-secondary)"
							},
							children: formatElapsed(elapsed)
						})
					]
				})]
			});
		}
		//#endregion
		//#region src/client/record-detail.tsx
		/**
		* ElectroLab record detail: one record's trace as a human timeline.
		*
		* The trace body is the process itself — every row carries its input and
		* output. The detail view renders rows in order with typed values shown in a
		* human form (units and prefixes), groups consecutive condition sets and
		* consecutive failed attempts into collapsible sections, highlights failures,
		* and links slot references back to the set row that created the slot.
		* Read-only: fetched from GET /api/dsh-electro-lab/records/<id>.
		*/
		const BODY_ENDPOINT = "/api/dsh-electro-lab/records/";
		const POLL_MS$2 = 5e3;
		/** Back button styling shared with the panel's back-to-session button. */
		const backButtonBase = {
			background: "none",
			border: "1px solid var(--dsw-alias-label-tertiary)",
			borderRadius: 6,
			color: "var(--dsw-alias-label-primary)",
			cursor: "pointer",
			fontSize: 13,
			display: "flex",
			alignItems: "center",
			gap: 6,
			padding: "4px 8px"
		};
		/** Collect the distinct slot names referenced anywhere inside an argument value. */
		function referencedSlots(value, into) {
			if (value === null || typeof value !== "object") return;
			const v = value;
			if (v.type === "slot" && typeof v.value === "string") {
				const name = v.value.split(".")[0] ?? v.value;
				if (!into.includes(name)) into.push(name);
				return;
			}
			if (v.type === "array" && Array.isArray(v.value)) {
				for (const item of v.value) referencedSlots(item, into);
				return;
			}
			if (v.type === "object" && typeof v.value === "object" && v.value !== null) for (const field of Object.values(v.value)) referencedSlots(field, into);
		}
		/** Containers (typed or plain arrays/objects) render as a tree; scalars as text. */
		function isExpandable(value) {
			if (Array.isArray(value)) return true;
			if (typeof value !== "object" || value === null) return false;
			const v = value;
			if (v.type === void 0) return true;
			return v.type === "array" || v.type === "object";
		}
		function containerKind(value) {
			if (Array.isArray(value)) return "array";
			if (typeof value !== "object" || value === null) return null;
			const v = value;
			if (v.type === "array" && Array.isArray(v.value)) return "array";
			if (v.type === "object" && typeof v.value === "object" && v.value !== null) return "object";
			if (v.type === void 0) return "object";
			return null;
		}
		const TREE_INDENT = 18;
		const TRIANGLE_W = 16;
		/** Child rows of a container (typed or plain): objects key their entries, arrays index their items. */
		function childrenOf(value) {
			const children = [];
			if (Array.isArray(value)) {
				value.forEach((item, index) => children.push({
					label: String(index),
					value: item
				}));
				return children;
			}
			const v = value;
			if (v.type === "array" && Array.isArray(v.value)) {
				v.value.forEach((item, index) => children.push({
					label: String(index),
					value: item
				}));
				return children;
			}
			if (v.type === "object" && typeof v.value === "object" && v.value !== null) {
				for (const [key, field] of Object.entries(v.value)) children.push({
					label: key,
					value: field
				});
				return children;
			}
			for (const [key, field] of Object.entries(v)) children.push({
				label: key,
				value: field
			});
			return children;
		}
		/**
		* JSON tree row: a disclosure triangle at the start of the row, then the
		* indented key and the value. Container values collapse to a placeholder
		* ({ … } / [ … ]) until expanded. An UNLABELED root object is stripped —
		* its fields become the top-level rows (no wrapper row). Each visible row
		* carries a zebra band that alternates with its siblings, continuing
		* opposite below any expanded container.
		*/
		function RowNode({ label, value, banded = false }) {
			if (label === void 0 && containerKind(value) === "object") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					width: "100%",
					boxSizing: "border-box"
				},
				children: childrenOf(value).map((child, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RowNodeImpl, {
					label: child.label,
					value: child.value,
					depth: 0,
					banded: isZebra(index)
				}, child.label ?? index))
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RowNodeImpl, {
				label,
				value,
				depth: 0,
				banded
			});
		}
		function RowNodeImpl({ label, value, depth, banded }) {
			const [open, setOpen] = (0, react.useState)(false);
			const kind = containerKind(value);
			const keyEl = label !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				style: {
					color: "var(--dsw-alias-label-tertiary)",
					...codeFont$1,
					fontSize: 14,
					minWidth: 8
				},
				children: label
			}) : null;
			const leafPad = depth * TREE_INDENT + TRIANGLE_W + 8;
			if (kind === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					gap: 8,
					alignItems: "baseline",
					fontSize: 15,
					paddingLeft: leafPad,
					width: "100%",
					boxSizing: "border-box",
					...banded ? zebraRow : {}
				},
				children: [keyEl, /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: {
						wordBreak: "break-word",
						color: "var(--dsw-alias-label-primary)"
					},
					children: displayValue(value)
				})]
			});
			const children = childrenOf(value);
			const placeholder = kind === "object" ? "{ … }" : "[ … ]";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					width: "100%",
					boxSizing: "border-box"
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					role: "button",
					tabIndex: 0,
					onClick: () => setOpen(!open),
					onKeyDown: (event) => {
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault();
							setOpen(!open);
						}
					},
					style: {
						display: "flex",
						gap: 8,
						alignItems: "baseline",
						fontSize: 15,
						cursor: "pointer",
						paddingLeft: depth * TREE_INDENT,
						width: "100%",
						boxSizing: "border-box",
						...banded ? zebraRow : {}
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							style: {
								display: "inline-block",
								width: TRIANGLE_W,
								textAlign: "center",
								fontSize: 13,
								color: "var(--dsw-alias-label-secondary)",
								flex: "none"
							},
							children: open ? "▾" : "▸"
						}),
						keyEl,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: {
								color: "var(--dsw-alias-label-tertiary)",
								...codeFont$1,
								fontSize: 14.5
							},
							children: placeholder
						})
					]
				}), open && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						width: "100%",
						boxSizing: "border-box"
					},
					children: children.map((child, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RowNodeImpl, {
						label: child.label,
						value: child.value,
						depth: depth + 1,
						banded: childZebra(index, banded)
					}, child.label ?? index))
				})]
			});
		}
		/**
		* Fold consecutive ok set rows into a "writes" card, consecutive ok get rows
		* into a "reads" card, and consecutive failures into one section.
		*/
		function groupRows(rows) {
			const items = [];
			let run = [];
			const flush = () => {
				if (run.length === 0) return;
				const first = run[0];
				if (first.tool === "set" && first.ok) items.push({
					kind: "writes",
					rows: run
				});
				else if (first.tool === "get" && first.ok) items.push({
					kind: "reads",
					rows: run
				});
				else if (!first.ok) items.push({
					kind: "failures",
					rows: run
				});
				else if (first.tool === "call") items.push({
					kind: "call",
					row: first
				});
				else items.push({
					kind: "event",
					row: first
				});
				run = [];
			};
			for (const row of rows) {
				const runKey = row.ok && (row.tool === "set" || row.tool === "get") ? row.tool : !row.ok ? "fail" : null;
				const currentKey = run.length > 0 ? run[0].ok ? run[0].tool : "fail" : null;
				if (runKey !== null && runKey === currentKey) run.push(row);
				else {
					flush();
					if (runKey !== null) run.push(row);
					else if (row.tool === "marker") items.push({
						kind: "marker",
						row
					});
					else if (row.tool === "call" && row.ok) items.push({
						kind: "call",
						row
					});
					else items.push({
						kind: "event",
						row
					});
				}
			}
			flush();
			return items;
		}
		const rowStyle$2 = {
			padding: "10px 12px",
			borderRadius: 6,
			border: "1px solid var(--dsw-alias-border-l2)"
		};
		const codeFont$1 = { font: "12.5px ui-monospace, monospace" };
		/** Zebra stripe: alternating rows get a soft theme-aware band. */
		const zebraRow = {
			background: "var(--dsw-alias-interactive-bg-hover)",
			borderRadius: 4
		};
		/** True for odd rows: the first row of a list stays unbanded, stripes alternate from there. */
		function isZebra(index) {
			return index % 2 === 1;
		}
		/** Child rows alternate under their container, starting opposite the container's own band. */
		function childZebra(index, containerBanded) {
			return index % 2 === 0 ? !containerBanded : containerBanded;
		}
		function RecordDetail({ id, onBack }) {
			useAppLocale();
			const [record, setRecord] = (0, react.useState)(null);
			const [failed, setFailed] = (0, react.useState)(false);
			const [backHover, setBackHover] = (0, react.useState)(false);
			const [showAll, setShowAll] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				let alive = true;
				const load = async () => {
					try {
						const res = await fetch(`${BODY_ENDPOINT}${encodeURIComponent(id)}`);
						if (!res.ok) throw new Error(`record endpoint returned ${res.status}`);
						const body = await res.json();
						if (!alive) return;
						setRecord(body);
						setFailed(false);
					} catch {
						if (alive) setFailed(true);
					}
				};
				load();
				const timer = setInterval(() => {
					load();
				}, POLL_MS$2);
				return () => {
					alive = false;
					clearInterval(timer);
				};
			}, [id]);
			if (failed && record === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: rowStyle$2,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: { color: "var(--dsw-alias-label-secondary)" },
					children: t$1("recordUnreachable")
				})
			});
			if (record === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { style: { minHeight: 120 } });
			const visibleRows = showAll ? record.rows : record.rows.filter((row) => row.tool !== "solver_info");
			const failedCount = visibleRows.filter((row) => !row.ok).length;
			const items = groupRows(visibleRows);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					height: "100%",
					boxSizing: "border-box"
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 12,
						marginRight: 69,
						flex: "none"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-label": t$1("backToRecords"),
						onClick: onBack,
						onMouseEnter: () => setBackHover(true),
						onMouseLeave: () => setBackHover(false),
						style: {
							...backButtonBase,
							background: backHover ? "var(--dsw-alias-interactive-bg-hover)" : "none",
							borderColor: backHover ? "var(--dsw-alias-label-primary)" : "var(--dsw-alias-label-tertiary)"
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							style: {
								display: "inline-flex",
								alignItems: "center"
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconChevronLeft, { size: 16 })
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: { lineHeight: 1 },
							children: t$1("backToRecords")
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 6,
							fontSize: 12,
							color: "var(--dsw-alias-label-primary)",
							cursor: "pointer"
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: showAll,
							onChange: (event) => setShowAll(event.target.checked),
							style: { accentColor: "var(--dsw-alias-state-business-primary)" }
						}), t$1("displayAll")]
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						gap: 12,
						alignItems: "stretch",
						flex: "1 1 auto",
						minHeight: 0,
						marginTop: 10
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								flex: "1 1 auto",
								minWidth: 0,
								display: "flex",
								flexDirection: "column",
								gap: 10
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: rowStyle$2,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: {
										fontSize: 15,
										fontWeight: 600,
										color: "var(--dsw-alias-label-primary)",
										wordBreak: "break-all",
										...codeFont$1
									},
									children: record.id
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									style: {
										marginTop: 6,
										display: "flex",
										gap: 8,
										flexWrap: "wrap",
										alignItems: "center",
										fontSize: 12,
										color: "var(--dsw-alias-label-secondary)"
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t$1("rowsCount", { n: visibleRows.length }) }),
										failedCount > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											style: { color: "var(--dsw-alias-state-error-primary)" },
											children: t$1("failedCount", { n: failedCount })
										}),
										record.sealedAt === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											style: {
												padding: "1px 7px",
												borderRadius: 999,
												border: "1px solid var(--dsw-alias-state-warn-primary)",
												color: "var(--dsw-alias-state-warn-primary)"
											},
											children: t$1("incomplete")
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: formatTime$1(record.sealedAt) })
									]
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									flex: "1 1 auto",
									minHeight: 0,
									display: "flex",
									flexDirection: "column",
									gap: 10,
									overflowY: "auto",
									paddingRight: 4
								},
								children: items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TimelineItem, { item }, itemKey(item)))
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							"aria-hidden": "true",
							style: {
								flex: "none",
								width: 1,
								alignSelf: "stretch",
								background: "var(--dsw-alias-border-l2)"
							}
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ArticleActions, { body: record })
					]
				})]
			});
		}
		/** Right-hand column of the record detail: article generation actions (Markdown and LaTeX). */
		function ArticleActions({ body }) {
			const [hovered, setHovered] = (0, react.useState)(null);
			const [setupFormat, setSetupFormat] = (0, react.useState)(null);
			const { progress: genProgress } = useGenState();
			const genRunning = genProgress?.status === "running";
			const action = (key, label, icon, format) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				title: label,
				"aria-label": label,
				disabled: genRunning,
				onClick: () => setSetupFormat(format),
				onMouseEnter: () => setHovered(key),
				onMouseLeave: () => setHovered(null),
				style: {
					width: 44,
					height: 44,
					borderRadius: 8,
					border: "1px solid var(--dsw-alias-border-l2)",
					background: hovered === key ? "var(--dsw-alias-interactive-bg-hover)" : "none",
					color: "var(--dsw-alias-label-primary)",
					cursor: genRunning ? "default" : "pointer",
					opacity: genRunning ? .45 : 1,
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center"
				},
				children: icon
			}, key);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 8,
					flex: "none"
				},
				children: [
					action("articleGenerateMarkdown", t$1("articleGenerateMarkdown"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconMarkdown, { size: 24 }), "markdown"),
					action("articleGenerateTex", t$1("articleGenerateTex"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconTex, { size: 28 }), "latex"),
					setupFormat !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(GenerationSetupDialog, {
						open: true,
						format: setupFormat,
						recordId: body.id,
						onClose: () => setSetupFormat(null)
					})
				]
			});
		}
		function itemKey(item) {
			if (item.kind === "writes" || item.kind === "reads" || item.kind === "failures") return `${item.kind}-${item.rows[0]?.seq ?? 0}`;
			return `${item.row.tool}-${item.row.seq}`;
		}
		function formatTime$1(time) {
			return new Date(time).toLocaleString(void 0, {
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit"
			});
		}
		function TimelineItem({ item }) {
			switch (item.kind) {
				case "marker": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkerRow, { row: item.row });
				case "writes": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(WritesGroup, { rows: item.rows });
				case "reads": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReadsGroup, { rows: item.rows });
				case "failures": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FailuresGroup, { rows: item.rows });
				case "call": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CallRow, { row: item.row });
				case "event": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EventRow, { row: item.row });
			}
		}
		function markerLabel(kind) {
			switch (kind) {
				case "question": return t$1("markerQuestion");
				case "analyse": return t$1("markerAnalyse");
				case "answer": return t$1("markerAnswer");
				case "duplicate-start": return t$1("markerDuplicateStart");
				case "duplicate-end": return t$1("markerDuplicateEnd");
				default: return kind;
			}
		}
		function MarkerRow({ row }) {
			const kind = String(row.kind ?? "");
			const accent = kind === "answer" ? "var(--dsw-alias-state-success-primary)" : kind === "question" ? "var(--dsw-alias-state-business-primary)" : "var(--dsw-alias-label-tertiary)";
			row.tool;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					...rowStyle$2,
					borderLeft: `3px solid ${accent}`,
					paddingLeft: 10
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						fontSize: 11,
						color: "var(--dsw-alias-label-tertiary)",
						textTransform: "uppercase",
						letterSpacing: .4
					},
					children: markerLabel(kind)
				}), typeof row.text === "string" && row.text.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					style: {
						marginTop: 6,
						fontSize: 14.5,
						color: "var(--dsw-alias-label-primary)",
						whiteSpace: "pre-wrap",
						lineHeight: 1.6
					},
					children: row.text
				})]
			});
		}
		function WritesGroup({ rows }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					...rowStyle$2,
					background: "var(--dsw-alias-bg-layer-1, transparent)"
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollapseHeader, {
					label: t$1("writesGroup", { n: rows.length }),
					defaultOpen: true,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 2
						},
						children: rows.map((row, index) => {
							const name = String(row.name);
							if (row.deleted === true) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								id: `set-${name}`,
								style: {
									display: "flex",
									alignItems: "baseline",
									gap: 8,
									width: "100%",
									boxSizing: "border-box",
									...isZebra(index) ? zebraRow : {}
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: {
											color: "var(--dsw-alias-label-tertiary)",
											...codeFont$1,
											fontSize: 14
										},
										children: name
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: { color: "var(--dsw-alias-label-tertiary)" },
										children: t$1("deleted")
									}),
									typeof row.rev === "number" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										style: {
											color: "var(--dsw-alias-label-tertiary)",
											fontSize: 12.5
										},
										children: ["rev ", row.rev]
									})
								]
							}, row.seq);
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								id: `set-${name}`,
								style: {
									display: "flex",
									gap: 8,
									alignItems: "center",
									width: "100%",
									boxSizing: "border-box"
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: {
										flex: "1 1 auto",
										minWidth: 0
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RowNode, {
										label: name,
										value: row.value,
										banded: isZebra(index)
									})
								}), typeof row.rev === "number" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									style: {
										color: "var(--dsw-alias-label-tertiary)",
										fontSize: 12.5,
										flex: "none"
									},
									children: ["rev ", row.rev]
								})]
							}, row.seq);
						})
					})
				})
			});
		}
		function ReadsGroup({ rows }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					...rowStyle$2,
					background: "var(--dsw-alias-bg-layer-1, transparent)"
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollapseHeader, {
					label: t$1("readsGroup", { n: rows.length }),
					defaultOpen: true,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 2
						},
						children: rows.map((row, index) => {
							const name = String(row.name);
							return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									gap: 8,
									alignItems: "center",
									width: "100%",
									boxSizing: "border-box"
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: {
										flex: "1 1 auto",
										minWidth: 0
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RowNode, {
										label: name,
										value: row.value,
										banded: isZebra(index)
									})
								})
							}, row.seq);
						})
					})
				})
			});
		}
		function FailuresGroup({ rows }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					...rowStyle$2,
					borderColor: "var(--dsw-alias-state-error-primary)",
					background: "var(--dsw-alias-bg-layer-1, transparent)"
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CollapseHeader, {
					label: t$1("failuresGroup", { n: rows.length }),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: 2
						},
						children: rows.map((row, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								fontSize: 14,
								width: "100%",
								boxSizing: "border-box",
								...isZebra(index) ? zebraRow : {}
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									gap: 8,
									alignItems: "center"
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										style: {
											...codeFont$1,
											color: "var(--dsw-alias-label-tertiary)"
										},
										children: ["#", row.seq]
									}),
									typeof row.solver === "string" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: {
											...codeFont$1,
											fontSize: 13.5
										},
										children: row.solver
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: {
											padding: "0 6px",
											borderRadius: 999,
											border: "1px solid var(--dsw-alias-state-error-primary)",
											color: "var(--dsw-alias-state-error-primary)",
											fontSize: 12
										},
										children: String(row.code)
									})
								]
							}), typeof row.error === "string" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									marginTop: 4,
									color: "var(--dsw-alias-label-secondary)",
									lineHeight: 1.5,
									wordBreak: "break-word"
								},
								children: row.error
							})]
						}, row.seq))
					})
				})
			});
		}
		/**
		* A successful call renders as its own card titled like the writes/reads
		* groups. Collapsed, the summary shows the localized "call" title followed by
		* the solver name; expanded, the body opens with two meta lines — the solver
		* and the target slot — and then the arguments and result.
		*/
		function CallRow({ row }) {
			const [open, setOpen] = (0, react.useState)(true);
			const args = row.args ?? {};
			const refs = [];
			referencedSlots(row.args, refs);
			const solver = typeof row.solver === "string" ? row.solver : row.tool;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					...rowStyle$2,
					background: "var(--dsw-alias-bg-layer-1, transparent)"
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
					open,
					style: { fontSize: 14.5 },
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", {
						onClick: (event) => {
							event.preventDefault();
							setOpen(!open);
						},
						style: {
							cursor: "pointer",
							color: "var(--dsw-alias-label-primary)",
							fontWeight: 600,
							marginBottom: 6
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							style: {
								display: "inline-flex",
								alignItems: "baseline",
								gap: 8,
								flexWrap: "wrap"
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t$1("callLabel") }), !open && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: {
									fontWeight: 400,
									color: "var(--dsw-alias-label-secondary)",
									...codeFont$1,
									fontSize: 13.5
								},
								children: solver
							})]
						})
					}), open && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							marginTop: 4,
							display: "flex",
							flexDirection: "column",
							gap: 2
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MetaLine, {
								label: t$1("callSolver"),
								value: solver,
								banded: false
							}),
							typeof row.target === "string" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MetaLine, {
								label: t$1("callTarget"),
								value: row.target,
								banded: false,
								children: typeof row.rev === "number" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									style: {
										color: "var(--dsw-alias-label-tertiary)",
										fontSize: 12.5
									},
									children: ["rev ", row.rev]
								})
							}),
							Object.entries(args).map(([name, value], index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RowNode, {
								label: name,
								value,
								banded: isZebra(index)
							}, name)),
							refs.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									marginTop: 6,
									display: "flex",
									gap: 6,
									flexWrap: "wrap"
								},
								children: refs.map((name) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									title: t$1("jumpToSet", { name }),
									onClick: () => document.getElementById(`set-${name}`)?.scrollIntoView({
										behavior: "smooth",
										block: "center"
									}),
									style: {
										...codeFont$1,
										padding: "1px 8px",
										borderRadius: 999,
										border: "1px solid var(--dsw-alias-label-tertiary)",
										background: "none",
										color: "var(--dsw-alias-label-primary)",
										cursor: "pointer",
										fontSize: 12.5
									},
									children: ["@", name]
								}, name))
							}),
							row.result !== void 0 && row.result !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									marginTop: 8,
									display: "flex",
									flexDirection: "column",
									gap: 2
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: {
										fontSize: 12.5,
										color: "var(--dsw-alias-label-tertiary)",
										textTransform: "uppercase",
										letterSpacing: .4
									},
									children: t$1("callResult")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RowNode, { value: row.result })]
							})
						]
					})]
				})
			});
		}
		/** One label/value line used for the solver and target rows of a call card; banded rows get the zebra stripe. */
		function MetaLine({ label, value, banded, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "baseline",
					gap: 8,
					fontSize: 14.5,
					width: "100%",
					boxSizing: "border-box",
					...banded ? zebraRow : {}
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: {
							color: "var(--dsw-alias-label-secondary)",
							minWidth: 64,
							fontSize: 13.5
						},
						children: label
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: {
							color: "var(--dsw-alias-label-primary)",
							wordBreak: "break-word",
							...codeFont$1,
							fontSize: 13.5
						},
						children: value
					}),
					children
				]
			});
		}
		function EventRow({ row }) {
			const label = `${row.tool}${typeof row.name === "string" ? ` ${row.name}` : ""}`;
			const hasValue = row.value !== void 0 && row.value !== null;
			if (hasValue && isExpandable(row.value)) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					...rowStyle$2,
					padding: "6px 12px"
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RowNode, {
					label,
					value: row.value
				})
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					...rowStyle$2,
					padding: "6px 12px"
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					style: {
						...codeFont$1,
						color: "var(--dsw-alias-label-secondary)",
						fontSize: 14
					},
					children: [label, hasValue ? ` = ${displayValue(row.value)}` : ""]
				})
			});
		}
		function CollapseHeader({ label, children, defaultOpen = false }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
				open: defaultOpen,
				style: { fontSize: 14.5 },
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", {
					style: {
						cursor: "pointer",
						color: "var(--dsw-alias-label-primary)",
						fontWeight: 600,
						marginBottom: 6
					},
					children: label
				}), children]
			});
		}
		//#endregion
		//#region src/client/records.tsx
		/**
		* ElectroLab record list page.
		* The list reads the host's /records-index (a projection of record-index.jsonl);
		* clicking a row opens the record's trace timeline (record-detail.tsx).
		*/
		const INDEX_ENDPOINT = "/api/dsh-electro-lab/records-index";
		const RECORD_ENDPOINT = "/api/dsh-electro-lab/records/";
		const POLL_MS$1 = 5e3;
		const rowStyle$1 = {
			padding: "10px 12px",
			borderRadius: 6,
			border: "1px solid var(--dsw-alias-border-l2)"
		};
		/** Danger action button (delete …). */
		const dangerButtonStyle = {
			padding: "4px 12px",
			borderRadius: 6,
			border: "1px solid var(--dsw-alias-state-error-primary)",
			background: "none",
			color: "var(--dsw-alias-state-error-primary)",
			cursor: "pointer",
			fontSize: 13,
			fontWeight: 600
		};
		/** Neutral action button (select mode toggle …). */
		const modeButtonStyle = {
			padding: "3px 10px",
			borderRadius: 6,
			border: "1px solid var(--dsw-alias-label-tertiary)",
			background: "none",
			color: "var(--dsw-alias-label-primary)",
			cursor: "pointer",
			fontSize: 12.5,
			fontWeight: 600
		};
		function formatTime(time) {
			return new Date(time).toLocaleString(void 0, {
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit"
			});
		}
		/** Record list page: render from the index (title = question); unsealed rows are marked incomplete; polls every 5s. */
		function RecordsTab() {
			useAppLocale();
			const [rows, setRows] = (0, react.useState)(null);
			const [failed, setFailed] = (0, react.useState)(false);
			const [selectedId, setSelectedId] = (0, react.useState)(null);
			const [selectMode, setSelectMode] = (0, react.useState)(false);
			const [selected, setSelected] = (0, react.useState)(() => /* @__PURE__ */ new Set());
			const [confirmDelete, setConfirmDelete] = (0, react.useState)(false);
			const [deleting, setDeleting] = (0, react.useState)(false);
			const [deleteError, setDeleteError] = (0, react.useState)(null);
			const [refreshTick, setRefreshTick] = (0, react.useState)(0);
			/** Enter select mode (fresh selection) or leave it (clear the selection). */
			const switchSelectMode = (next) => {
				setSelectMode(next);
				if (!next) setSelected(/* @__PURE__ */ new Set());
			};
			(0, react.useEffect)(() => {
				if (selectedId !== null) return;
				let alive = true;
				const load = async () => {
					try {
						const res = await fetch(INDEX_ENDPOINT);
						if (!res.ok) throw new Error(`records-index endpoint returned ${res.status}`);
						const body = await res.json();
						if (!alive) return;
						setRows(body.rows);
						setFailed(false);
					} catch {
						if (alive) setFailed(true);
					}
				};
				load();
				const timer = setInterval(() => void load(), POLL_MS$1);
				return () => {
					alive = false;
					clearInterval(timer);
				};
			}, [selectedId, refreshTick]);
			if (selectedId !== null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RecordDetail, {
				id: selectedId,
				onBack: () => setSelectedId(null)
			});
			if (failed && rows === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: rowStyle$1,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: { color: "var(--dsw-alias-label-secondary)" },
					children: t$1("unreachable")
				})
			});
			const items = [...rows ?? []].sort((a, b) => b.openedAt - a.openedAt);
			if (items.length === 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: rowStyle$1,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: { color: "var(--dsw-alias-label-secondary)" },
					children: t$1("emptyHint")
				})
			});
			const allSelected = items.every((row) => selected.has(row.id));
			const toggle = (id) => {
				setSelected((prev) => {
					const next = new Set(prev);
					if (next.has(id)) next.delete(id);
					else next.add(id);
					return next;
				});
			};
			const toggleAll = () => {
				setSelected((prev) => allSelected ? /* @__PURE__ */ new Set() : new Set(items.map((row) => row.id)));
			};
			const closeConfirm = () => {
				if (deleting) return;
				setConfirmDelete(false);
				setDeleteError(null);
			};
			const runDelete = async () => {
				setDeleting(true);
				setDeleteError(null);
				const targets = [...selected];
				const outcomes = await Promise.all(targets.map(async (id) => {
					try {
						const res = await fetch(`${RECORD_ENDPOINT}${encodeURIComponent(id)}`, { method: "DELETE" });
						if (res.ok) return {
							id,
							ok: true
						};
						return {
							id,
							ok: false,
							error: (await res.json().catch(() => null))?.error ?? `HTTP ${res.status}`
						};
					} catch {
						return {
							id,
							ok: false,
							error: "network"
						};
					}
				}));
				const deletedIds = new Set(outcomes.filter((o) => o.ok).map((o) => o.id));
				const failures = outcomes.filter((o) => !o.ok);
				setSelected((prev) => new Set([...prev].filter((id) => !deletedIds.has(id))));
				if (failures.length > 0) setDeleteError(t$1("deleteFailed", {
					n: failures.length,
					message: failures[0].error ?? ""
				}));
				else setConfirmDelete(false);
				setDeleting(false);
				setRefreshTick((tick) => tick + 1);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 10
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							gap: 8
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 10
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								style: selectMode ? {
									...modeButtonStyle,
									color: "var(--dsw-alias-state-business-primary)",
									borderColor: "var(--dsw-alias-state-business-primary)"
								} : modeButtonStyle,
								onClick: () => switchSelectMode(!selectMode),
								children: selectMode ? t$1("exitSelectMode") : t$1("enterSelectMode")
							}), selectMode && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								style: {
									display: "flex",
									alignItems: "center",
									gap: 6,
									fontSize: 12.5,
									color: "var(--dsw-alias-label-primary)",
									cursor: "pointer"
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: allSelected,
									onChange: toggleAll,
									style: { accentColor: "var(--dsw-alias-state-business-primary)" }
								}), t$1("selectAll")]
							})]
						}), selectMode && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 8,
								flex: "none"
							},
							children: [selected.size > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: {
									fontSize: 12,
									color: "var(--dsw-alias-label-secondary)"
								},
								children: t$1("selectedCount", { n: selected.size })
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: selected.size === 0,
								style: selected.size === 0 ? {
									...dangerButtonStyle,
									opacity: .4,
									cursor: "default"
								} : dangerButtonStyle,
								onClick: () => {
									setDeleteError(null);
									setConfirmDelete(true);
								},
								children: t$1("deleteSelected")
							})]
						})]
					}),
					items.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8
						},
						children: [selectMode && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "checkbox",
							"aria-label": t$1("selectRow"),
							checked: selected.has(row.id),
							onChange: () => toggle(row.id),
							style: {
								accentColor: "var(--dsw-alias-state-business-primary)",
								flex: "none"
							}
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => selectMode ? toggle(row.id) : setSelectedId(row.id),
							style: {
								...rowStyle$1,
								textAlign: "left",
								cursor: "pointer",
								background: "none",
								width: "100%",
								font: "inherit",
								color: "inherit",
								flex: "1 1 auto"
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									gap: 8,
									alignItems: "center"
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: {
										color: "var(--dsw-alias-label-primary)",
										fontSize: 13,
										fontWeight: 600,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										flex: 1,
										minWidth: 0
									},
									children: row.question || row.id
								}), row.sealedAt === null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: {
										padding: "1px 7px",
										borderRadius: 999,
										fontSize: 11,
										border: "1px solid var(--dsw-alias-state-warn-primary)",
										color: "var(--dsw-alias-state-warn-primary)",
										flex: "none"
									},
									children: t$1("incomplete")
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									marginTop: 4,
									color: "var(--dsw-alias-label-secondary)",
									fontSize: 12
								},
								children: formatTime(row.openedAt)
							})]
						})]
					}, row.id)),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Dialog, {
						open: confirmDelete,
						title: t$1("deleteSelected"),
						width: 360,
						onClose: closeConfirm,
						footer: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GhostButton, {
							onClick: closeConfirm,
							children: t$1("cancel")
						}, "cancel"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							style: dangerButtonStyle,
							disabled: deleting,
							onClick: () => void runDelete(),
							children: t$1("delete")
						}, "delete")],
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 12.5,
									color: "var(--dsw-alias-label-primary)"
								},
								children: t$1("deleteRecordsConfirm", { n: selected.size })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									marginTop: 6,
									fontSize: 12,
									color: "var(--dsw-alias-label-secondary)"
								},
								children: t$1("irreversible")
							}),
							deleteError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									marginTop: 8,
									fontSize: 12,
									color: "var(--dsw-alias-state-error-primary)",
									lineHeight: 1.5,
									wordBreak: "break-word"
								},
								children: deleteError
							})
						]
					})
				]
			});
		}
		/** The lowercase kind names (derived from the enum, no drift). Pure — usable from the browser. */
		const QUANTITY_KIND_NAMES = Object.values(/* @__PURE__ */ function(QuantityKind) {
			QuantityKind["Time"] = "time";
			QuantityKind["Length"] = "length";
			QuantityKind["Mass"] = "mass";
			QuantityKind["Current"] = "current";
			QuantityKind["Temperature"] = "temperature";
			QuantityKind["AmountOfSubstance"] = "amount-of-substance";
			QuantityKind["LuminousIntensity"] = "luminous-intensity";
			QuantityKind["Frequency"] = "frequency";
			QuantityKind["Resistance"] = "resistance";
			QuantityKind["Capacitance"] = "capacitance";
			QuantityKind["Inductance"] = "inductance";
			QuantityKind["Voltage"] = "voltage";
			QuantityKind["Power"] = "power";
			QuantityKind["Angle"] = "angle";
			QuantityKind["Pressure"] = "pressure";
			QuantityKind["Energy"] = "energy";
			QuantityKind["Log"] = "log";
			QuantityKind["None"] = "none";
			return QuantityKind;
		}({}));
		//#endregion
		//#region src/client/external-solvers.tsx
		/**
		* ElectroLab External solvers tab: one page with every external solver
		* declaration (external-solvers.jsonl), read through the
		* `/api/dsh-electro-lab/external-solvers` endpoint and polled while the tab
		* is open. Declarations are edited through a guided form (add/edit dialog)
		* or through the LLM manager tools (external_solver_add/update/delete); both
		* paths only register the tools at the next host restart, so the dirty bit
		* returned by the endpoint drives the pending-restart banner. Saving a
		* declaration IS the authorization for its endpoint — the form shows the
		* reach of the http transport in warning text before the save button.
		*
		* The form covers the whole declaration language except transport headers
		* and shapes unrepresentable in the row editors (deeply nested arrays or
		* returns structures) — those are preserved verbatim on edit and never shown
		* as raw JSON. Returns has its own guided editor (void / simple leaves /
		* object fields / array items).
		*/
		const EXTERNAL_ENDPOINT = "/api/dsh-electro-lab/external-solvers";
		const POLL_MS = 5e3;
		/** The transport target line: "http · <url>". */
		function transportLine(tool) {
			const options = tool.transportOptions ?? {};
			return `http · ${typeof options.url === "string" ? options.url : ""}`;
		}
		const rowStyle = {
			padding: "10px 12px",
			borderRadius: 6,
			border: "1px solid var(--dsw-alias-border-l2)"
		};
		const headerButtonStyle = {
			padding: "4px 10px",
			fontSize: 13,
			color: "var(--dsw-alias-label-primary)",
			background: "none",
			border: "1px solid var(--dsw-alias-label-tertiary)",
			borderRadius: 6,
			cursor: "pointer"
		};
		const codeFont = {
			font: "11px ui-monospace, monospace",
			wordBreak: "break-all"
		};
		function ExternalSolversTab() {
			useAppLocale();
			const [response, setResponse] = (0, react.useState)(null);
			const [failed, setFailed] = (0, react.useState)(false);
			const [editor, setEditor] = (0, react.useState)(null);
			const [deleteTarget, setDeleteTarget] = (0, react.useState)(null);
			const [actionError, setActionError] = (0, react.useState)("");
			const [refreshTick, setRefreshTick] = (0, react.useState)(0);
			const [pendingRestart, setPendingRestart] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				let alive = true;
				const load = async () => {
					try {
						const res = await fetch(EXTERNAL_ENDPOINT);
						if (!res.ok) throw new Error(`external-solvers endpoint returned ${res.status}`);
						const body = await res.json();
						if (!alive) return;
						setResponse(body);
						setPendingRestart(body.restartRequired);
						setFailed(false);
					} catch {
						if (alive) setFailed(true);
					}
				};
				load();
				const timer = setInterval(() => void load(), POLL_MS);
				return () => {
					alive = false;
					clearInterval(timer);
				};
			}, [refreshTick]);
			if (failed && response === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: rowStyle,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: { color: "var(--dsw-alias-label-secondary)" },
					children: t$1("externalUnreachable")
				})
			});
			const tools = response?.solvers ?? [];
			const restartRequired = pendingRestart || (response?.restartRequired ?? false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 10
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							gap: 8
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							style: {
								color: "var(--dsw-alias-label-secondary)",
								fontSize: 12
							},
							children: [
								t$1("tabExternal"),
								" · ",
								tools.length
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PrimaryButton, {
							onClick: () => setEditor({ tool: null }),
							children: t$1("addExternalSolver")
						})]
					}),
					restartRequired && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							...rowStyle,
							borderColor: "var(--dsw-alias-state-warn-primary)",
							color: "var(--dsw-alias-state-warn-primary)"
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: { fontSize: 12 },
							children: t$1("restartRequired")
						})
					}),
					actionError.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							...rowStyle,
							borderColor: "var(--dsw-alias-state-error-primary)",
							color: "var(--dsw-alias-state-error-primary)"
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: { fontSize: 12 },
							children: actionError
						})
					}),
					tools.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: rowStyle,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: { color: "var(--dsw-alias-label-secondary)" },
							children: t$1("externalEmptyHint")
						})
					}) : tools.map((tool) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: rowStyle,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									gap: 8,
									alignItems: "center"
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: {
										color: "var(--dsw-alias-label-primary)",
										fontWeight: 600,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										flex: 1,
										minWidth: 0
									},
									children: tool.name
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									style: {
										display: "flex",
										gap: 6,
										alignItems: "center",
										flex: "none"
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												const next = {
													...tool,
													enabled: !tool.enabled
												};
												setActionError("");
												saveDeclaration(next, () => {
													setPendingRestart(true);
													setRefreshTick((tick) => tick + 1);
												}, (message) => setActionError(t$1("saveFailed", { message })));
											},
											style: {
												padding: "2px 8px",
												fontSize: 12,
												borderRadius: 999,
												border: "1px solid",
												borderColor: tool.enabled ? "var(--dsw-alias-state-success-primary)" : "var(--dsw-alias-label-tertiary)",
												background: tool.enabled ? "var(--dsw-alias-interactive-bg-active)" : "none",
												color: tool.enabled ? "var(--dsw-alias-state-success-primary)" : "var(--dsw-alias-label-secondary)",
												cursor: "pointer"
											},
											children: tool.enabled ? t$1("enabled") : t$1("disabled")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											style: headerButtonStyle,
											onClick: () => setEditor({ tool }),
											children: t$1("editSolver")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setDeleteTarget(tool),
											style: {
												...headerButtonStyle,
												color: "var(--dsw-alias-state-error-primary)",
												borderColor: "var(--dsw-alias-state-error-primary)"
											},
											children: t$1("deleteSolver")
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									marginTop: 4,
									color: "var(--dsw-alias-label-secondary)",
									fontSize: 12
								},
								children: tool.description
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: {
									marginTop: 4,
									color: "var(--dsw-alias-label-tertiary)",
									...codeFont
								},
								children: transportLine(tool)
							})
						]
					}, tool.name)),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(EditorDialog, {
						editor,
						onClose: () => setEditor(null),
						onSaved: () => {
							setPendingRestart(true);
							setEditor(null);
							setRefreshTick((tick) => tick + 1);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Dialog, {
						open: deleteTarget !== null,
						title: deleteTarget === null ? "" : t$1("deleteSolverTitle", { name: deleteTarget.name }),
						width: 360,
						onClose: () => setDeleteTarget(null),
						footer: deleteTarget === null ? void 0 : [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GhostButton, {
							onClick: () => setDeleteTarget(null),
							children: t$1("cancel")
						}, "cancel"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							style: {
								padding: "4px 12px",
								borderRadius: 6,
								border: "1px solid var(--dsw-alias-state-error-primary)",
								background: "none",
								color: "var(--dsw-alias-state-error-primary)",
								cursor: "pointer",
								fontSize: 13,
								fontWeight: 600
							},
							onClick: () => {
								const target = deleteTarget;
								setDeleteTarget(null);
								(async () => {
									try {
										const res = await fetch(`${EXTERNAL_ENDPOINT}?name=${encodeURIComponent(target.name)}`, { method: "DELETE" });
										if (res.ok) {
											const body = await res.json();
											setPendingRestart(body.restartRequired ?? true);
											setRefreshTick((tick) => tick + 1);
										}
									} catch {}
								})();
							},
							children: t$1("delete")
						}, "delete")],
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 12,
								color: "var(--dsw-alias-label-secondary)"
							},
							children: t$1("irreversible")
						})
					})
				]
			});
		}
		/** Save one declaration through the endpoint; `onSaved` runs on success, `onError` on a server-reported failure. */
		async function saveDeclaration(tool, onSaved, onError) {
			try {
				const encoded = btoa(JSON.stringify(tool)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
				const res = await fetch(`${EXTERNAL_ENDPOINT}?config=${encodeURIComponent(encoded)}`, { method: "PUT" });
				if (!res.ok) {
					let message = `http ${res.status}`;
					try {
						const body = await res.json();
						if (typeof body.error === "string" && body.error.length > 0) message = body.error;
					} catch {}
					onError(message);
					return;
				}
				onSaved();
			} catch (error) {
				onError(error instanceof Error ? error.message : String(error));
			}
		}
		/** Tool name rule (mirror of the host registry): lowercase start, a-z0-9_. */
		const NAME_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;
		/** Whether a leaf type carries a quantity kind. */
		const isQuantityType = (type) => type === "number" || type === "complex";
		/** Default form (new tool): object with no fields — saving yields an explicit spec. */
		function defaultReturnsForm() {
			return {
				mode: "object",
				kind: "none",
				itemType: "number",
				itemKind: "none",
				fields: [],
				unmodeled: false
			};
		}
		/** An editable simple leaf or array-item spec (no description/enum/required). */
		function parseLeaf(spec) {
			if (typeof spec !== "object" || spec === null) return void 0;
			const s = spec;
			if (s.type === "number" || s.type === "complex") {
				if (typeof s.kind !== "string" || !QUANTITY_KIND_NAMES.includes(s.kind)) return void 0;
				return {
					type: s.type,
					kind: s.kind
				};
			}
			if (s.type === "string" && s.enum === void 0) return {
				type: "string",
				kind: "none"
			};
			if (s.type === "boolean") return {
				type: "boolean",
				kind: "none"
			};
		}
		/** Parse existing returns into a form; undefined = unrepresentable (kept verbatim). */
		function parseReturnsForm(returns) {
			const fallback = () => ({
				...defaultReturnsForm(),
				unmodeled: true
			});
			if (returns === null) return {
				...defaultReturnsForm(),
				mode: "void"
			};
			if (typeof returns !== "object" || returns === null) return fallback();
			const r = returns;
			const empty = {
				kind: "none",
				itemType: "number",
				itemKind: "none"
			};
			switch (r.type) {
				case "string": return {
					...empty,
					mode: "string",
					fields: [],
					unmodeled: false
				};
				case "boolean": return {
					...empty,
					mode: "boolean",
					fields: [],
					unmodeled: false
				};
				case "number":
				case "complex":
					if (typeof r.kind !== "string" || !QUANTITY_KIND_NAMES.includes(r.kind)) return fallback();
					return {
						...empty,
						mode: r.type,
						kind: r.kind,
						fields: [],
						unmodeled: false
					};
				case "array": {
					const item = parseLeaf(r.items);
					if (item === void 0) return fallback();
					return {
						...empty,
						mode: "array",
						itemType: item.type,
						itemKind: item.kind,
						fields: [],
						unmodeled: false
					};
				}
				case "object": {
					if (typeof r.fields !== "object" || r.fields === null || Array.isArray(r.fields)) return fallback();
					const fields = [];
					for (const [name, spec] of Object.entries(r.fields)) {
						const leaf = parseLeaf(spec);
						if (leaf !== void 0) {
							fields.push({
								id: fields.length,
								name,
								type: leaf.type,
								kind: leaf.kind,
								itemType: "number",
								itemKind: "none"
							});
							continue;
						}
						if (typeof spec === "object" && spec !== null && spec.type === "array") {
							const item = parseLeaf(spec.items);
							if (item === void 0) return fallback();
							fields.push({
								id: fields.length,
								name,
								type: "array",
								kind: "none",
								itemType: item.type,
								itemKind: item.kind
							});
							continue;
						}
						return fallback();
					}
					return {
						...empty,
						mode: "object",
						fields,
						unmodeled: false
					};
				}
				default: return fallback();
			}
		}
		/** One leaf as a spec: a quantity says which set it takes (complex takes a real too), everything else is bare. */
		function buildLeafSpec(type, kind) {
			return isQuantityType(type) ? {
				type,
				kind
			} : { type };
		}
		/** Build a spec from a leaf/array row (shared by fields and array items). */
		function buildReturnsLeaf(row) {
			if (row.type === "array") return {
				type: "array",
				items: buildLeafSpec(row.itemType, row.itemKind)
			};
			return buildLeafSpec(row.type, row.kind);
		}
		/** Form → returns spec; null = void. */
		function buildReturnsSpec(form) {
			switch (form.mode) {
				case "void": return null;
				case "string":
				case "boolean": return { type: form.mode };
				case "number":
				case "complex": return {
					type: form.mode,
					kind: form.kind
				};
				case "array": return {
					type: "array",
					items: buildLeafSpec(form.itemType, form.itemKind)
				};
				case "object": {
					const fields = {};
					for (const row of form.fields) fields[row.name.trim()] = buildReturnsLeaf(row);
					return {
						type: "object",
						fields
					};
				}
			}
		}
		/** Parse one parameter spec into an editable row; undefined = keep verbatim. */
		function parseParamRow(name, spec, id) {
			if (typeof spec !== "object" || spec === null) return void 0;
			const s = spec;
			const base = {
				id,
				name,
				kind: "none",
				itemType: "complex",
				itemKind: "none",
				enumText: "",
				description: typeof s.description === "string" ? s.description : "",
				required: s.required === true
			};
			switch (s.type) {
				case "number":
				case "complex":
					if (typeof s.kind !== "string" || !QUANTITY_KIND_NAMES.includes(s.kind)) return void 0;
					return {
						...base,
						type: s.type,
						kind: s.kind
					};
				case "string": {
					if (s.enum !== void 0 && (!Array.isArray(s.enum) || s.enum.some((item) => typeof item !== "string"))) return void 0;
					const enumText = Array.isArray(s.enum) ? s.enum.join(", ") : "";
					return {
						...base,
						type: "string",
						enumText
					};
				}
				case "boolean": return {
					...base,
					type: "boolean"
				};
				case "array": {
					if (typeof s.items !== "object" || s.items === null) return void 0;
					const items = s.items;
					if (items.type === "number" || items.type === "complex") {
						if (typeof items.kind !== "string" || !QUANTITY_KIND_NAMES.includes(items.kind)) return void 0;
						return {
							...base,
							type: "array",
							itemType: items.type,
							itemKind: items.kind
						};
					}
					if (items.type === "string" && items.enum === void 0) return {
						...base,
						type: "array",
						itemType: "string"
					};
					if (items.type === "boolean") return {
						...base,
						type: "array",
						itemType: "boolean"
					};
					return;
				}
				default: return;
			}
		}
		/** Build the spec JSON of one editable row. */
		function buildParamSpec(row) {
			const spec = {};
			switch (row.type) {
				case "number":
				case "complex":
					spec.type = row.type;
					spec.kind = row.kind;
					break;
				case "string":
					spec.type = "string";
					{
						const entries = row.enumText.split(",").map((item) => item.trim()).filter((item) => item.length > 0);
						if (entries.length > 0) spec.enum = entries;
					}
					break;
				case "boolean":
					spec.type = "boolean";
					break;
				case "array":
					spec.type = "array";
					spec.items = buildLeafSpec(row.itemType, row.itemKind);
			}
			const description = row.description.trim();
			if (description.length > 0) spec.description = description;
			if (row.required) spec.required = true;
			return spec;
		}
		/** Seed the form from a declaration (or defaults for a new tool). */
		function seedForm(tool) {
			const options = tool?.transportOptions ?? {};
			const rows = [];
			const unmodeled = [];
			for (const [key, spec] of Object.entries(tool?.parameters ?? {})) {
				const row = parseParamRow(key, spec, rows.length);
				if (row !== void 0) rows.push(row);
				else unmodeled.push(key);
			}
			const readString = (key) => typeof options[key] === "string" ? String(options[key]) : "";
			return {
				name: tool?.name ?? "",
				description: tool?.description ?? "",
				enabled: tool?.enabled !== false,
				url: readString("url"),
				timeoutMs: typeof tool?.timeoutMs === "number" ? String(tool.timeoutMs) : "",
				rows,
				unmodeled,
				returns: tool === null ? defaultReturnsForm() : parseReturnsForm(tool.returns)
			};
		}
		/** Parse one positive integer option field; empty = absent, non-numeric/≤0 = NaN. */
		function parsePositive(text) {
			const trimmed = text.trim();
			if (trimmed.length === 0) return void 0;
			const value = Number(trimmed);
			return Number.isFinite(value) && value > 0 ? value : NaN;
		}
		/** Rebuild the declaration JSON from the form; unknown fields survive edits. */
		function buildConfig(state, original) {
			const base = original !== null ? { ...original } : {};
			delete base.parameters;
			delete base.transport;
			delete base.transportOptions;
			delete base.timeoutMs;
			delete base.returns;
			const config = {
				...base,
				name: state.name.trim(),
				description: state.description.trim(),
				enabled: state.enabled
			};
			if (!state.returns.unmodeled) config.returns = buildReturnsSpec(state.returns);
			else if (original?.returns !== void 0) config.returns = original.returns;
			const timeout = parsePositive(state.timeoutMs);
			if (timeout !== void 0 && Number.isNaN(timeout)) config.timeoutMs = state.timeoutMs;
			else if (timeout !== void 0) config.timeoutMs = timeout;
			else delete config.timeoutMs;
			const options = original?.transportOptions ?? {};
			config.transport = "http";
			config.transportOptions = {
				...typeof options === "object" && options !== null ? options : {},
				url: state.url.trim()
			};
			const parameters = {};
			for (const key of state.unmodeled) {
				const spec = (original?.parameters ?? {})[key];
				if (spec !== void 0) parameters[key] = spec;
			}
			for (const row of state.rows) parameters[row.name.trim()] = buildParamSpec(row);
			config.parameters = parameters;
			return config;
		}
		/** Client-side checks (the host re-validates on save); returns translated messages. */
		function validateForm(state) {
			const errors = [];
			if (!NAME_PATTERN.test(state.name.trim())) errors.push(t$1("invalidName"));
			if (!/^https?:\/\/.+/.test(state.url.trim())) errors.push(t$1("urlRequired"));
			const numberFields = [["timeoutMs", t$1("timeoutLabel")]];
			for (const [key, label] of numberFields) {
				const text = String(state[key]);
				if (text.trim().length === 0) continue;
				const parsed = parsePositive(text);
				if (parsed !== void 0 && Number.isNaN(parsed)) errors.push(t$1("positiveNumberRequired", { label }));
			}
			const seen = /* @__PURE__ */ new Set();
			for (const row of state.rows) {
				const name = row.name.trim();
				if (!NAME_PATTERN.test(name)) errors.push(t$1("invalidParamName", { name }));
				else if (seen.has(name)) errors.push(t$1("duplicateParamName", { name }));
				else seen.add(name);
			}
			if (state.returns.mode === "object" && !state.returns.unmodeled) {
				const fieldNames = /* @__PURE__ */ new Set();
				for (const row of state.returns.fields) {
					const name = row.name.trim();
					if (name.length === 0) errors.push(t$1("emptyFieldName"));
					else if (fieldNames.has(name)) errors.push(t$1("duplicateFieldName", { name }));
					else fieldNames.add(name);
				}
			}
			return errors;
		}
		const controlStyle = {
			width: "100%",
			boxSizing: "border-box",
			padding: "6px 8px",
			fontSize: 13,
			color: "var(--dsw-alias-label-primary)",
			background: "var(--dsw-specific-input-major)",
			border: "1px solid var(--dsw-alias-border-l2)",
			borderRadius: 6,
			outline: "none",
			minWidth: 0
		};
		const fieldLabelStyle = {
			fontSize: 11,
			color: "var(--dsw-alias-label-secondary)",
			whiteSpace: "nowrap"
		};
		/** One section of the form: a rounded card carrying its own header and fields. */
		const cardStyle = {
			display: "flex",
			flexDirection: "column",
			gap: 8,
			padding: "10px 12px",
			borderRadius: 10,
			background: "var(--dsw-alias-bg-layer-1)",
			border: "1px solid var(--dsw-alias-border-l1)"
		};
		/** A card header: the section title, its action on the right. */
		const cardHeaderStyle = {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			gap: 8,
			minHeight: 24
		};
		const cardTitleStyle = {
			fontSize: 12,
			fontWeight: 600,
			color: "var(--dsw-alias-label-secondary)"
		};
		/** One line of controls: every line keeps the same gap and baseline alignment. */
		const rowLineStyle = {
			display: "flex",
			gap: 8,
			alignItems: "flex-end"
		};
		/** One parameter or returned field: an outlined block inside its card. */
		const rowCardStyle = {
			display: "flex",
			flexDirection: "column",
			gap: 8,
			padding: 8,
			borderRadius: 8,
			border: "1px solid var(--dsw-alias-border-l1)"
		};
		/** A line kept for a hint whether or not it has text, so nothing below it moves. */
		const hintSlotStyle = {
			minHeight: 18,
			fontSize: 12,
			lineHeight: "18px",
			color: "var(--dsw-alias-label-tertiary)"
		};
		/** A field that stays in the layout while hidden: its line keeps its width and height. */
		function hiddenField(hidden) {
			return hidden ? { visibility: "hidden" } : {};
		}
		/** One labelled field: tiny label above the control, grows to fill its row. */
		function Field({ label, style, children }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 4,
					flex: 1,
					minWidth: 0,
					...style
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					style: fieldLabelStyle,
					children: label
				}), children]
			});
		}
		/** The add/edit dialog: a guided form — no raw JSON. */
		function EditorDialog({ editor, onClose, onSaved }) {
			useAppLocale();
			const [state, setState] = (0, react.useState)(() => seedForm(null));
			const [error, setError] = (0, react.useState)("");
			const [saving, setSaving] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				if (editor !== null) {
					setState(seedForm(editor.tool));
					setError("");
					setSaving(false);
				}
			}, [editor]);
			if (editor === null) return null;
			const set = (key, value) => {
				setState((prev) => ({
					...prev,
					[key]: value
				}));
			};
			const setRow = (id, patch) => {
				setState((prev) => ({
					...prev,
					rows: prev.rows.map((row) => row.id === id ? {
						...row,
						...patch
					} : row)
				}));
			};
			const addRow = () => {
				const id = state.rows.reduce((max, row) => Math.max(max, row.id), -1) + 1;
				set("rows", [...state.rows, {
					id,
					name: "",
					type: "complex",
					kind: "none",
					itemType: "complex",
					itemKind: "none",
					enumText: "",
					description: "",
					required: false
				}]);
			};
			const removeRow = (id) => {
				set("rows", state.rows.filter((row) => row.id !== id));
			};
			const setReturns = (patch) => set("returns", {
				...state.returns,
				...patch
			});
			const setReturnField = (id, patch) => set("returns", {
				...state.returns,
				fields: state.returns.fields.map((row) => row.id === id ? {
					...row,
					...patch
				} : row)
			});
			const addReturnField = () => {
				const id = state.returns.fields.reduce((max, row) => Math.max(max, row.id), -1) + 1;
				set("returns", {
					...state.returns,
					fields: [...state.returns.fields, {
						id,
						name: "",
						type: "number",
						kind: "none",
						itemType: "number",
						itemKind: "none"
					}]
				});
			};
			const removeReturnField = (id) => {
				set("returns", {
					...state.returns,
					fields: state.returns.fields.filter((row) => row.id !== id)
				});
			};
			const save = () => {
				const errors = validateForm(state);
				if (errors.length > 0) {
					setError(errors.join(" "));
					return;
				}
				setSaving(true);
				setError("");
				saveDeclaration(buildConfig(state, editor.tool), () => onSaved(), (message) => {
					setSaving(false);
					setError(t$1("saveFailed", { message }));
				});
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Dialog, {
				open: true,
				width: 620,
				height: 560,
				title: editor.tool === null ? t$1("addExternalSolver") : t$1("editExternalSolver"),
				onClose: () => {
					if (!saving) onClose();
				},
				footer: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GhostButton, {
					onClick: onClose,
					children: t$1("cancel")
				}, "cancel"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PrimaryButton, {
					disabled: saving,
					onClick: save,
					children: t$1("confirm")
				}, "save")],
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						gap: 12
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							style: cardStyle,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: cardHeaderStyle,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: cardTitleStyle,
										children: t$1("identityLabel")
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									style: rowLineStyle,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
										label: t$1("nameLabel"),
										style: { flex: 1.4 },
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "text",
											value: state.name,
											spellCheck: false,
											onChange: (event) => set("name", event.target.value),
											style: {
												...controlStyle,
												fontFamily: "ui-monospace, monospace"
											}
										})
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
										label: t$1("timeoutLabel"),
										style: { flex: 1 },
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "text",
											inputMode: "numeric",
											pattern: "[0-9]*",
											value: state.timeoutMs,
											onChange: (event) => set("timeoutMs", event.target.value.replace(/[^0-9]/g, "")),
											style: controlStyle
										})
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
									label: t$1("descriptionLabel"),
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "text",
										value: state.description,
										onChange: (event) => set("description", event.target.value),
										style: controlStyle
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: 6,
										fontSize: 13,
										color: "var(--dsw-alias-label-primary)",
										cursor: "pointer"
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: state.enabled,
										onChange: (event) => set("enabled", event.target.checked),
										style: { accentColor: "var(--dsw-alias-state-business-primary)" }
									}), t$1("enabledLabel")]
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							style: cardStyle,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: cardHeaderStyle,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: cardTitleStyle,
										children: t$1("endpointLabel")
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
									label: t$1("urlLabel"),
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "text",
										value: state.url,
										spellCheck: false,
										onChange: (event) => set("url", event.target.value),
										style: {
											...controlStyle,
											fontFamily: "ui-monospace, monospace"
										}
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: {
										...hintSlotStyle,
										color: "var(--dsw-alias-state-error-primary)"
									},
									children: state.url.trim().length > 0 ? t$1("warnHttp", { url: state.url.trim() }) : ""
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							style: cardStyle,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									style: cardHeaderStyle,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										style: cardTitleStyle,
										children: t$1("parametersLabel")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(GhostButton, {
										onClick: addRow,
										children: t$1("addParameter")
									})]
								}),
								state.rows.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									style: rowCardStyle,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											style: rowLineStyle,
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
													label: t$1("paramTypeLabel"),
													style: { flex: .8 },
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
														value: row.type,
														onChange: (event) => setRow(row.id, { type: event.target.value }),
														style: controlStyle,
														children: [
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "complex",
																children: "complex"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "number",
																children: "number"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "string",
																children: "string"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "boolean",
																children: "boolean"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "array",
																children: "array"
															})
														]
													})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
													label: t$1("paramKindLabel"),
													style: { flex: 1.2 },
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
														value: row.type === "array" ? row.itemKind : row.kind,
														disabled: !isQuantityType(row.type) && row.type !== "array",
														onChange: (event) => setRow(row.id, row.type === "array" ? { itemKind: event.target.value } : { kind: event.target.value }),
														style: {
															...controlStyle,
															opacity: !isQuantityType(row.type) && row.type !== "array" ? .5 : 1
														},
														children: QUANTITY_KIND_NAMES.map((kind) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: kind,
															children: kind
														}, kind))
													})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
													style: {
														display: "flex",
														alignItems: "center",
														gap: 4,
														fontSize: 12,
														color: "var(--dsw-alias-label-secondary)",
														cursor: "pointer",
														paddingBottom: 6,
														flex: "none"
													},
													children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
														type: "checkbox",
														checked: row.required,
														onChange: (event) => setRow(row.id, { required: event.target.checked }),
														style: { accentColor: "var(--dsw-alias-state-business-primary)" }
													}), t$1("paramRequiredLabel")]
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": t$1("removeParameter"),
													title: t$1("removeParameter"),
													onClick: () => removeRow(row.id),
													style: {
														flex: "none",
														border: "none",
														background: "none",
														color: "var(--dsw-alias-state-error-primary)",
														cursor: "pointer",
														fontSize: 14,
														padding: "2px 4px",
														marginBottom: 4
													},
													children: "✕"
												})
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											style: rowLineStyle,
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
													label: t$1("nameLabel"),
													style: { flex: 1.2 },
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
														type: "text",
														value: row.name,
														spellCheck: false,
														onChange: (event) => setRow(row.id, { name: event.target.value }),
														style: {
															...controlStyle,
															fontFamily: "ui-monospace, monospace"
														}
													})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
													label: t$1("paramItemsLabel"),
													style: {
														flex: 1,
														...hiddenField(row.type !== "array")
													},
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
														value: row.itemType,
														disabled: row.type !== "array",
														onChange: (event) => setRow(row.id, { itemType: event.target.value }),
														style: controlStyle,
														children: [
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "complex",
																children: "complex"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "number",
																children: "number"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "string",
																children: "string"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "boolean",
																children: "boolean"
															})
														]
													})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
													label: t$1("paramEnumLabel"),
													style: {
														flex: 1.4,
														...hiddenField(row.type !== "string")
													},
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
														type: "text",
														value: row.enumText,
														disabled: row.type !== "string",
														onChange: (event) => setRow(row.id, { enumText: event.target.value }),
														style: controlStyle
													})
												})
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
											label: t$1("paramDescriptionLabel"),
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
												type: "text",
												value: row.description,
												onChange: (event) => setRow(row.id, { description: event.target.value }),
												style: controlStyle
											})
										})
									]
								}, row.id)),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									style: hintSlotStyle,
									children: state.unmodeled.length > 0 ? `${t$1("unmodeledParams", { count: state.unmodeled.length })} ${state.unmodeled.join(", ")}` : ""
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							style: cardStyle,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: cardHeaderStyle,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: cardTitleStyle,
									children: t$1("returnsLabel")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(GhostButton, {
									onClick: addReturnField,
									disabled: state.returns.unmodeled || state.returns.mode !== "object",
									style: hiddenField(state.returns.unmodeled || state.returns.mode !== "object"),
									children: t$1("addReturnField")
								})]
							}), state.returns.unmodeled ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: hintSlotStyle,
								children: t$1("returnsPreserved")
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: 8
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										style: rowLineStyle,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
												label: t$1("returnsTypeLabel"),
												style: { flex: .9 },
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
													value: state.returns.mode,
													onChange: (event) => setReturns({ mode: event.target.value }),
													style: controlStyle,
													children: [
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "void",
															children: "void"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "string",
															children: "string"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "boolean",
															children: "boolean"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "number",
															children: "number"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "complex",
															children: "complex"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "object",
															children: "object"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "array",
															children: "array"
														})
													]
												})
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
												label: t$1("paramKindLabel"),
												style: {
													flex: 1,
													...hiddenField(state.returns.mode !== "number" && state.returns.mode !== "complex")
												},
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
													value: state.returns.kind,
													disabled: state.returns.mode !== "number" && state.returns.mode !== "complex",
													onChange: (event) => setReturns({ kind: event.target.value }),
													style: controlStyle,
													children: QUANTITY_KIND_NAMES.map((kind) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: kind,
														children: kind
													}, kind))
												})
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
												label: t$1("paramItemsLabel"),
												style: {
													flex: 1,
													...hiddenField(state.returns.mode !== "array")
												},
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
													value: state.returns.itemType,
													disabled: state.returns.mode !== "array",
													onChange: (event) => setReturns({ itemType: event.target.value }),
													style: controlStyle,
													children: [
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "number",
															children: "number"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "complex",
															children: "complex"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "string",
															children: "string"
														}),
														/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: "boolean",
															children: "boolean"
														})
													]
												})
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
												label: t$1("paramKindLabel"),
												style: {
													flex: 1,
													...hiddenField(state.returns.mode !== "array" || !isQuantityType(state.returns.itemType))
												},
												children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
													value: state.returns.itemKind,
													disabled: state.returns.mode !== "array" || !isQuantityType(state.returns.itemType),
													onChange: (event) => setReturns({ itemKind: event.target.value }),
													style: controlStyle,
													children: QUANTITY_KIND_NAMES.map((kind) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: kind,
														children: kind
													}, kind))
												})
											})
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										style: hintSlotStyle,
										children: state.returns.mode === "void" ? t$1("returnsVoidHint") : state.returns.mode === "object" && state.returns.fields.length === 0 ? t$1("returnsEmptyObjectHint") : ""
									}),
									state.returns.mode === "object" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(react_jsx_runtime.Fragment, { children: state.returns.fields.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										style: rowCardStyle,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											style: rowLineStyle,
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
													label: t$1("paramTypeLabel"),
													style: { flex: .8 },
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
														value: row.type,
														onChange: (event) => setReturnField(row.id, { type: event.target.value }),
														style: controlStyle,
														children: [
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "number",
																children: "number"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "complex",
																children: "complex"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "string",
																children: "string"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "boolean",
																children: "boolean"
															}),
															/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
																value: "array",
																children: "array"
															})
														]
													})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
													label: t$1("paramKindLabel"),
													style: { flex: 1.2 },
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
														value: row.type === "array" ? row.itemKind : row.kind,
														disabled: !isQuantityType(row.type) && row.type !== "array",
														onChange: (event) => setReturnField(row.id, row.type === "array" ? { itemKind: event.target.value } : { kind: event.target.value }),
														style: {
															...controlStyle,
															opacity: !isQuantityType(row.type) && row.type !== "array" ? .5 : 1
														},
														children: QUANTITY_KIND_NAMES.map((kind) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
															value: kind,
															children: kind
														}, kind))
													})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
													label: t$1("fieldNameLabel"),
													style: { flex: 1.4 },
													children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
														type: "text",
														value: row.name,
														spellCheck: false,
														onChange: (event) => setReturnField(row.id, { name: event.target.value }),
														style: {
															...controlStyle,
															fontFamily: "ui-monospace, monospace"
														}
													})
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": t$1("removeParameter"),
													title: t$1("removeParameter"),
													onClick: () => removeReturnField(row.id),
													style: {
														flex: "none",
														border: "none",
														background: "none",
														color: "var(--dsw-alias-state-error-primary)",
														cursor: "pointer",
														fontSize: 14,
														padding: "2px 4px",
														marginBottom: 4
													},
													children: "✕"
												})
											]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
											label: t$1("paramItemsLabel"),
											style: {
												flex: 1,
												...hiddenField(row.type !== "array")
											},
											children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
												value: row.itemType,
												disabled: row.type !== "array",
												onChange: (event) => setReturnField(row.id, { itemType: event.target.value }),
												style: controlStyle,
												children: [
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "number",
														children: "number"
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "complex",
														children: "complex"
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "string",
														children: "string"
													}),
													/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
														value: "boolean",
														children: "boolean"
													})
												]
											})
										})]
									}, row.id)) })
								]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								...hintSlotStyle,
								color: "var(--dsw-alias-state-error-primary)"
							},
							children: error
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/panel.tsx
		/**
		* ElectroLab panel: SSH-style main-area panel with settled run records.
		*
		* The product has no seat for a center-column takeover panel (the
		* conversation slot is single-occupant and external plugins cannot declare
		* slots), so — exactly like the SSH/task-board panels — the view mounts as a
		* container appended inside the center column at the DOM level, positioned
		* absolute over the conversation content, toggled by a data attribute on
		* <html>. The nav entry is a slot registration instead: `sidebar.footer.action`
		* (the additive seat beside Settings), which keeps the button in the same
		* sidebar-foot family as the SSH/task icons without DOM surgery.
		*/
		/** Tiny shared store: open state + subscription for the nav button and the panel.
		*  Methods never use `this`: they are passed around detached (React's
		*  useSyncExternalStore hands `subscribe` to the store), and a `this`-bound
		*  method would lose its receiver and crash on `this.listeners`. */
		const panelListeners = /* @__PURE__ */ new Set();
		const panelStore = {
			open: false,
			toggle() {
				panelStore.open = !panelStore.open;
				for (const listener of panelListeners) listener();
			},
			subscribe(listener) {
				panelListeners.add(listener);
				return () => {
					panelListeners.delete(listener);
				};
			}
		};
		const CONVERSATION_COLUMN_SELECTOR = "[data-pane=\"conversation\"], [class*=\"centerCol\"]";
		const ACTIVE_ATTR = "data-dsh-electrolab-active";
		/** Cross-plugin panel activation event (the SSH/task-board panels share it). */
		const ACTIVATE_EVENT = "dsh-panel-activate";
		const PANEL_NAME = "electrolab";
		/** Sidebar rows whose click returns the user to the session. */
		const SIDEBAR_ROW_SELECTOR = "[class*=\"sessionRow\"], [class*=\"projectRow\"], [class*=\"searchResultRow\"], [class*=\"searchResultWorkspace\"], [class*=\"newSession\"]";
		/**
		* Mount the panel inside the center column and wire open-state side effects:
		* the active attribute on <html>, cross-panel mutual exclusion, and closing
		* when the user picks another sidebar row. Returns one disposer that removes
		* the DOM, the React root and every listener.
		*/
		function mountElectroLabPanel() {
			const container = document.createElement("div");
			container.dataset.dshElectrolabView = "";
			container.style.display = "none";
			const overlayContainer = document.createElement("div");
			overlayContainer.style.cssText = "position: fixed; inset: 0; z-index: 95; pointer-events: none;";
			document.body.appendChild(overlayContainer);
			const overlayRoot = (0, react_dom_client.createRoot)(overlayContainer);
			overlayRoot.render(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(GenerationOverlay, {}));
			const style = document.createElement("style");
			style.textContent = `
    [data-pane="conversation"], [class*="centerCol"] { position: relative; }
    [data-dsh-electrolab-view] { position: absolute; inset: 0; z-index: 40;
      background: var(--dsw-alias-bg-base, #171a21); overflow: auto; }
    /* Visible scrollbars in both themes: the shell's scrollbar-bg-l2 is
       near-white in light themes, so label-tertiary is used — a solid color
       on dark and light backgrounds. Safe since the extension now scales the
       iframe with CSS zoom (relayout), not transform:scale (post-raster
       scaling that blurred everything). */
    [data-dsh-electrolab-view]::-webkit-scrollbar,
    [data-dsh-electrolab-view] ::-webkit-scrollbar { width: 10px; height: 10px; }
    [data-dsh-electrolab-view]::-webkit-scrollbar-track,
    [data-dsh-electrolab-view] ::-webkit-scrollbar-track { background: transparent; }
    [data-dsh-electrolab-view]::-webkit-scrollbar-thumb,
    [data-dsh-electrolab-view] ::-webkit-scrollbar-thumb {
      background: var(--dsw-alias-label-tertiary);
      border: 2px solid transparent;
      border-radius: 5px;
      background-clip: padding-box; }
    [data-dsh-electrolab-view]::-webkit-scrollbar-thumb:hover,
    [data-dsh-electrolab-view] ::-webkit-scrollbar-thumb:hover {
      background: var(--dsw-alias-label-primary); }
  `;
			document.head.appendChild(style);
			fetch("/api/dsh-electro-lab/directory-tree.css").then((res) => res.ok ? res.text() : "").then((css) => {
				if (css.length > 0) style.textContent += `\n${css}`;
			}).catch(() => {});
			let root;
			const tryPlace = () => {
				if (container.isConnected) return;
				const column = document.querySelector(CONVERSATION_COLUMN_SELECTOR);
				if (column === null) return;
				column.appendChild(container);
				root ??= (0, react_dom_client.createRoot)(container);
				root.render(/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ElectroLabPanel, {}));
			};
			const waitObserver = new MutationObserver(tryPlace);
			waitObserver.observe(document.body, {
				childList: true,
				subtree: true
			});
			const applyActive = () => {
				container.style.display = panelStore.open ? "block" : "none";
				if (panelStore.open) {
					evicting = true;
					try {
						for (const attr of Array.from(document.documentElement.attributes)) if (attr.name.startsWith("data-dsh-") && attr.name.endsWith("-active") && attr.name !== ACTIVE_ATTR) document.documentElement.removeAttribute(attr.name);
						document.dispatchEvent(new CustomEvent(ACTIVATE_EVENT, { detail: "taskboard" }));
						document.dispatchEvent(new CustomEvent(ACTIVATE_EVENT, { detail: "ssh" }));
					} finally {
						evicting = false;
					}
					document.documentElement.setAttribute(ACTIVE_ATTR, "");
					document.dispatchEvent(new CustomEvent(ACTIVATE_EVENT, { detail: PANEL_NAME }));
				} else document.documentElement.removeAttribute(ACTIVE_ATTR);
			};
			let evicting = false;
			const onOtherActivate = (event) => {
				if (evicting) return;
				if (event.detail !== PANEL_NAME && panelStore.open) panelStore.toggle();
			};
			const onClickSidebarRow = (event) => {
				if (!panelStore.open) return;
				const target = event.target;
				if (target !== null && target.closest(SIDEBAR_ROW_SELECTOR) !== null) panelStore.toggle();
			};
			const unsubscribeActive = panelStore.subscribe(applyActive);
			document.addEventListener(ACTIVATE_EVENT, onOtherActivate);
			document.addEventListener("click", onClickSidebarRow, true);
			applyActive();
			tryPlace();
			return () => {
				waitObserver.disconnect();
				document.removeEventListener(ACTIVATE_EVENT, onOtherActivate);
				document.removeEventListener("click", onClickSidebarRow, true);
				unsubscribeActive();
				style.remove();
				root?.unmount();
				container.remove();
				overlayRoot.unmount();
				overlayContainer.remove();
			};
		}
		const SIDEBAR_COLUMN_SELECTOR = "[data-pane=\"sidebar\"], [class*=\"sidebarCol\"]";
		const ENTRY_ATTR = "data-dsh-electrolab-entry";
		/** The rail family this entry joins, in shell order — placed after the last one. */
		const ENTRY_FAMILY = [
			"[data-dsh-taskboard-entry]",
			"[data-dsh-ssh-entry]",
			"[data-dsh-skill-explorer-entry]"
		];
		/** Wave-square glyph (Font Awesome, CC BY 4.0) — the ElectroLab identity, rendered like the shell's line icons. */
		const ENTRY_ICON = "<svg viewBox=\"0 0 512 512\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M64 96c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 288 96 0 0-128c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0 0 128c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-288-96 0 0 128c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0 0-128z\"/></svg>";
		/** Entry styles: the exact rules the SSH/task-board/skills entries use, self-contained.
		*  The collapsed variant keys off ANY ancestor whose class contains "collapsed"
		*  (the shell's rail carries e.g. "hHd-Xa_collapsed"); there is no stable
		*  [data-dsh-frame] attribute to hang a selector on. */
		const ENTRY_CSS = `
.dsh-elab-entry{box-sizing:border-box;width:100%;min-height:36px;color:var(--dsw-alias-label-secondary);cursor:pointer;white-space:nowrap;background:0 0;border:none;border-radius:8px;align-items:center;gap:10px;padding:0 10px;font-size:13px;display:flex}
.dsh-elab-entry:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-elab-entry[data-active]{background:var(--dsw-alias-interactive-bg-active);color:var(--dsw-alias-label-primary);font-weight:600}
.dsh-elab-entryIcon{flex:none;justify-content:center;align-items:center;width:24px;height:24px;display:inline-flex}
.dsh-elab-entryIcon svg{width:18px;height:18px;display:block}
.dsh-elab-entryLabel{text-overflow:ellipsis;overflow:hidden}
[class*="collapsed"] .dsh-elab-entry{border-radius:50%;justify-content:center;width:36px;min-height:36px;margin:0 auto 12px;padding:0}
[class*="collapsed"] .dsh-elab-entryLabel{display:none}
`;
		/**
		* Mount the nav entry into the sidebar rail exactly like the SSH/task-board/
		* skills panels: a button appended inside the sidebar column root, anchored
		* after the existing entry family, with self-healing observers that re-place
		* it when the shell re-renders. Returns one disposer that removes it.
		*/
		function mountElectroLabEntry() {
			const entry = document.createElement("button");
			entry.type = "button";
			entry.setAttribute(ENTRY_ATTR, "");
			entry.setAttribute("data-dsh-plugin", "electro-lab");
			entry.setAttribute("data-dsh-part", "sidebar-entry");
			entry.setAttribute("aria-label", "ElectroLab");
			entry.setAttribute("title", "ElectroLab");
			entry.className = "dsh-elab-entry";
			entry.innerHTML = `<span class="dsh-elab-entryIcon">${ENTRY_ICON}</span><span class="dsh-elab-entryLabel">ElectroLab</span>`;
			const style = document.createElement("style");
			style.textContent = ENTRY_CSS;
			document.head.appendChild(style);
			const syncActive = () => {
				if (panelStore.open) entry.dataset.active = "true";
				else delete entry.dataset.active;
			};
			entry.addEventListener("click", () => panelStore.toggle());
			const unsubscribeActive = panelStore.subscribe(syncActive);
			syncActive();
			let root;
			let placed = false;
			const sidebarRoot = () => {
				const column = document.querySelector(SIDEBAR_COLUMN_SELECTOR);
				if (column === null) return void 0;
				return column.querySelector("[class*=\"logoRow\"]")?.parentElement ?? column.firstElementChild;
			};
			const place = () => {
				const baseEl = root;
				if (baseEl === void 0) return false;
				const firstButton = baseEl.querySelector("button[class*=\"newSession\"]") ?? Array.from(baseEl.children).find((el) => el.tagName === "BUTTON");
				if (firstButton === void 0) return false;
				const row = firstButton.closest("[class*=\"logoRow\"]");
				const base = row !== null && row.parentElement === baseEl ? row : firstButton;
				const family = Array.from(baseEl.children).filter((el) => el instanceof HTMLElement && el.matches(ENTRY_FAMILY.join(", ")));
				const anchor = family.length > 0 ? family[family.length - 1].nextElementSibling : base.nextElementSibling;
				baseEl.insertBefore(entry, anchor);
				return true;
			};
			const rootObserver = new MutationObserver(() => {
				if (placed && entry.isConnected) return;
				if (root !== void 0 && !entry.isConnected) placed = false;
				tryPlace();
			});
			const tryPlace = () => {
				if (placed && entry.isConnected) return;
				root ??= sidebarRoot();
				if (root === void 0) return;
				if (!placed) placed = place();
				if (placed) rootObserver.observe(root, {
					childList: true,
					subtree: true
				});
			};
			const waitObserver = new MutationObserver(tryPlace);
			waitObserver.observe(document.body, {
				childList: true,
				subtree: true
			});
			tryPlace();
			return () => {
				waitObserver.disconnect();
				rootObserver.disconnect();
				unsubscribeActive();
				style.remove();
				entry.remove();
			};
		}
		const headerStyle = {
			display: "flex",
			alignItems: "center",
			gap: 10,
			padding: "10px 14px",
			borderBottom: "1px solid var(--dsw-alias-border-l2)",
			background: "var(--dsw-specific-sidebar-fill, #171a21)"
		};
		const backButtonStyle = {
			background: "none",
			border: "1px solid var(--dsw-alias-label-tertiary)",
			borderRadius: 6,
			color: "var(--dsw-alias-label-primary)",
			cursor: "pointer",
			fontSize: 13,
			display: "flex",
			alignItems: "center",
			gap: 6,
			padding: "4px 8px"
		};
		const tabBarStyle = {
			display: "flex",
			gap: 2,
			flex: "none",
			padding: "8px 14px 0",
			borderBottom: "1px solid var(--dsw-alias-border-l1)"
		};
		/** Active tab button, styled exactly like the dsh-ssh panel tabs (panel.module.css .tab + .tab[data-active]);
		*  only the selected tab carries the accent underline. */
		function tabButtonStyle(hovered, active) {
			return {
				padding: "7px 14px",
				fontSize: 13,
				color: active ? "var(--dsw-alias-label-primary)" : "var(--dsw-alias-label-secondary)",
				fontWeight: active ? 600 : 400,
				background: hovered ? "var(--dsw-alias-interactive-bg-hover)" : "transparent",
				border: "none",
				borderBottom: "2px solid",
				borderBottomColor: active ? "var(--dsw-alias-state-business-primary)" : "transparent",
				borderRadius: "6px 6px 0 0",
				cursor: "pointer",
				whiteSpace: "nowrap"
			};
		}
		/** One tab button: active styling plus a self-managed hover state. */
		function TabButton({ active, label, onClick }) {
			const [hovered, setHovered] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				role: "tab",
				"aria-selected": active,
				"data-active": active ? "" : void 0,
				"data-dsh-part": "tab",
				onClick,
				onMouseEnter: () => setHovered(true),
				onMouseLeave: () => setHovered(false),
				style: tabButtonStyle(hovered, active),
				children: label
			});
		}
		/** The panel body: title bar with a back-to-session button, tabs, content. */
		function ElectroLabPanel() {
			useAppLocale();
			const open = (0, react.useSyncExternalStore)(panelStore.subscribe, () => panelStore.open);
			const [backHover, setBackHover] = (0, react.useState)(false);
			const [tab, setTab] = (0, react.useState)("records");
			if (!open) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					height: "100%",
					background: "var(--dsw-alias-bg-base)",
					color: "var(--dsw-alias-label-primary)",
					font: "13px/1.5 var(--dsw-font-family)"
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: headerStyle,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-label": t$1("backToSession"),
							onClick: () => panelStore.toggle(),
							onMouseEnter: () => setBackHover(true),
							onMouseLeave: () => setBackHover(false),
							style: {
								...backButtonStyle,
								background: backHover ? "var(--dsw-alias-interactive-bg-hover)" : "none",
								borderColor: backHover ? "var(--dsw-alias-label-primary)" : "var(--dsw-alias-label-tertiary)"
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								style: {
									display: "inline-flex",
									alignItems: "center"
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconChevronLeft, { size: 16 })
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: { lineHeight: 1 },
								children: t$1("backToSession")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							style: {
								margin: 0,
								fontSize: 15
							},
							children: "ElectroLab"
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						role: "tablist",
						style: tabBarStyle,
						"data-dsh-part": "tab-bar",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TabButton, {
							active: tab === "records",
							label: t$1("tabRecords"),
							onClick: () => setTab("records")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TabButton, {
							active: tab === "external",
							label: t$1("tabExternal"),
							onClick: () => setTab("external")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							flex: 1,
							overflow: "auto",
							padding: 14
						},
						children: tab === "records" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RecordsTab, {}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExternalSolversTab, {})
					})
				]
			});
		}
		//#endregion
		//#region src/client/index.tsx
		/** Required services: the locale registry for the dual-language UI copy. */
		const inject = ["locale"];
		function apply(ctx) {
			ctx.effect(() => {
				try {
					return ctx.locale.register(LOCALE_NS, dictionaries);
				} catch {
					return () => {};
				}
			}, "dsh-electro-lab: dictionaries");
			installLocale(ctx.locale);
			ctx.effect(() => {
				const disposers = [mountElectroLabEntry(), mountElectroLabPanel()];
				return () => {
					for (const off of disposers) off();
				};
			}, "dsh-electro-lab: panel UI");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client-registry.js.map