import { homedir } from "node:os";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { appendFileSync, closeSync, copyFileSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, realpathSync, renameSync, rmSync, statSync, writeFileSync, writeSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { isIP } from "node:net";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { Complex } from "complex.js";
import { spawn } from "node:child_process";
//#region src/errors.ts
/**
* The unified tool-failure error.
*
* Every failure inside TypeScript is a throw: math kernels and lower layers
* throw whatever they want — the tool boundary (defineJsonTool) re-wraps
* any non-ToolError into a ToolError, so every tool call fails through one
* structured channel. Wire formats translate to throws at the edge (an
* external envelope `error` field becomes a ToolError in the transport).
*/
var ToolError = class extends Error {
	code;
	constructor(message, code = "TOOL_ERROR") {
		super(message);
		this.name = "ToolError";
		this.code = code;
	}
};
//#endregion
//#region src/log.ts
/**
* Plugin logging: one text line per event, two sinks (stdout, one file per host run).
*
* The file sink writes `<home>/logs/<YYYY-MM-DD_HH-mm-ss.SSS>.log` — one file per plugin mount, that
* is per host run — and nothing about a run is written anywhere else: logging does not touch the
* state file, because a log fact belongs to the log, not to the plugin's state.
*
* A line is `<timestamp> <LEVEL> <message>[ k=v …]`, for example
* `2025-06-14 12:03:41.882 WARN  something happened a=1 b="two words"`.
*
* The head is positional (timestamp, level label padded to 5, message); the tail is the
* `key=value` rendering of the object handed to the log call. Field values are JSON
* types only. The object itself may be anything (a class instance is fine) and is
* expanded exactly one level — own enumerable data properties, never the prototype
* chain, never a getter — while every value is atomized: a nested object or array
* becomes one compact-JSON token, never nested `k=v`. Rendering never recurses, which is
* what makes a whole object logged by accident visibly long while picked fields stay
* short. Logging a picked field set is the intended use.
*
* Outside that domain the renderer stays total and never throws: `undefined` drops the key, an
* Error renders as its message with its stack appended as `  | ` continuation lines, and a
* bigint, function, symbol or circular reference renders `[unserializable]`. One value is cut
* at VALUE_LIMIT characters.
*
* Reading a tail needs two rules, because whitespace and `=` are the only separators:
* read a key up to the first `=`; then, if the value starts with `"`, read to the next
* unescaped `"` — otherwise read to the next whitespace. A value therefore carries no
* whitespace unless quoted, and a message never contains `=`.
*
* Which messages a call site logs, and which fields it passes, are the call site's business —
* this module defines only the shape of a line and its file.
*
* Logging is disposable run-time diagnostics, never the engine's bookkeeping: the record
* trace is the authoritative account of a calculation, no record field is derived from a
* log line, and nothing record- or session-shaped (record id, sequence, job id) is logged
* as a key. Every write is guarded — a failing sink is disabled instead of throwing — and
* this module imports no engine, record or tool code (host side only; never bundled into
* the client).
*/
const LEVEL_LABEL = {
	["debug"]: "DEBUG",
	["info"]: "INFO",
	["warn"]: "WARN",
	["error"]: "ERROR",
	["off"]: "OFF"
};
const LEVEL_ORDER = {
	["debug"]: 0,
	["info"]: 1,
	["warn"]: 2,
	["error"]: 3,
	["off"]: 4
};
/** Longest atomized value: one huge object must not push a line past readability. */
const VALUE_LIMIT = 200;
/** Stack lines appended for an Error logged as a field value. */
const STACK_LIMIT = 10;
/** Continuation prefix: `grep -v '^  |'` turns a file back into one line per event. */
const CONTINUATION = "  | ";
/** Retention: run files kept under logs/ and the total size they may occupy. */
const KEEP_RUNS = 20;
const MAX_RUN_BYTES = 52428800;
/** A run file is named by its creation timestamp, so `ls` sorts runs by age; RUN_NAME is what retention owns. */
const RUN_SUFFIX = ".log";
const RUN_NAME = /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.\d{3}\.log$/;
/**
* Attempts to find a free run-file name before giving up. A failed exclusive create costs real time
* (~0.2 ms here), so this outlasts several system clock ticks even where a tick is 15 ms — while a
* clock that truly never advances still terminates instead of spinning forever.
*/
const CREATE_ATTEMPTS = 256;
let level = "info";
let sinks = [];
/** Parse a `DSH_ELECTRO_LAB_LOG_LEVEL` word; anything unknown keeps the default. */
function resolveLevel(word) {
	switch (word?.trim().toLowerCase()) {
		case "debug": return "debug";
		case "warn": return "warn";
		case "error": return "error";
		case "off": return "off";
		default: return "info";
	}
}
/** Set the one global level shared by every sink. */
function setLevel(next) {
	level = next;
}
/** Local time, `YYYY-MM-DD HH:mm:ss.SSS`; meta.json carries the ISO instants instead. */
function stamp(date) {
	const pad = (value, width) => String(value).padStart(width, "0");
	return `${`${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(date.getDate(), 2)}`} ${`${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}.${pad(date.getMilliseconds(), 3)}`}`;
}
/** Directory name from the line timestamp: no space in a path, and `:` is illegal on Windows. */
function dirStamp(date) {
	return stamp(date).replace(" ", "_").replace(/:/g, "-");
}
/** A message sits in the head: control characters are escaped, never emitted raw. */
function inline(text) {
	return text.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}
/** Whether a value needs quoting: empty, carrying a separator, or opening with an ambiguous quote. */
function needsQuotes(text) {
	return text.length === 0 || text.startsWith("\"") || /[\s=]/.test(text);
}
/** Cut one over-long token, keeping the head of it: readability beats completeness in a line. */
function capped(text) {
	return text.length > VALUE_LIMIT ? `${text.slice(0, VALUE_LIMIT)}…` : text;
}
function renderText$1(text) {
	if (!needsQuotes(text)) return text;
	return `"${text.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t")}"`;
}
/** One field value as a single token; anything outside the JSON domain degrades to a marker instead of throwing. */
function renderValue(value) {
	if (value === void 0) return void 0;
	if (value === null) return "null";
	if (typeof value === "string") return renderText$1(capped(value));
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (value instanceof Error) return renderText$1(value.message);
	let text;
	try {
		text = JSON.stringify(value);
	} catch {
		return "[unserializable]";
	}
	if (text === void 0) return "[unserializable]";
	return renderText$1(capped(text));
}
/** Own enumerable data properties in insertion order; accessors are skipped so a getter can never run. */
function dataFields(fields) {
	const out = [];
	for (const key of Object.keys(fields)) {
		const descriptor = Object.getOwnPropertyDescriptor(fields, key);
		if (descriptor === void 0 || !("value" in descriptor)) continue;
		out.push([key, descriptor.value]);
	}
	return out;
}
/** The ` k=v …` tail; empty when there is nothing to render. */
function renderTail(fields) {
	if (fields === void 0 || fields === null || typeof fields !== "object") return "";
	if (Array.isArray(fields)) {
		const text = renderValue(fields);
		return text === void 0 ? "" : ` value=${text}`;
	}
	const parts = [];
	for (const [key, value] of dataFields(fields)) {
		const text = renderValue(value);
		if (text === void 0) continue;
		parts.push(`${renderText$1(key)}=${text}`);
	}
	return parts.length === 0 ? "" : ` ${parts.join(" ")}`;
}
/** `  | `-prefixed stack continuation lines for every Error logged as a field value. */
function renderStacks(fields) {
	if (fields === void 0 || fields === null || typeof fields !== "object" || Array.isArray(fields)) return "";
	let out = "";
	for (const [, value] of dataFields(fields)) {
		if (!(value instanceof Error) || typeof value.stack !== "string") continue;
		for (const line of value.stack.split("\n").slice(0, STACK_LIMIT)) out += `\n${CONTINUATION}${line.trimEnd()}`;
	}
	return out;
}
/** One log line, plus continuation lines when an Error's stack is logged with it. */
function formatLine(severity, message, fields, at = /* @__PURE__ */ new Date()) {
	return `${stamp(at)} ${LEVEL_LABEL[severity].padEnd(5)} ${inline(message)}${renderTail(fields)}${renderStacks(fields)}`;
}
/** Logger-internal trouble goes straight to stdout: it must never travel through a sink that may be the broken one. */
function reportInternal(problem) {
	process.stdout.write(`[dsh-electro-lab] logger: ${problem}\n`);
}
function emit(severity, message, fields) {
	if (LEVEL_ORDER[severity] < LEVEL_ORDER[level]) return;
	const line = formatLine(severity, message, fields);
	for (const entry of sinks) {
		if (!entry.enabled) continue;
		try {
			entry.sink.write(line, severity);
		} catch (error) {
			entry.enabled = false;
			reportInternal(`sink disabled after a write failure: ${error instanceof Error ? error.message : String(error)}`);
		}
	}
}
/** The plugin's one logger. With no sink attached (module load, tests) every call is a no-op. */
const log = {
	debug: (message, fields) => emit("debug", message, fields),
	info: (message, fields) => emit("info", message, fields),
	warn: (message, fields) => emit("warn", message, fields),
	error: (message, fields) => emit("error", message, fields)
};
function addSink(sink) {
	const entry = {
		sink,
		enabled: true
	};
	sinks = [...sinks, entry];
	return () => {
		sinks = sinks.filter((item) => item !== entry);
	};
}
const LEVEL_COLOR = {
	["debug"]: "\x1B[2m",
	["warn"]: "\x1B[33m",
	["error"]: "\x1B[31m"
};
/** Console sink: every line on stdout, the level label colored when stdout is a terminal. */
function attachConsoleSink() {
	return addSink({ write: (line, severity) => {
		const color = LEVEL_COLOR[severity];
		const label = LEVEL_LABEL[severity];
		const at = color === void 0 ? -1 : line.indexOf(label);
		const text = color === void 0 || at < 0 || process.stdout.isTTY !== true ? line : `${line.slice(0, at)}${color}${label}\u001b[0m${line.slice(at + label.length)}`;
		process.stdout.write(`${text}\n`);
	} });
}
let activeRun = null;
/** Whether an exclusive create lost the name to a file that already exists. */
function isTaken(error) {
	return typeof error === "object" && error !== null && error.code === "EEXIST";
}
/**
* Create this run's file and hold it open.
*
* The create is exclusive ('wx'), so an existing run's log is never opened, appended to or truncated.
* A taken name (a re-mounted plugin inside the same recorded millisecond) is simply retried with a
* fresh reading of the clock: the failed create costs real time, so the clock moves on by itself and
* no timestamp is ever invented. A clock that never advances cannot name a second run — after
* CREATE_ATTEMPTS tries the caller is told, and logging falls back to the console.
*/
function createRunFile(root) {
	for (let attempt = 0; attempt < CREATE_ATTEMPTS; attempt += 1) {
		const file = join(root, `${dirStamp(/* @__PURE__ */ new Date())}${RUN_SUFFIX}`);
		try {
			return {
				file,
				fd: openSync(file, "wx")
			};
		} catch (error) {
			if (!isTaken(error)) throw error;
		}
	}
	throw new Error(`cannot create a log file in ${root}: every name it tried was already taken`);
}
function fileBytes(file) {
	try {
		return statSync(file).size;
	} catch {
		return 0;
	}
}
/** Every run file except the current one, oldest first (the name is the creation timestamp, so it sorts by age). */
function otherRuns(root, current) {
	return readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isFile() && RUN_NAME.test(entry.name)).map((entry) => entry.name).filter((name) => name !== current).sort();
}
/** Retention: the newest KEEP_RUNS files, at most MAX_RUN_BYTES in total; the current run is never removed. */
function pruneRuns(root, current) {
	const older = otherRuns(root, current);
	for (const name of older.slice(0, Math.max(0, older.length + 1 - KEEP_RUNS))) rmSync(join(root, name), { force: true });
	const sized = otherRuns(root, current).map((name) => ({
		name,
		bytes: fileBytes(join(root, name))
	}));
	let total = fileBytes(join(root, current)) + sized.reduce((sum, run) => sum + run.bytes, 0);
	for (const run of sized) {
		if (total <= MAX_RUN_BYTES) break;
		rmSync(join(root, run.name), { force: true });
		total -= run.bytes;
	}
}
function closeRun(run) {
	if (run === null || run.closed) return;
	run.closed = true;
	if (activeRun === run) activeRun = null;
	run.detach();
	try {
		closeSync(run.fd);
	} catch {}
}
/**
* Attach the per-run file sink: `<home>/logs/<YYYY-MM-DD_HH-mm-ss.SSS>.log`, one file per plugin
* mount — that is, per host run — pruned to the newest KEEP_RUNS. The file is created exclusively and
* held open, and is plain event lines; nothing about the run is recorded outside it. Writing is
* synchronous on the held descriptor, so the last lines survive a crash and nothing needs flushing.
* Throws only if no log file could be created — the caller decides whether logging is worth failing
* over.
*/
function attachFileSink(home) {
	closeRun(activeRun);
	const root = join(home, "logs");
	mkdirSync(root, { recursive: true });
	const { file, fd } = createRunFile(root);
	const run = {
		file,
		fd,
		detach: () => {},
		closed: false
	};
	run.detach = addSink({ write: (line) => {
		writeSync(fd, `${line}\n`);
	} });
	activeRun = run;
	try {
		pruneRuns(root, basename(file));
	} catch {}
	return {
		file,
		close: () => {
			closeRun(run);
		}
	};
}
//#endregion
//#region src/engine/table.ts
/**
* Variable table (engine variable table).
* Slots = { name, typed value, rev }: a kind is pinned on first write and immutable; overwrites must carry the same kind;
* rev starts at 1 and +1 per same-kind overwrite; a rebuild after delete (set null) = rev 1.
*/
var VariableTable = class VariableTable {
	slots = /* @__PURE__ */ new Map();
	/** A slot's semantic identity: number/complex use kind; other types use type (string/boolean/array/object). */
	static identity(value) {
		if (value.type === "number" || value.type === "complex") return `${value.type}:${value.kind}`;
		return value.type;
	}
	get(name) {
		return this.slots.get(name);
	}
	has(name) {
		return this.slots.has(name);
	}
	/** Write a slot: new slot rev 1; same-identity overwrite rev+1; a different identity is rejected and does not advance. */
	set(name, value) {
		const existing = this.slots.get(name);
		if (existing === void 0) {
			const slot = {
				value,
				rev: 1
			};
			this.slots.set(name, slot);
			return slot;
		}
		if (VariableTable.identity(existing.value) !== VariableTable.identity(value)) throw new ToolError(`slot "${name}" is pinned to ${VariableTable.identity(existing.value)}, got ${VariableTable.identity(value)} — delete it first (set "${name}" = null) to replace it with a different kind/type`, "ENGINE_KIND_MISMATCH");
		const slot = {
			value,
			rev: existing.rev + 1
		};
		this.slots.set(name, slot);
		return slot;
	}
	/** Delete a slot: idempotent when absent (returns false); returns true when present. */
	delete(name) {
		return this.slots.delete(name);
	}
	/** All current slots (in insertion order). */
	entries() {
		return [...this.slots.entries()];
	}
	clear() {
		this.slots.clear();
	}
};
//#endregion
//#region src/engine/registry.ts
/**
* Solver registry (engine solver registry).
* register replaces the defineJsonTool registration path: the spec is the validator, run points at the kernel.
* returns is required and explicit: a spec or null (= void); a missing one = registration error.
*/
const NAME_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;
var SolverRegistry = class {
	solvers = /* @__PURE__ */ new Map();
	register(solver) {
		if (!NAME_PATTERN.test(solver.id)) throw new ToolError(`solver id "${solver.id}" must match ^[a-z][a-z0-9_]{0,63}$`, "ENGINE_ARGS");
		if (solver.returns === void 0) throw new ToolError(`solver "${solver.id}" needs an explicit returns (a spec or null for void)`, "REGISTER_MISSING_RETURNS");
		if (this.solvers.has(solver.id)) throw new ToolError(`solver "${solver.id}" is already registered`, "REGISTER_DUPLICATE");
		this.solvers.set(solver.id, solver);
	}
	get(id) {
		return this.solvers.get(id);
	}
	require(id) {
		const solver = this.solvers.get(id);
		if (solver === void 0) throw new ToolError(`unknown solver "${id}"`, "ENGINE_UNKNOWN_SOLVER");
		return solver;
	}
	ids() {
		return [...this.solvers.keys()];
	}
	clear() {
		this.solvers.clear();
	}
};
//#endregion
//#region src/engine/storage.ts
/**
* Record storage: record-index.jsonl (index) + records/<id>.jsonl (per-step trace).
* Index rows {id, openedAt, sealedAt, question}; orphans (sealedAt null with no body) are cleared at startup.
*/
var RecordStore = class {
	home;
	constructor(home) {
		this.home = home;
	}
	indexFile() {
		return join(this.home, "record-index.jsonl");
	}
	recordsDir() {
		return join(this.home, "records");
	}
	recordFile(id) {
		return join(this.recordsDir(), `${id}.jsonl`);
	}
	/** Read all index rows (file order). */
	readIndex() {
		const file = this.indexFile();
		if (!existsSync(file)) return [];
		const rows = [];
		for (const line of readFileSync(file, "utf8").split("\n")) {
			const trimmed = line.trim();
			if (trimmed.length === 0) continue;
			try {
				const parsed = JSON.parse(trimmed);
				if (typeof parsed.id === "string" && typeof parsed.openedAt === "number") rows.push(parsed);
			} catch {}
		}
		return rows;
	}
	writeIndex(rows) {
		mkdirSync(this.home, { recursive: true });
		writeFileSync(this.indexFile(), rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length > 0 ? "\n" : ""), "utf8");
	}
	/** Append an index row (new record). */
	appendIndex(row) {
		mkdirSync(this.home, { recursive: true });
		appendFileSync(this.indexFile(), JSON.stringify(row) + "\n", "utf8");
	}
	/** Update one index row (seal). */
	updateIndex(id, patch) {
		const rows = this.readIndex();
		const index = rows.findIndex((row) => row.id === id);
		if (index === -1) return;
		rows[index] = {
			...rows[index],
			...patch
		};
		this.writeIndex(rows);
	}
	/** Startup consistency: remove orphan index rows whose sealedAt is null and have no body file. */
	clearOrphans() {
		const rows = this.readIndex();
		const kept = rows.filter((row) => row.sealedAt !== null || existsSync(this.recordFile(row.id)));
		if (kept.length !== rows.length) this.writeIndex(kept);
	}
	/** Create a record: create the directory and append the index row; the caller writes the body's first line. Returns id and openedAt. */
	createRecord(question) {
		mkdirSync(this.recordsDir(), { recursive: true });
		const id = randomUUID();
		const openedAt = Date.now();
		this.appendIndex({
			id,
			openedAt,
			sealedAt: null,
			question
		});
		return {
			id,
			openedAt
		};
	}
	/** Append one trace row (synchronous write). */
	appendRow(id, row) {
		appendFileSync(this.recordFile(id), JSON.stringify(row) + "\n", "utf8");
	}
	/** Read every row of a body. */
	readRows(id) {
		const file = this.recordFile(id);
		if (!existsSync(file)) return [];
		const rows = [];
		for (const line of readFileSync(file, "utf8").split("\n")) {
			const trimmed = line.trim();
			if (trimmed.length === 0) continue;
			try {
				rows.push(JSON.parse(trimmed));
			} catch {}
		}
		return rows;
	}
	/** Whether the body file exists. */
	hasRecord(id) {
		return existsSync(this.recordFile(id));
	}
	/** Delete a record (body + index row) — not required by the core design; kept for future administration. */
	deleteRecord(id) {
		rmSync(this.recordFile(id), { force: true });
		this.writeIndex(this.readIndex().filter((row) => row.id !== id));
	}
	/** Every id inside the records/ directory. */
	recordIds() {
		if (!existsSync(this.recordsDir())) return [];
		return readdirSync(this.recordsDir()).filter((name) => name.endsWith(".jsonl")).map((name) => name.slice(0, -6));
	}
};
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
/** Pure relative tolerance comparison (no absolute floor). Zero matches zero exactly. */
function isNearlyEqual(a, b, tol = 1e-9) {
	if (a === 0 && b === 0) return true;
	const scale = Math.max(Math.abs(a), Math.abs(b));
	if (scale === 0) return a === b;
	return Math.abs(a - b) <= tol * scale;
}
//#endregion
//#region src/engine/values.ts
/**
* Value universe (engine value universe).
*
* Typed values: {type, value, kind, variant?, prefix?}. kind is part of a
* quantity type; a missing variant/prefix field means the base representation / multiplier of 1;
* vocabularies are always ASCII short words; symbols serve display mapping only. Declaration specs
* (parameters/returns isomorphic, closed) and typed values share the validation
* and conversion here.
*/
/** Shape guard for slot references (call arguments and set values). */
function isSlotValue(raw) {
	return typeof raw === "object" && raw !== null && raw.type === "slot" && typeof raw.value === "string";
}
const PREFIX_SCALES = {
	pico: 1e-12,
	nano: 1e-9,
	micro: 1e-6,
	milli: .001,
	kilo: 1e3,
	mega: 1e6,
	giga: 1e9,
	tera: 0xe8d4a51000
};
/** kind → variant word → conversion. No table = base representation only (variant keys must not appear). */
const VARIANT_TABLE = {
	["temperature"]: {
		degC: {
			factor: 1,
			offset: 273.15
		},
		degF: {
			factor: 5 / 9,
			offset: 2298.35 / 9
		}
	},
	["angle"]: { deg: {
		factor: Math.PI / 180,
		offset: 0
	} },
	["pressure"]: {
		bar: {
			factor: 1e5,
			offset: 0
		},
		psi: {
			factor: 6894.757293168,
			offset: 0
		},
		atm: {
			factor: 101325,
			offset: 0
		}
	},
	["energy"]: {
		cal: {
			factor: 4.184,
			offset: 0
		},
		Wh: {
			factor: 3600,
			offset: 0
		}
	},
	["power"]: { hp: {
		factor: 745.6998715822702,
		offset: 0
	} },
	["length"]: {
		inch: {
			factor: .0254,
			offset: 0
		},
		foot: {
			factor: .3048,
			offset: 0
		},
		yard: {
			factor: .9144,
			offset: 0
		},
		mile: {
			factor: 1609.344,
			offset: 0
		}
	},
	["mass"]: {
		lb: {
			factor: .45359237,
			offset: 0
		},
		oz: {
			factor: .028349523125,
			offset: 0
		}
	}
};
/** Check whether a kind word is valid. */
function isKind(value) {
	return QUANTITY_KIND_NAMES.includes(value);
}
/**
* Validate a typed value (shape/word-table checks at set-input time). Pass returns void;
* failure returns a human-readable error message. Values are validated by shape and word table only, with no cross-kind judgement.
*/
function validateValue(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return "value must be a typed-value object";
	const v = value;
	if (typeof v.type !== "string") return "typed value needs a type field";
	switch (v.type) {
		case "number":
			if (typeof v.value !== "number" || !Number.isFinite(v.value)) return "number value must be a finite number";
			if (!isKind(String(v.kind))) return `unknown kind "${String(v.kind)}"`;
			return checkPrefixVariant(v, true);
		case "complex": {
			const c = v.value;
			const rect = typeof c.re === "number" && typeof c.im === "number";
			const polar = typeof c.mag === "number" && typeof c.ang === "number";
			if (!rect && !polar) return "complex value must be {re, im} or {mag, ang} with numbers";
			if (rect && polar) return "complex value must be exactly {re, im} or {mag, ang}";
			if (!isKind(String(v.kind))) return `unknown kind "${String(v.kind)}"`;
			return checkPrefixVariant(v, false);
		}
		case "string":
			if (typeof v.value !== "string") return "string value must be a string";
			return;
		case "boolean":
			if (typeof v.value !== "boolean") return "boolean value must be a boolean";
			return;
		case "array":
			if (!Array.isArray(v.value)) return "array value must be an array";
			for (const item of v.value) {
				const error = validateValue(item);
				if (error !== void 0) return error;
			}
			return;
		case "object":
			if (typeof v.value !== "object" || v.value === null || Array.isArray(v.value)) return "object value must be an object";
			for (const field of Object.values(v.value)) {
				const error = validateValue(field);
				if (error !== void 0) return error;
			}
			return;
		default: return `unknown type "${String(v.type)}" (number/complex/string/boolean/array/object)`;
	}
}
/** prefix/variant combination check: prefix is valid only on the SI base representation (no variant); the variant word must be in the kind's word table. */
function checkPrefixVariant(v, allowComplex) {
	const kind = v.kind;
	const variant = v.variant;
	if (variant !== void 0) {
		if (typeof variant !== "string") return "variant must be a string";
		const variants = VARIANT_TABLE[kind];
		if (variants === void 0 || variants[variant] === void 0) return `variant "${variant}" is not supported for kind "${kind}"`;
		if (!allowComplex) return "variant is only supported on number values";
	}
	if (v.prefix !== void 0) {
		if (typeof v.prefix !== "string") return "prefix must be a string";
		if (PREFIX_SCALES[v.prefix] === void 0) return `unknown prefix "${String(v.prefix)}"`;
		if (variant !== void 0) return "prefix is only valid on the SI base representation (no variant)";
	}
}
/**
* Convert number/complex values to the SI base + rect normalization (call boundary).
* Arrays and objects recurse: a quantity nested in one is converted like a top-level one, so
* `resolved` describes what the run really used and a kernel never sees a prefix or a variant word.
*/
function toCanonical(value) {
	if (value.type === "number") {
		let number = value.value;
		if (value.prefix !== void 0) number *= PREFIX_SCALES[value.prefix];
		if (value.variant !== void 0) {
			const info = VARIANT_TABLE[value.kind][value.variant];
			number = number * info.factor + info.offset;
		}
		return {
			type: "number",
			value: number,
			kind: value.kind
		};
	}
	if (value.type === "complex") {
		let re;
		let im;
		if ("re" in value.value) {
			re = value.value.re;
			im = value.value.im;
		} else {
			re = value.value.mag * Math.cos(value.value.ang);
			im = value.value.mag * Math.sin(value.value.ang);
		}
		const scale = value.prefix !== void 0 ? PREFIX_SCALES[value.prefix] : 1;
		return {
			type: "complex",
			value: {
				re: re * scale,
				im: im * scale
			},
			kind: value.kind
		};
	}
	if (value.type === "array") return {
		type: "array",
		value: value.value.map(toCanonical)
	};
	if (value.type === "object") {
		const fields = {};
		for (const [key, field] of Object.entries(value.value)) fields[key] = toCanonical(field);
		return {
			type: "object",
			value: fields
		};
	}
	return value;
}
/** Validate that a typed value matches a declaration spec (quantity kinds must match; objects are closed). */
function validateAgainstSpec(spec, value, path) {
	switch (spec.type) {
		case "number":
			if (value.type === "complex") return `${path}: expected number(${spec.kind}), got a complex (narrowing is never implicit)`;
			if (value.type !== "number") return `${path}: expected number(${spec.kind}), got ${value.type}`;
			if (value.kind !== spec.kind) return `${path}: expected kind ${spec.kind}, got ${value.kind}`;
			return;
		case "complex":
			if (value.type !== "number" && value.type !== "complex") return `${path}: expected complex(${spec.kind}), got ${value.type}`;
			if (value.kind !== spec.kind) return `${path}: expected kind ${spec.kind}, got ${value.kind}`;
			return;
		case "string":
			if (value.type !== "string") return `${path}: expected a string, got ${value.type}`;
			if (spec.enum !== void 0 && !spec.enum.includes(value.value)) return `${path}: expected one of ${spec.enum.join(", ")}, got "${value.value}"`;
			return;
		case "boolean":
			if (value.type !== "boolean") return `${path}: expected a boolean, got ${value.type}`;
			return;
		case "array":
			if (value.type !== "array") return `${path}: expected an array, got ${value.type}`;
			for (let i = 0; i < value.value.length; i++) {
				const error = validateAgainstSpec(spec.items, value.value[i], `${path}[${i}]`);
				if (error !== void 0) return error;
			}
			return;
		case "object":
			if (value.type !== "object") return `${path}: expected an object, got ${value.type}`;
			for (const key of Object.keys(value.value)) if (spec.fields[key] === void 0) return `${path}: unexpected field "${key}"`;
			for (const [key, fieldSpec] of Object.entries(spec.fields)) {
				const field = value.value[key];
				if (field === void 0) return `${path}: missing field "${key}"`;
				const error = validateAgainstSpec(fieldSpec, field, `${path}.${key}`);
				if (error !== void 0) return error;
			}
			return;
	}
}
/**
* Convert kernel-native output (number / {re,im} / {mag,ang} / string / boolean / array / object)
* into a typed value per its returns spec (result shaping). Structural mismatch throws.
*/
function fromNative(spec, raw, path) {
	switch (spec.type) {
		case "number":
			if (typeof raw !== "number" || !Number.isFinite(raw)) throw new Error(`${path}: result must be a finite number`);
			return {
				type: "number",
				value: raw,
				kind: spec.kind
			};
		case "complex":
			if (typeof raw === "number") {
				if (!Number.isFinite(raw)) throw new Error(`${path}: result is not a finite number`);
				return {
					type: "number",
					value: raw,
					kind: spec.kind
				};
			}
			if (raw !== null && typeof raw === "object") {
				const box = raw;
				if (typeof box.re === "number" && typeof box.im === "number") return {
					type: "complex",
					value: {
						re: box.re,
						im: box.im
					},
					kind: spec.kind
				};
				if (typeof box.mag === "number" && typeof box.ang === "number") return {
					type: "complex",
					value: {
						mag: box.mag,
						ang: box.ang
					},
					kind: spec.kind
				};
			}
			throw new Error(`${path}: result must be a number or {re, im} / {mag, ang}`);
		case "string":
			if (typeof raw !== "string") throw new Error(`${path}: expected a string result`);
			return {
				type: "string",
				value: raw
			};
		case "boolean":
			if (typeof raw !== "boolean") throw new Error(`${path}: expected a boolean result`);
			return {
				type: "boolean",
				value: raw
			};
		case "array":
			if (!Array.isArray(raw)) throw new Error(`${path}: expected an array result`);
			return {
				type: "array",
				value: raw.map((item, index) => fromNative(spec.items, item, `${path}[${index}]`))
			};
		case "object": {
			if (raw === null || typeof raw !== "object" || Array.isArray(raw)) throw new Error(`${path}: expected an object result`);
			const box = raw;
			for (const key of Object.keys(box)) if (spec.fields[key] === void 0) throw new Error(`${path}: unexpected field "${key}"`);
			const fields = {};
			for (const [key, fieldSpec] of Object.entries(spec.fields)) {
				if (!(key in box)) throw new Error(`${path}: missing field "${key}"`);
				fields[key] = fromNative(fieldSpec, box[key], `${path}.${key}`);
			}
			return {
				type: "object",
				value: fields
			};
		}
	}
}
/** Read a value out of a slot by dot path (path only walks object fields). */
function refPath(value, path) {
	if (path === void 0 || path.length === 0) return value;
	const segments = path.split(".");
	let current = value;
	for (const segment of segments) {
		if (current.type !== "object") throw new Error(`slot path "${path}" steps through a non-object value`);
		const next = current.value[segment];
		if (next === void 0) throw new Error(`slot path "${path}" has no field "${segment}"`);
		current = next;
	}
	return current;
}
//#endregion
//#region src/engine/external.ts
/**
* External solver transport (envelope protocol): requests are {requestId, args},
* success is {requestId, result} (void = result: null), failure is
* {requestId, error: "string"}. Both parameters and results are typed values
* (SI, rect, no variant/prefix).
*
* One transport exists today: http. Typed args travel as a JSON body over a
* POST — the verb is not a declaration field and is never negotiated. The
* engine records only the call itself (solver, args, resolved, result) and the
* interface-level error when one occurs; whether the endpoint's computation
* succeeded is the endpoint's own business, reported through the envelope's
* error field.
*/
/** Convert a typed value into its on-the-wire JSON form (canonical shape, no variant/prefix). */
function wireValue(value) {
	return value;
}
function readResult(body, requestId) {
	if (typeof body !== "object" || body === null) throw new ToolError("the tool response must be a JSON object", "EXTERNAL_RESPONSE");
	const box = body;
	if (box.requestId !== requestId) throw new ToolError(`response requestId mismatch (got ${String(box.requestId)})`, "EXTERNAL_RESPONSE");
	if (box.error !== void 0) {
		if (typeof box.error !== "string") throw new ToolError("the tool response error must be a string", "EXTERNAL_RESPONSE");
		throw new ToolError(box.error, "EXTERNAL_ERROR");
	}
	if (!("result" in box)) throw new ToolError("the tool response must contain a result field", "EXTERNAL_RESPONSE");
	const raw = box.result;
	if (raw === null) return null;
	const error = validateValue(raw);
	if (error !== void 0) throw new ToolError(`the tool result is not a valid typed value: ${error}`, "EXTERNAL_RESPONSE");
	return raw;
}
/**
* The message for a transport failure. fetch reports everything it could not do as "fetch failed" and
* keeps the reason in its cause, so a refused connection, an unknown host and a broken socket all read
* the same — the caller is left with no way to tell an endpoint that is down from one that is wrong.
*/
function transportFailure(error) {
	if (!(error instanceof Error)) return String(error);
	const cause = error.cause;
	if (!(cause instanceof Error)) return cause === void 0 ? error.message : `${error.message}: ${String(cause)}`;
	const code = cause.code;
	const hasCode = typeof code === "string" && !cause.message.includes(code);
	return `${error.message}: ${hasCode ? `${code} ${cause.message}` : cause.message}`;
}
/** Run one external call; return the result from the response (may be null; the engine validates it against the solver signature). */
async function callExternal(solverId, block, args) {
	const timeoutMs = block.timeoutMs ?? 3e4;
	const requestId = randomUUID();
	const startedAt = Date.now();
	const payload = {
		requestId,
		args: Object.fromEntries(Object.entries(args).map(([key, value]) => [key, wireValue(value)]))
	};
	const options = block.transportOptions;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		const request = {
			method: "POST",
			headers: {
				"content-type": "application/json",
				...options.headers ?? {}
			},
			signal: controller.signal,
			body: JSON.stringify(payload)
		};
		const response = await fetch(options.url, request);
		if (!response.ok) throw new ToolError(`http ${response.status} from ${options.url}`, "EXTERNAL_HTTP");
		const text = await response.text();
		let parsed;
		try {
			parsed = JSON.parse(text);
		} catch {
			throw new ToolError(`the tool returned non-JSON: ${text.slice(0, 120)}`, "EXTERNAL_RESPONSE");
		}
		const result = readResult(parsed, requestId);
		log.info("external call ok", {
			solver: solverId,
			ep: options.url,
			req: requestId,
			took_ms: Date.now() - startedAt
		});
		return result;
	} catch (error) {
		const timedOut = error instanceof Error && error.name === "AbortError";
		const message = error instanceof ToolError || timedOut ? errorMessage(error) : transportFailure(error);
		log.warn("external call failed", {
			solver: solverId,
			ep: options.url,
			req: requestId,
			took_ms: Date.now() - startedAt,
			code: error instanceof ToolError ? error.code : "TOOL_ERROR",
			error: message
		});
		if (error instanceof ToolError) throw error;
		if (timedOut) throw new ToolError(`http request timed out after ${timeoutMs} ms`, "EXTERNAL_TIMEOUT");
		throw new Error(message, { cause: error });
	} finally {
		clearTimeout(timer);
	}
}
/** The message of a thrown value, for the log and the receipt. */
function errorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
//#endregion
//#region src/engine/engine.ts
/**
* Engine.
* Global singleton: variable table + solver registry + record storage + a single open lifecycle.
* Primitives (set/get/call) and markers execute through it; every step appends one trace row (with inputs and outputs).
*/
var Engine = class {
	table = new VariableTable();
	registry = new SolverRegistry();
	store;
	open = null;
	constructor(home) {
		this.store = new RecordStore(home);
	}
	/** Start: clear orphans; if a record with sealedAt null and a body exists, recover it (continue the same file, rebuild the table). */
	start() {
		this.store.clearOrphans();
		const row = this.store.readIndex().find((item) => item.sealedAt === null && this.store.hasRecord(item.id));
		if (row === void 0) return;
		const rows = this.store.readRows(row.id);
		this.replayInto(rows);
		const lastSeq = rows.reduce((max, item) => Math.max(max, typeof item.seq === "number" ? item.seq : 0), 0);
		this.open = {
			id: row.id,
			seq: lastSeq,
			question: row.question,
			openedAt: row.openedAt
		};
	}
	indexRows() {
		return this.store.readIndex();
	}
	isOpen() {
		return this.open !== null;
	}
	openId() {
		return this.open?.id ?? null;
	}
	/** Rebuild engine state: set/call/set-null are applied per row; markers are skipped. */
	replayInto(rows) {
		for (const row of rows) {
			if (row.ok !== true) continue;
			if (row.tool === "set") {
				if (row.deleted === true) this.table.delete(String(row.name));
				else this.table.set(String(row.name), row.value);
			} else if (row.tool === "call") {
				if (row.result !== null && row.result !== void 0 && typeof row.target === "string") this.table.set(row.target, row.result);
			}
		}
	}
	nextSeq() {
		if (this.open === null) return 1;
		this.open.seq += 1;
		return this.open.seq;
	}
	requireOpen() {
		if (this.open === null) throw new ToolError("no open record — call record_question first", "ENGINE_SLOT_UNDECLARED");
		return this.open;
	}
	trace(row) {
		const open = this.requireOpen();
		const line = {
			seq: this.nextSeq(),
			at: Date.now()
		};
		Object.assign(line, row);
		this.store.appendRow(open.id, line);
	}
	/** record_question: if open exists, seal it (duplicate-start) then open a new one; the variable table is cleared. */
	markerQuestion(text) {
		if (this.open !== null) this.sealDuplicateStart();
		this.table.clear();
		const created = this.store.createRecord(text);
		this.open = {
			id: created.id,
			seq: 0,
			question: text,
			openedAt: created.openedAt
		};
		this.trace({
			tool: "marker",
			kind: "question",
			ok: true,
			text
		});
		return {
			ok: true,
			record: this.open.id
		};
	}
	markerAnalyse(text) {
		this.requireOpen();
		this.trace({
			tool: "marker",
			kind: "analyse",
			ok: true,
			text
		});
		return { ok: true };
	}
	/** record_answer: submit the text and settle; no open record → duplicate-end error record. */
	markerAnswer(text) {
		if (this.open === null) {
			const created = this.store.createRecord("");
			this.open = {
				id: created.id,
				seq: 0,
				question: "",
				openedAt: created.openedAt
			};
			this.trace({
				tool: "seal",
				kind: "duplicate-end",
				ok: true
			});
			this.store.updateIndex(created.id, { sealedAt: Date.now() });
			const id = this.open.id;
			this.open = null;
			return {
				ok: true,
				record: id,
				error: "duplicate-end"
			};
		}
		this.trace({
			tool: "marker",
			kind: "answer",
			ok: true,
			text
		});
		const id = this.open.id;
		this.store.updateIndex(id, { sealedAt: Date.now() });
		this.open = null;
		return {
			ok: true,
			record: id
		};
	}
	sealDuplicateStart() {
		if (this.open === null) return;
		this.trace({
			tool: "seal",
			kind: "duplicate-start",
			ok: true
		});
		this.store.updateIndex(this.open.id, { sealedAt: Date.now() });
		this.open = null;
	}
	opSet(name, value) {
		try {
			this.validateName(name);
			if (value === null) {
				const deleted = this.table.delete(name);
				this.trace({
					tool: "set",
					ok: true,
					name,
					value: null,
					deleted
				});
				return {
					ok: true,
					name,
					deleted
				};
			}
			const expanded = this.expandSlots(value, `set "${name}"`);
			const error = validateValue(expanded);
			if (error !== void 0) throw new ToolError(`set: ${error}`, "ENGINE_ARGS");
			const typed = expanded;
			const slot = this.table.set(name, typed);
			this.trace({
				tool: "set",
				ok: true,
				name,
				value: typed,
				rev: slot.rev
			});
			return {
				ok: true,
				name,
				rev: slot.rev
			};
		} catch (error) {
			return this.failure("set", error);
		}
	}
	opGet(name) {
		try {
			const slot = this.table.get(name);
			if (slot === void 0) throw new ToolError(`slot "${name}" is not declared`, "ENGINE_SLOT_UNDECLARED");
			this.trace({
				tool: "get",
				ok: true,
				name,
				value: slot.value
			});
			return {
				ok: true,
				name,
				value: slot.value
			};
		} catch (error) {
			return this.failure("get", error);
		}
	}
	/** Inspect one solver: its exact signature from the registry, traced as its own row. */
	opInfo(solverId) {
		try {
			const solver = this.registry.require(solverId);
			this.trace({
				tool: "solver_info",
				ok: true,
				solver: solverId
			});
			const signature = JSON.parse(JSON.stringify({
				parameters: solver.parameters,
				returns: solver.returns
			}));
			const usage = {};
			for (const [name, spec] of Object.entries(solver.parameters)) {
				const optional = spec.optional === true ? " (optional)" : "";
				usage[name] = `${describeSpec(spec)}${optional} — send ${typedForm(spec)}`;
			}
			return {
				ok: true,
				solver: solver.id,
				summary: solver.summary,
				parameters: signature.parameters,
				returns: signature.returns,
				signature: usage
			};
		} catch (error) {
			return this.failure("solver_info", error);
		}
	}
	async opCall(solverId, rawArgs, target) {
		const args = rawArgs ?? {};
		try {
			const solver = this.registry.require(solverId);
			const { resolved, native } = this.resolveArgs(solver, args);
			if (solver.returns === null) {
				if (target !== null) throw new ToolError(`solver "${solverId}" returns void — target must be null`, "ENGINE_VOID_TARGET");
				await this.runVoid(solver, resolved, native);
				this.trace({
					tool: "call",
					ok: true,
					solver: solverId,
					args,
					resolved,
					result: null,
					target: null
				});
				return {
					ok: true,
					target: null
				};
			}
			if (target === null) throw new ToolError(`solver "${solverId}" returns a value — a named target is required`, "ENGINE_TARGET_REQUIRED");
			const result = await this.execute(solver, resolved, native);
			const slot = this.table.set(target, result);
			this.trace({
				tool: "call",
				ok: true,
				solver: solverId,
				args,
				resolved,
				result,
				target,
				rev: slot.rev
			});
			return {
				ok: true,
				target,
				rev: slot.rev
			};
		} catch (error) {
			return this.failure("call", error);
		}
	}
	async runVoid(solver, resolved, native) {
		try {
			if (solver.external !== void 0) {
				if (await callExternal(solver.id, solver.external, resolved) !== null) throw new ToolError(`solver "${solver.id}" is void but the endpoint returned a result`, "EXTERNAL_RESPONSE");
				return;
			}
			await solver.run(native);
		} catch (error) {
			if (error instanceof ToolError) throw error;
			throw new ToolError(error instanceof Error ? error.message : String(error), "ENGINE_SOLVER_FAILED");
		}
	}
	/** Resolve args: expand slot references + validate typed values + kind/shape checks + conversion (resolved = SI rect endpoint). */
	resolveArgs(solver, args) {
		const resolved = {};
		const native = {};
		const missing = [];
		for (const [name, spec] of Object.entries(solver.parameters)) {
			const raw = args[name];
			if (raw === void 0) {
				if (spec.optional === true) continue;
				missing.push(`${name}: ${describeSpec(spec)}`);
				continue;
			}
			const typed = this.resolveValue(raw, name, spec);
			const error = validateAgainstSpec(spec, typed, `argument "${name}"`);
			if (error !== void 0) throw new ToolError(`solver "${solver.id}": ${error}`, "ENGINE_KIND_MISMATCH");
			const canonical = toCanonical(typed);
			resolved[name] = canonical;
			native[name] = nativeValue(spec, canonical);
		}
		if (missing.length > 0) throw new ToolError(`solver "${solver.id}" is missing required arguments: ${missing.join(", ")}`, "ENGINE_ARGS");
		return {
			resolved,
			native
		};
	}
	/** One argument value: a slot reference ({type: 'slot', value: full path}) or a typed-value literal
	*  whose array items / object fields may themselves be slot references (expanded recursively). */
	resolveValue(raw, name, spec) {
		const expanded = this.expandSlots(raw, `argument "${name}"`);
		const error = validateValue(expanded);
		if (error !== void 0) {
			const hint = typeof raw === "string" && raw.startsWith("@") ? " — \"@name\" strings are no longer references: pass { \"type\": \"slot\", \"value\": \"name\" }" : "";
			const arrayHint = spec.type === "array" ? " (or pass a slot reference to a slot that already holds the array)" : "";
			throw new ToolError(`argument "${name}": ${error}; expected ${describeSpec(spec)} — send a typed value like ${typedForm(spec)}${arrayHint}${hint}`, "ENGINE_ARGS");
		}
		return expanded;
	}
	/**
	* Expand every slot reference in a value bound for the table or a call: a
	* reference at the top level, or nested as an array item / object field,
	* resolves to the stored typed value (or the field path inside it).
	* References never survive into the table, the trace or kernel arguments.
	* `ctx` labels the receiver in errors ("argument \"times\"" or "set \"B\"").
	*/
	expandSlots(raw, ctx) {
		if (isSlotValue(raw)) {
			const reference = raw.value;
			const dot = reference.indexOf(".");
			const slotName = dot === -1 ? reference : reference.slice(0, dot);
			const path = dot === -1 ? void 0 : reference.slice(dot + 1);
			const slot = this.table.get(slotName);
			if (slot === void 0) throw new ToolError(`${ctx}: slot "${slotName}" is not declared`, "ENGINE_SLOT_UNDECLARED");
			return refPath(slot.value, path);
		}
		if (typeof raw === "object" && raw !== null) {
			const box = raw;
			if (box.type === "array" && Array.isArray(box.value)) return {
				...box,
				value: box.value.map((item) => this.expandSlots(item, ctx))
			};
			if (box.type === "object" && typeof box.value === "object" && box.value !== null && !Array.isArray(box.value)) {
				const fields = {};
				for (const [key, field] of Object.entries(box.value)) fields[key] = this.expandSlots(field, ctx);
				return {
					...box,
					value: fields
				};
			}
		}
		return raw;
	}
	/** Run a non-void solver (local run or external transport); shape the result per its returns spec. */
	async execute(solver, resolved, native) {
		const spec = solver.returns;
		if (spec === null) throw new ToolError(`solver "${solver.id}" is void`, "ENGINE_ARGS");
		let raw;
		try {
			if (solver.external !== void 0) {
				const result = await callExternal(solver.id, solver.external, resolved);
				if (result === null) throw new ToolError(`solver "${solver.id}" is not void but the endpoint returned result: null`, "EXTERNAL_RESPONSE");
				const error = validateAgainstSpec(spec, result, `solver "${solver.id}" result`);
				if (error !== void 0) throw new ToolError(`solver "${solver.id}": ${error}`, "EXTERNAL_RESPONSE");
				return result;
			}
			raw = await solver.run(native);
		} catch (error) {
			if (error instanceof ToolError) throw error;
			throw new ToolError(error instanceof Error ? error.message : String(error), "ENGINE_SOLVER_FAILED");
		}
		try {
			return fromNative(spec, raw, `solver "${solver.id}" result`);
		} catch (error) {
			throw new ToolError(error instanceof Error ? error.message : String(error), "ENGINE_SOLVER_FAILED");
		}
	}
	validateName(name) {
		if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new ToolError(`slot name "${name}" must match ^[A-Za-z_][A-Za-z0-9_]*$`, "ENGINE_ARGS");
	}
	failure(tool, error) {
		const code = error instanceof ToolError ? error.code : "TOOL_ERROR";
		const message = error instanceof Error ? error.message : String(error);
		log.warn("engine op failed", {
			tool,
			code,
			error: message
		});
		if (this.open !== null) this.trace({
			tool,
			ok: false,
			code,
			error: message
		});
		return {
			ok: false,
			code,
			error: message
		};
	}
};
/** Compact human description of a spec, used in failure receipts so the model can self-correct. */
function describeSpec(spec) {
	switch (spec.type) {
		case "number": return `number(${spec.kind})`;
		case "complex": return `complex(${spec.kind})`;
		case "string": return spec.enum === void 0 ? "string" : `string(${spec.enum.join("|")})`;
		case "boolean": return "boolean";
		case "array": return `array of ${describeSpec(spec.items)}`;
		case "object": return `object with fields {${Object.keys(spec.fields).join(", ")}}`;
	}
}
/** A ready-to-send typed-value example for a spec (enum strings take their first allowed value). */
function exampleTypedValue(spec) {
	switch (spec.type) {
		case "number":
		case "complex": return {
			type: "number",
			value: 1,
			kind: spec.kind
		};
		case "string": return {
			type: "string",
			value: spec.enum?.[0] ?? "…"
		};
		case "boolean": return {
			type: "boolean",
			value: true
		};
		case "array": return {
			type: "array",
			value: [exampleTypedValue(spec.items)]
		};
		case "object": {
			const value = {};
			for (const [key, fieldSpec] of Object.entries(spec.fields)) value[key] = exampleTypedValue(fieldSpec);
			return {
				type: "object",
				value
			};
		}
	}
}
/** The typed form a caller should send for this spec, as compact JSON text. */
function typedForm(spec) {
	return JSON.stringify(exampleTypedValue(spec));
}
/** resolved typed value → kernel-native JS (a real stays a number, a complex goes in as rect; the rest recurse). */
function nativeValue(spec, canonical) {
	switch (spec.type) {
		case "number":
		case "complex":
			if (canonical.type === "number") return canonical.value;
			return canonical.value;
		case "string":
		case "boolean": return canonical.value;
		case "array":
			if (canonical.type !== "array") return canonical.value;
			return canonical.value.map((item) => nativeValue(spec.items, item));
		case "object": {
			if (canonical.type !== "object") return canonical.value;
			const out = {};
			for (const [key, fieldSpec] of Object.entries(spec.fields)) {
				const field = canonical.value[key];
				if (field !== void 0) out[key] = nativeValue(fieldSpec, field);
			}
			return out;
		}
	}
}
//#endregion
//#region src/state.ts
/**
* The plugin's one state file: `<home>/state.json`.
*
* Everything the plugin carries across host runs that is not a record lives in this single root
* file: the remembered generation settings and the restart dirty bit for external declarations.
* Logging is not state and never writes here — a run is described by its own log file. Two modules
* share this file, so this module owns the read-modify-write: a writer names only the keys it owns
* and every other key survives. Every key is a current value, so the file stays small and needs no
* retention.
*
* The file is replaced atomically (write a temporary file, then rename it over the target), so a
* crash mid-write leaves the previous file intact rather than a truncated one. A missing, corrupt
* or non-object file reads as {} — every reader tolerates that. Records are not state and live
* elsewhere: record-index.jsonl indexes them (it is what the client's record list previews) and
* records/<id>.jsonl holds their traces.
*/
/** Base name of the one state file (inside the records home). */
const STATE_FILE = "state.json";
function statePath(home) {
	return join(home, STATE_FILE);
}
/** The current state; anything unreadable reads as {} (never throws). */
function readState(home) {
	try {
		const parsed = JSON.parse(readFileSync(statePath(home), "utf8"));
		if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
		return parsed;
	} catch {
		return {};
	}
}
/** Replace the file atomically: the temporary file is renamed over the target on the same volume. */
function persist(home, state) {
	mkdirSync(home, { recursive: true });
	const file = statePath(home);
	const temporary = `${file}.tmp`;
	writeFileSync(temporary, JSON.stringify(state), "utf8");
	renameSync(temporary, file);
}
/**
* Read-modify-write the state file: `change` receives the current state and mutates the keys it
* owns. Unrelated keys are preserved, and the result is written atomically. Returns the state that
* was written.
*/
function updateState(home, change) {
	const state = readState(home);
	change(state);
	persist(home, state);
	return state;
}
//#endregion
//#region src/tool.ts
/**
* The tool core — everything the surface outside the engine needs in one
* module:
*
* 1. Definition: ToolReturns (the declared output shape of a declaration),
*    renderText and defineJsonTool — the factory used by the manager tools
*    (external_solver_*) and the engine primitives (set/get/call, markers).
* 2. Declarations: the archive-authored tool dialect (ToolDeclaration,
*    Declaration*), the external-solvers.jsonl archive with the restart dirty
*    bit, and validation. Declarations are not compiled into tools anymore —
*    at plugin start every enabled declaration is recorded verbatim into the
*    engine's solver registry as an external solver (engine/external-solvers.ts), which
*    wraps the http transport itself.
*
* ToolError/ToolErrorCode are re-exported so callers import the failure
* types from one place.
*/
/** Pretty JSON text rendering for the model-facing presentation. */
function renderText(value) {
	return [{
		type: "text",
		text: JSON.stringify(value, null, 2)
	}];
}
/**
* Define a tool whose output is an unconstrained JSON value rendered as
* pretty text. `execute` may be synchronous; it is wrapped into the async
* contract the registry expects. The execution context is passed through
* so orchestrator tools can propagate cancellation and parent tokens.
*/
function defineJsonTool(options) {
	return defineTool({
		...options,
		execute: async (args, exec) => {
			try {
				return await options.execute(args, exec);
			} catch (error) {
				if (error instanceof ToolError) throw error;
				throw new ToolError(error instanceof Error ? error.message : String(error));
			}
		},
		output: {
			schema: { type: "json" },
			render: (_args, value) => renderText(value)
		}
	});
}
/** Transports a declared solver can be reached over. */
let DeclarationTransport = /* @__PURE__ */ function(DeclarationTransport) {
	DeclarationTransport["Http"] = "http";
	return DeclarationTransport;
}({});
/**
* A parameter's settled semantic type, spelled exactly like the returns leaves. A quantity leaf names the
* set a value must belong to: `complex` takes a real too (ℝ ⊂ ℂ), `number` takes reals only — widening is
* implicit, narrowing never is.
*/
let DeclarationParamType = /* @__PURE__ */ function(DeclarationParamType) {
	/** Reals only: a complex payload is rejected instead of quietly losing its imaginary part. */
	DeclarationParamType["Number"] = "number";
	/** A real or a complex (bare number, {re,im} or {mag,ang} payloads); kind is a lowercase QuantityKind name. */
	DeclarationParamType["Complex"] = "complex";
	DeclarationParamType["String"] = "string";
	DeclarationParamType["Boolean"] = "boolean";
	DeclarationParamType["Array"] = "array";
	return DeclarationParamType;
}({});
/** The external-solver declaration archive (one JSON declaration per line). */
const DECLARATIONS_FILE = "external-solvers.jsonl";
/** The restart dirty bit lives in the shared state file (application state, not the declaration file). */
const STATE_RESTART_KEY = "restartRequired";
function declarationsPath(home) {
	return join(home, DECLARATIONS_FILE);
}
/** All declarations currently stored (enabled or not), in file order. */
function readDeclarations(home) {
	const file = declarationsPath(home);
	if (!existsSync(file)) return [];
	const declarations = [];
	for (const line of readFileSync(file, "utf8").split("\n")) {
		const trimmed = line.trim();
		if (trimmed.length === 0) continue;
		try {
			declarations.push(JSON.parse(trimmed));
		} catch {}
	}
	return declarations;
}
/** Rewrite the whole archive (idempotent, keeps file order). */
function writeDeclarations(home, declarations) {
	mkdirSync(home, { recursive: true });
	const content = declarations.map((tool) => JSON.stringify(tool)).join("\n") + (declarations.length > 0 ? "\n" : "");
	writeFileSync(declarationsPath(home), content, "utf8");
}
function setRestartRequired(home, required) {
	updateState(home, (state) => {
		state[STATE_RESTART_KEY] = required;
	});
}
/** True when a restart is pending for declaration changes to take effect. */
function restartRequired(home) {
	return readState(home)[STATE_RESTART_KEY] === true;
}
/** Clear the dirty bit; the host calls this once the solvers are (re)registered at start. */
function clearRestartRequired(home) {
	setRestartRequired(home, false);
}
/** Append or update (by name) one declaration; sets the dirty bit. */
function upsertDeclaration(home, declaration) {
	const declarations = readDeclarations(home);
	const index = declarations.findIndex((tool) => tool.name === declaration.name);
	if (index === -1) declarations.push(declaration);
	else declarations[index] = declaration;
	writeDeclarations(home, declarations);
	setRestartRequired(home, true);
}
/** Delete one declaration by name; sets the dirty bit when something was removed. */
function deleteDeclaration(home, name) {
	const declarations = readDeclarations(home);
	const next = declarations.filter((tool) => tool.name !== name);
	if (next.length === declarations.length) return false;
	writeDeclarations(home, next);
	setRestartRequired(home, true);
	return true;
}
/** Recursively validate one parameter spec (array items nest). */
function validateParamSpec(spec, path, errors) {
	if (typeof spec !== "object" || spec === null) {
		errors.push(`${path} must be an object`);
		return;
	}
	const s = spec;
	switch (s.type) {
		case "number":
		case "complex":
			if (s.kind === void 0 || !QUANTITY_KIND_NAMES.includes(s.kind)) errors.push(`${path}: a quantity type requires a known kind (lowercase QuantityKind names)`);
			break;
		case "string":
			if (s.enum !== void 0 && (!Array.isArray(s.enum) || s.enum.some((item) => typeof item !== "string"))) errors.push(`${path}: enum must be a string array`);
			break;
		case "boolean": break;
		case "array":
			if (s.items === void 0) errors.push(`${path}: array type requires an items declaration`);
			else validateParamSpec(s.items, `${path}.items`, errors);
			break;
		default: errors.push(`${path}: unknown type "${String(s.type)}" (one of ${Object.values(DeclarationParamType).join(", ")})`);
	}
}
/** 审计 C3（SSRF）：IPv4 回环/私网/链路本地 CIDR 区间判断。 */
function ipv4InBlockedRange(host) {
	const parts = host.split(".");
	if (parts.length !== 4) return false;
	const octets = parts.map((p) => Number(p));
	if (octets.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) return false;
	const [a, b, c, d] = octets;
	const n = (a << 24 | b << 16 | c << 8 | d) >>> 0;
	return [
		[2130706432, 2147483647],
		[167772160, 184549375],
		[2886729728, 2887778303],
		[3232235520, 3232301055],
		[2851995648, 2852061183]
	].some(([lo, hi]) => n >= lo && n <= hi);
}
/** 审计 C3（SSRF）：主机名是否落在黑名单（回环/私网/链路本地/ULA）。 */
function isBlockedHost(host) {
	const h = host.toLowerCase().replace(/^\[|\]$/g, "");
	if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
	const kind = isIP(h);
	if (kind === 4) return ipv4InBlockedRange(h);
	if (kind === 6) {
		const lower = h.toLowerCase();
		if (lower === "::1") return true;
		if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
		if (lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true;
	}
	return false;
}
/** 审计 C3（纵深）：请求头键必须在安全白名单内。 */
function isForbiddenHeaderKey(key) {
	const lower = key.toLowerCase();
	if (!/^[!#$%&'*+\-.^_`|~0-9a-z]+$/.test(lower)) return true;
	return (/* @__PURE__ */ new Set([
		"host",
		"content-length",
		"content-type",
		"transfer-encoding",
		"connection",
		"keep-alive",
		"upgrade",
		"proxy-authorization",
		"te",
		"trailer",
		"expect",
		"cookie",
		"user-agent",
		"accept",
		"accept-encoding",
		"accept-language",
		"referer",
		"origin",
		"sec-fetch-site",
		"sec-fetch-mode",
		"sec-fetch-dest"
	])).has(lower);
}
/** Validation errors as a list of human-readable messages (empty = valid). */
function validateDeclaration(config) {
	const errors = [];
	if (typeof config !== "object" || config === null) return ["declaration must be an object"];
	const tool = config;
	if (typeof tool.name !== "string" || !/^[a-z][a-z0-9_]{0,63}$/.test(tool.name)) errors.push("name must match ^[a-z][a-z0-9_]{0,63}$ (lowercase start)");
	if (typeof tool.description !== "string") errors.push("description is required");
	if (tool.enabled !== void 0 && typeof tool.enabled !== "boolean") errors.push("enabled must be a boolean when present");
	if (tool.transport !== "http") errors.push(`transport must be one of ${Object.values(DeclarationTransport).join(", ")}`);
	if (typeof tool.parameters !== "object" || tool.parameters === null || Array.isArray(tool.parameters)) errors.push("parameters must be an object");
	else for (const [key, spec] of Object.entries(tool.parameters)) validateParamSpec(spec, `parameter "${key}"`, errors);
	if (tool.timeoutMs !== void 0 && (!Number.isFinite(tool.timeoutMs) || tool.timeoutMs <= 0)) errors.push("timeoutMs must be a positive number");
	const options = tool.transportOptions;
	if (typeof options !== "object" || options === null) {
		errors.push("transportOptions is required");
		return errors;
	}
	const http = options;
	if (typeof http.url !== "string" || !/^https?:\/\//.test(http.url)) {
		errors.push("transportOptions.url must be an http(s) URL");
		return errors;
	}
	try {
		const host = new URL(http.url).hostname;
		if (isBlockedHost(host)) errors.push(`transportOptions.url 指向回环/私网地址（${host}），已被拒绝`);
	} catch {
		errors.push("transportOptions.url 不是合法 URL");
	}
	const headers = options.headers;
	if (headers !== void 0) {
		if (typeof headers !== "object" || headers === null || Array.isArray(headers)) errors.push("transportOptions.headers 必须是键值对象");
		else for (const key of Object.keys(headers)) if (isForbiddenHeaderKey(key)) errors.push(`transportOptions.headers 含不允许的键 "${key}"`);
	}
	return errors;
}
//#endregion
//#region src/tools/engine-tools.ts
/** Typed-value syntax: the generic passage taught to the model (value universe). */
const VALUE_GUIDE = "A typed value is a JSON object: { \"type\": \"number\", \"value\": <number>, \"kind\": <quantity kind>, \"variant\"?: <word>, \"prefix\"?: <word> } or { \"type\": \"complex\", \"value\": { \"re\": …, \"im\": … } or { \"mag\": …, \"ang\": … (radians) }, \"kind\": <kind> } or { \"type\": \"string\", \"value\": \"…\" } / { \"type\": \"boolean\", \"value\": true } / { \"type\": \"array\", \"value\": [<typed values>] } / { \"type\": \"object\", \"value\": { <field>: <typed value> } }. kind is part of a quantity (resistance, voltage, time, frequency, none, …). variant words (degC/degF for temperature, deg for angle, bar/psi/atm for pressure, cal/Wh, hp, inch/foot/yard/mile, lb/oz) select a non-SI representation; omit the field for the SI base. prefix words: pico/nano/micro/milli/kilo/mega/giga/tera — omit for 1. The engine stores values as given; SI conversion happens only at calculation boundaries.";
const NAME_DESC = "slot name: letters, digits, underscore; start with a letter or underscore";
/** Factory: binds the global single-engine instance and produces LLM-visible tool definitions. */
function createEngineTools(engine) {
	const solverEnum = engine.registry.ids();
	const solverList = solverEnum.length > 0 ? ` Available solver ids: ${solverEnum.join(", ")}.` : "";
	return [
		defineJsonTool({
			name: "set",
			description: `Write one slot in the engine. ${VALUE_GUIDE} Pass value: null to delete the slot (idempotent; re-creating later restarts at rev 1). Writing a slot with a different kind than its pinned kind fails — delete the slot first (value: null) to replace it with a different kind/type.`,
			parameters: {
				name: {
					type: "string",
					description: NAME_DESC,
					required: true
				},
				value: {
					type: "json",
					description: "a typed value object, a slot reference (stores a copy of the referenced slot value), or null to delete the slot",
					required: true
				}
			},
			execute: (args) => engine.opSet(args.name, args.value)
		}),
		defineJsonTool({
			name: "get",
			description: "Read one slot from the engine. Returns the stored typed value exactly as written (no normalization).",
			parameters: { name: {
				type: "string",
				description: NAME_DESC,
				required: true
			} },
			execute: (args) => engine.opGet(args.name)
		}),
		defineJsonTool({
			name: "call",
			description: `Call one registered solver and store its result into a named slot. Every argument must be a TYPED value ({"type": "string", "value": "rc"}, {"type": "number", "value": 100, "kind": "resistance"}, {"type": "array", "value": [...]}) or a slot reference — { "type": "slot", "value": "name" } with the full slot path; bare strings, numbers and arrays are rejected. Slot references may also sit inside array items and object fields — they resolve to the stored value before validation. The engine kind-checks arguments against the solver signature. A void solver (declared returns: null) takes target: null; a value solver requires a named target. Overwriting an existing slot replaces its value (rev +1).${solverList}`,
			parameters: {
				solver: {
					type: "string",
					enum: solverEnum,
					description: "the registered solver to call",
					required: true
				},
				args: {
					type: "json",
					description: `solver arguments: an object mapping each parameter name to a typed value or a slot reference — run solver_info first to see each parameter's expected shape and a ready-to-send example`,
					required: true
				},
				target: {
					type: "json",
					description: "result slot name (string), or null for void solvers",
					required: true
				}
			},
			execute: async (args) => engine.opCall(args.solver, args.args, args.target)
		}),
		defineJsonTool({
			name: "solver_info",
			description: `Inspect one registered solver before calling it: its parameter signature (parameter names, types, quantity kinds, allowed enum values, optional flags, nested items) and its returns (spec, or null for void). Read this whenever you are about to call a solver you have not used yet.${solverList}`,
			parameters: { solver: {
				type: "string",
				enum: solverEnum,
				description: "the registered solver to inspect",
				required: true
			} },
			execute: (args) => engine.opInfo(args.solver)
		}),
		defineJsonTool({
			name: "record_question",
			description: "Open a new record: clears the variable table and starts a fresh trace. Pass the consolidated question text (verbatim). If a record is already open it is sealed first (duplicate-start).",
			parameters: { text: {
				type: "string",
				description: "the question text",
				required: true
			} },
			execute: (args) => engine.markerQuestion(args.text)
		}),
		defineJsonTool({
			name: "record_analyse",
			description: "Submit the analysis text into the open record (approach with formulas; the knowns are already stored in slots).",
			parameters: { text: {
				type: "string",
				description: "the analysis text",
				required: true
			} },
			execute: (args) => engine.markerAnalyse(args.text)
		}),
		defineJsonTool({
			name: "record_answer",
			description: "Submit the final answer text and seal the record. With no open record it keeps a duplicate-end error record.",
			parameters: { text: {
				type: "string",
				description: "the answer text",
				required: true
			} },
			execute: (args) => engine.markerAnswer(args.text)
		})
	];
}
//#endregion
//#region src/engine/external-solvers.ts
function specFromParam(param, path) {
	switch (param.type) {
		case "number":
		case "complex":
			if (!isKind(param.kind)) throw new Error(`${path}: unknown kind "${param.kind}"`);
			return {
				type: param.type,
				kind: param.kind
			};
		case "string": return param.enum === void 0 ? { type: "string" } : {
			type: "string",
			enum: param.enum
		};
		case "boolean": return { type: "boolean" };
		case "array": return {
			type: "array",
			items: specFromParam(param.items, `${path}.items`)
		};
	}
}
/** returns → engine spec; null = void (explicit); a missing or unmappable any → throw and skip. */
function specFromReturns(returns, path) {
	if (returns === null) return null;
	if (returns === void 0) throw new Error(`${path}: a declaration needs an explicit returns (a spec, or null for void)`);
	return specFromLeaf(returns, path);
}
/** Non-void leaf (recursive use; null/missing cannot appear at nested sites). */
function specFromLeaf(returns, path) {
	switch (returns.type) {
		case "any": throw new Error(`${path}: returns "any" cannot be mapped to a typed spec`);
		case "string": return { type: "string" };
		case "boolean": return { type: "boolean" };
		case "number": return {
			type: "number",
			kind: returns.kind
		};
		case "complex": return {
			type: "complex",
			kind: returns.kind
		};
		case "object": {
			const fields = {};
			for (const [key, field] of Object.entries(returns.fields)) fields[key] = specFromLeaf(field, `${path}.fields.${key}`);
			return {
				type: "object",
				fields
			};
		}
		case "array": return {
			type: "array",
			items: specFromLeaf(returns.items, `${path}.items`)
		};
		default: throw new Error(`${path}: unknown returns type "${String(returns.type)}" (number, complex, string, boolean, object, array)`);
	}
}
/** Archive row → SolverDef. Unmappable cases (missing/any returns, bad parameters) return null or throw; the caller warns and skips. */
function compileExternalSolver(declaration) {
	const parameters = {};
	for (const [key, param] of Object.entries(declaration.parameters)) parameters[key] = specFromParam(param, `parameter "${key}"`);
	const returns = specFromReturns(declaration.returns, `declaration "${declaration.name}"`);
	const external = {
		transport: declaration.transport,
		transportOptions: declaration.transportOptions,
		...declaration.timeoutMs === void 0 ? {} : { timeoutMs: declaration.timeoutMs }
	};
	return {
		id: declaration.name,
		summary: declaration.description,
		parameters,
		returns,
		run: () => {
			throw new Error("external solver runs through the transport — this run is never called");
		},
		external
	};
}
//#endregion
//#region src/math/polynomial.ts
/**
* Polynomial arithmetic center: shared coefficient operations used by the
* expression engine, the transfer-function layer and the matching/root
* tools. Coefficients are complex numbers in DESCENDING power order
* [aₙ … a₁, a₀] everywhere on the API; long division reverses internally
* to ascending order (index = power) for a clean elimination loop.
*/
/** Trim leading zero coefficients, keeping at least one entry. */
function trimPolynomial(coefficients) {
	let start = 0;
	while (start < coefficients.length - 1 && coefficients[start].abs() === 0) start++;
	return coefficients.slice(start);
}
/** A polynomial is zero when every coefficient vanishes. */
function isZeroPolynomial(coefficients) {
	return coefficients.every((coefficient) => coefficient.abs() === 0);
}
/** Align lengths, then add element-wise. */
function addPolynomials(left, right) {
	const length = Math.max(left.length, right.length);
	const result = [];
	for (let i = 0; i < length; i++) {
		const l = left[left.length - 1 - i] ?? new Complex(0, 0);
		const r = right[right.length - 1 - i] ?? new Complex(0, 0);
		result.unshift(l.add(r));
	}
	return result;
}
/** Multiplication as coefficient convolution. */
function convolvePolynomials(left, right) {
	const result = new Array(left.length + right.length - 1).fill(null).map(() => new Complex(0, 0));
	for (let i = 0; i < left.length; i++) for (let j = 0; j < right.length; j++) result[i + j] = result[i + j].add(left[i].mul(right[j]));
	return result;
}
/**
* Polynomial long division, descending coefficient order (the standard
* across this module): dividend = quotient · divisor + remainder. The
* division itself runs in ascending order (index = power) so the highest
* term is eliminated cleanly each round; both results are polynomials —
* never empty, the zero polynomial is [0].
*/
function dividePolynomials(dividend, divisor) {
	const remainder = dividend.slice().reverse();
	const divisorAscending = divisor.slice().reverse();
	const quotientAscending = new Array(Math.max(remainder.length - divisorAscending.length + 1, 1)).fill(null).map(() => new Complex(0, 0));
	const leading = divisorAscending[divisorAscending.length - 1];
	while (remainder.length >= divisorAscending.length && remainder[remainder.length - 1].abs() !== 0) {
		const degree = remainder.length - divisorAscending.length;
		const factor = remainder[remainder.length - 1].div(leading);
		quotientAscending[degree] = quotientAscending[degree].add(factor);
		for (let i = 0; i < divisorAscending.length; i++) remainder[degree + i] = remainder[degree + i].sub(factor.mul(divisorAscending[i]));
		remainder.pop();
		while (remainder.length > 1 && remainder[remainder.length - 1].abs() === 0) remainder.pop();
	}
	return {
		quotient: quotientAscending.reverse(),
		remainder: remainder.reverse()
	};
}
/** Polynomial GCD by the Euclidean algorithm, made monic. */
function findPolyGcd(left, right) {
	let a = trimPolynomial(left);
	let b = trimPolynomial(right);
	while (!isZeroPolynomial(b)) {
		const { remainder } = dividePolynomials(a, b);
		a = b;
		b = remainder;
	}
	const leading = a[0];
	return a.map((coefficient) => coefficient.div(leading));
}
/** Horner evaluation of a descending coefficient array. */
function evaluatePolynomial(coefficients, point) {
	let result = new Complex(0, 0);
	for (const coefficient of coefficients) result = result.mul(point).add(coefficient);
	return result;
}
/** Zeros (numerator roots) and poles (denominator roots) of a ratio. */
function findPolesZeros(numerator, denominator) {
	return {
		zeros: findPolyRoots(numerator),
		poles: findPolyRoots(denominator)
	};
}
/**
* Power-series expansion of N(z)/D(z) about z⁻¹: the first `count` terms of
* H(z) = Σ h[n]·z⁻ⁿ. In the z domain these coefficients ARE the impulse
* response h[n]. With w = 1/z, H(1/w) = w^(degD−degN)·N(w)/D(w) where the
* descending coefficient arrays double as ascending w polynomials (the
* reversal cancels); the ratio is expanded by the coefficient recurrence
* f[k] = (n[k] − Σᵢ₌₁ d[i]·f[k−i])/d[0], then shifted by degD−degN.
*/
function expandPowerSeries(numerator, denominator, count) {
	if (!Number.isInteger(count) || count < 0) throw new Error("count must be a non-negative integer");
	const n = trimPolynomial(numerator);
	const d = trimPolynomial(denominator);
	const leading = d[0];
	if (leading.abs() === 0) throw new Error("denominator must be a non-zero polynomial");
	const shift = d.length - n.length;
	if (shift < 0) throw new Error("numerator degree must not exceed denominator degree (causal system required)");
	const ratio = [];
	for (let k = 0; k < count; k++) {
		let sum = n[k] ?? new Complex(0, 0);
		for (let i = 1; i < d.length && k - i >= 0; i++) sum = sum.sub(d[i].mul(ratio[k - i]));
		ratio.push(sum.div(leading));
	}
	const coefficients = [];
	for (let k = 0; k < count; k++) coefficients.push(k < shift ? new Complex(0, 0) : ratio[k - shift]);
	return coefficients;
}
/**
* Durand-Kerner (Weierstrass) iteration for all roots of a descending
* coefficient array. Returns [] for constants; non-monic input is
* normalized internally. Convergence is quadratic for simple roots; the
* iteration stops after MAX_ITERATIONS and returns the best estimate.
*/
function findPolyRoots(coefficients) {
	const trimmed = trimPolynomial(coefficients);
	const degree = trimmed.length - 1;
	if (degree <= 0) return [];
	const monic = trimmed.map((coefficient) => coefficient.div(trimmed[0]));
	const roots = [];
	for (let k = 0; k < degree; k++) roots.push(new Complex(.4, .9).pow(k));
	const MAX_ITERATIONS = 200;
	const tolerance = 1e-14;
	for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
		let maxDelta = 0;
		for (let k = 0; k < degree; k++) {
			const current = roots[k];
			const value = evaluatePolynomial(monic, current);
			let denominator = new Complex(1, 0);
			for (let j = 0; j < degree; j++) if (j !== k) denominator = denominator.mul(current.sub(roots[j]));
			const delta = value.div(denominator);
			roots[k] = current.sub(delta);
			maxDelta = Math.max(maxDelta, delta.abs());
		}
		if (maxDelta < tolerance) break;
	}
	return roots;
}
//#endregion
//#region src/math/expression.ts
/**
* String-expression engine: one recursive-descent parser shared by two
* consumers — evaluate (arithmetic, complex-aware) and collectCoefficients
* (polynomial expansion about one variable).
*
* Grammar (precedence low → high):
*   expression  := addSub
*   addSub      := mulDiv (('+' | '-') mulDiv)*
*   mulDiv      := unary (('*' | '/') unary)*
*   unary       := ('-' | '+')* power
*   power       := primary ('^' unary)?        (right-associative)
*   primary     := number | identifier (call | '(' expr ')')?
*
* Numbers: decimal with optional scientific exponent (1e6, 2.5e-3) and an
* optional imaginary suffix (3+4j, 2i). 'j'/'i' alone is the imaginary unit.
* Constants: pi, e. Functions: sin cos tan asin acos atan atan2 exp ln log10
* sqrt abs arg conjugate real imag (atan2(y, x) = angle of x + j·y; real
* inputs give the standard two-argument arctangent). Everything else is a
* variable; unbound variables error on evaluation.
*/
const CONSTANTS = {
	pi: new Complex(Math.PI, 0),
	e: new Complex(Math.E, 0),
	j: new Complex(0, 1),
	i: new Complex(0, 1)
};
/** Functions callable in expressions; all complex-valued. Rest parameters
*  keep the declared arity (fn.length) available for argument-count checks. */
const FUNCTIONS = {
	sin: (z) => z.sin(),
	cos: (z) => z.cos(),
	tan: (z) => z.tan(),
	asin: (z) => z.asin(),
	acos: (z) => z.acos(),
	atan: (z) => z.atan(),
	atan2: (y, x) => new Complex(x.add(y.mul(new Complex(0, 1))).arg(), 0),
	exp: (z) => z.exp(),
	ln: (z) => z.log(),
	log10: (z) => z.log().div(Math.log(10)),
	sqrt: (z) => z.sqrt(),
	abs: (z) => new Complex(z.abs(), 0),
	arg: (z) => new Complex(z.arg(), 0),
	conjugate: (z) => z.conjugate(),
	real: (z) => new Complex(z.re, 0),
	imag: (z) => new Complex(z.im, 0)
};
const IDENTIFIER_START = /[a-zA-Z_]/;
const IDENTIFIER_PART = /[a-zA-Z0-9_]/;
function tokenize(source) {
	const tokens = [];
	let index = 0;
	while (index < source.length) {
		const char = source[index];
		if (/\s/.test(char)) {
			index++;
			continue;
		}
		if (char === "(") {
			tokens.push({ kind: "leftParen" });
			index++;
			continue;
		}
		if (char === ")") {
			tokens.push({ kind: "rightParen" });
			index++;
			continue;
		}
		if (char === ",") {
			tokens.push({ kind: "comma" });
			index++;
			continue;
		}
		if (char === "+" || char === "-" || char === "*" || char === "/" || char === "^") {
			tokens.push({
				kind: "operator",
				value: char
			});
			index++;
			continue;
		}
		if (/\d/.test(char)) {
			let number = "";
			while (index < source.length && /\d/.test(source[index])) number += source[index++];
			if (source[index] === ".") {
				number += source[index++];
				while (index < source.length && /\d/.test(source[index])) number += source[index++];
			}
			if (source[index] === "e" || source[index] === "E") {
				let lookahead = index + 1;
				if (source[lookahead] === "+" || source[lookahead] === "-") lookahead++;
				if (/\d/.test(source[lookahead] ?? "")) {
					number += source[index++];
					if (source[index] === "+" || source[index] === "-") number += source[index++];
					while (index < source.length && /\d/.test(source[index])) number += source[index++];
				}
			}
			let imaginary = false;
			if (source[index] === "j" || source[index] === "J" || source[index] === "i" || source[index] === "I") {
				imaginary = true;
				index++;
			}
			const magnitude = Number.parseFloat(number);
			if (!Number.isFinite(magnitude)) throw new Error(`invalid number literal '${number}' in expression`);
			tokens.push({
				kind: "number",
				value: imaginary ? new Complex(0, magnitude) : new Complex(magnitude, 0)
			});
			continue;
		}
		if (IDENTIFIER_START.test(char)) {
			let identifier = "";
			while (index < source.length && IDENTIFIER_PART.test(source[index])) identifier += source[index++];
			tokens.push({
				kind: "identifier",
				value: identifier
			});
			continue;
		}
		throw new Error(`unexpected character '${char}' at position ${index} in expression`);
	}
	tokens.push({ kind: "end" });
	return tokens;
}
var Parser = class {
	tokens;
	position = 0;
	constructor(tokens) {
		this.tokens = tokens;
	}
	parse() {
		const expression = this.parseAddSub();
		if (this.peek().kind !== "end") throw new Error(`unexpected token '${this.describe(this.peek())}' in expression`);
		return expression;
	}
	parseAddSub() {
		let left = this.parseMulDiv();
		for (;;) {
			const token = this.peek();
			if (token.kind !== "operator" || token.value !== "+" && token.value !== "-") return left;
			this.next();
			left = {
				kind: "binary",
				operator: token.value,
				left,
				right: this.parseMulDiv()
			};
		}
	}
	parseMulDiv() {
		let left = this.parseUnary();
		for (;;) {
			const token = this.peek();
			if (token.kind !== "operator" || token.value !== "*" && token.value !== "/") return left;
			this.next();
			left = {
				kind: "binary",
				operator: token.value,
				left,
				right: this.parseUnary()
			};
		}
	}
	parseUnary() {
		const token = this.peek();
		if (token.kind === "operator" && (token.value === "-" || token.value === "+")) {
			this.next();
			const operand = this.parseUnary();
			return token.value === "-" ? {
				kind: "negate",
				operand
			} : operand;
		}
		return this.parsePower();
	}
	parsePower() {
		const base = this.parsePrimary();
		const token = this.peek();
		if (token.kind === "operator" && token.value === "^") {
			this.next();
			return {
				kind: "binary",
				operator: "^",
				left: base,
				right: this.parseUnary()
			};
		}
		return base;
	}
	parsePrimary() {
		const token = this.next();
		if (token.kind === "number") return {
			kind: "number",
			value: token.value
		};
		if (token.kind === "leftParen") {
			const expression = this.parseAddSub();
			if (this.peek().kind !== "rightParen") throw new Error(`expected ')' in expression, got '${this.describe(this.peek())}'`);
			this.next();
			return expression;
		}
		if (token.kind === "identifier") {
			if (this.peek().kind === "leftParen") {
				this.next();
				const callArguments = [];
				if (this.peek().kind !== "rightParen") {
					callArguments.push(this.parseAddSub());
					while (this.peek().kind === "comma") {
						this.next();
						callArguments.push(this.parseAddSub());
					}
				}
				if (this.peek().kind !== "rightParen") throw new Error(`expected ')' after arguments of ${token.value} in expression`);
				this.next();
				return {
					kind: "call",
					functionName: token.value,
					arguments: callArguments
				};
			}
			return {
				kind: "variable",
				name: token.value
			};
		}
		throw new Error(`unexpected token '${this.describe(token)}' in expression`);
	}
	peek() {
		return this.tokens[this.position];
	}
	next() {
		return this.tokens[this.position++];
	}
	describe(token) {
		return token.kind === "number" || token.kind === "identifier" || token.kind === "operator" ? `${token.kind} '${token.value}'` : token.kind;
	}
};
function evaluate(expression, variables) {
	switch (expression.kind) {
		case "number": return expression.value;
		case "variable": {
			const constant = CONSTANTS[expression.name];
			if (constant !== void 0) return constant;
			const value = variables[expression.name];
			if (value === void 0) throw new Error(`unbound variable '${expression.name}' — provide it in variables, or it may be a typo`);
			return value;
		}
		case "negate": return evaluate(expression.operand, variables).neg();
		case "binary": {
			if (expression.operator === "^") return evaluatePower(evaluate(expression.left, variables), evaluate(expression.right, variables));
			const left = evaluate(expression.left, variables);
			const right = evaluate(expression.right, variables);
			switch (expression.operator) {
				case "+": return left.add(right);
				case "-": return left.sub(right);
				case "*": return left.mul(right);
				case "/": return left.div(right);
			}
			throw new Error(`unknown operator '${expression.operator}'`);
		}
		case "call": {
			const fn = FUNCTIONS[expression.functionName];
			if (fn === void 0) throw new Error(`unknown function '${expression.functionName}' — available: ${Object.keys(FUNCTIONS).join(", ")}`);
			const values = expression.arguments.map((argument) => evaluate(argument, variables));
			if (values.length !== fn.length) throw new Error(`function '${expression.functionName}' expects ${fn.length} argument(s), got ${values.length}`);
			return fn(...values);
		}
	}
}
/** Complex power with the principal branch: a^b = exp(b·ln(a)). */
function evaluatePower(base, exponent) {
	if (exponent.im === 0) {
		const n = exponent.re;
		if (Number.isInteger(n) && n >= 0) {
			let result = new Complex(1, 0);
			for (let i = 0; i < n; i++) result = result.mul(base);
			return result;
		}
	}
	return exponent.mul(base.log()).exp();
}
/** Whether the expression tree mentions the variable. */
function containsVariable(expression, name) {
	switch (expression.kind) {
		case "number": return false;
		case "variable": return expression.name === name;
		case "negate": return containsVariable(expression.operand, name);
		case "binary": return containsVariable(expression.left, name) || containsVariable(expression.right, name);
		case "call": return expression.arguments.some((argument) => containsVariable(argument, name));
	}
}
/**
* Reduce an expression built from + - * / and integer powers in one variable
* to a single rational function and return its numerator/denominator
* coefficients in descending power order, [aₙ … a₁, a₀]. Pure polynomials
* come back with denominator [1]; negative powers (s^-1), nested divisions
* and sums of rationals are normalized automatically. Common factors are
* canceled unless reduce is false. Functions of the variable (sin(x)) and
* non-integer powers are rejected.
*/
function reduceRational(source, variable = "x", reduce = true, parameters = {}) {
	let rational = reduceRationalOf(new Parser(tokenize(source)).parse(), variable, parameters);
	if (isZeroPolynomial(rational.denominator)) throw new Error("denominator is identically zero — division by the zero polynomial");
	if (reduce) {
		const gcd = findPolyGcd(rational.numerator, rational.denominator);
		if (gcd.length > 1) rational = {
			numerator: dividePolynomials(rational.numerator, gcd).quotient,
			denominator: dividePolynomials(rational.denominator, gcd).quotient
		};
	}
	return {
		numerator: trimPolynomial(rational.numerator),
		denominator: trimPolynomial(rational.denominator)
	};
}
/** Reduce a subtree to one rational function; parameters supply symbol values. */
function reduceRationalOf(expression, variable, parameters) {
	const ONE = new Complex(1, 0);
	switch (expression.kind) {
		case "number": return {
			numerator: [expression.value],
			denominator: [ONE]
		};
		case "variable": {
			if (expression.name === variable) return {
				numerator: [new Complex(1, 0), new Complex(0, 0)],
				denominator: [ONE]
			};
			const constant = CONSTANTS[expression.name];
			if (constant !== void 0) return {
				numerator: [constant],
				denominator: [ONE]
			};
			const parameter = parameters[expression.name];
			if (parameter !== void 0) return {
				numerator: [parameter],
				denominator: [ONE]
			};
			throw new Error(`unbound variable '${expression.name}' — provide it in variables, or it may be a typo`);
		}
		case "negate": {
			const rational = reduceRationalOf(expression.operand, variable, parameters);
			return {
				numerator: rational.numerator.map((coefficient) => coefficient.neg()),
				denominator: rational.denominator
			};
		}
		case "binary": {
			if (expression.operator === "^") {
				if (containsVariable(expression.right, variable)) throw new Error(`power exponent must not contain the variable for rational expansion, got an expression in ${variable}`);
				const exponent = evaluate(expression.right, parameters);
				if (exponent.im !== 0 || !Number.isInteger(exponent.re)) throw new Error(`rational expansion needs an integer exponent, got ${exponent.toString()}`);
				let base = reduceRationalOf(expression.left, variable, parameters);
				const power = Math.abs(exponent.re);
				if (exponent.re < 0) base = {
					numerator: base.denominator,
					denominator: base.numerator
				};
				let result = {
					numerator: [ONE],
					denominator: [ONE]
				};
				for (let i = 0; i < power; i++) result = multiplyRationals(result, base);
				return result;
			}
			const left = reduceRationalOf(expression.left, variable, parameters);
			const right = reduceRationalOf(expression.right, variable, parameters);
			switch (expression.operator) {
				case "+": return addRationals(left, right);
				case "-": return subtractRationals(left, right);
				case "*": return multiplyRationals(left, right);
				case "/": return divideRationals(left, right);
			}
			throw new Error(`operator '${expression.operator}' is not supported in rational expansion`);
		}
		case "call":
			if (expression.arguments.every((argument) => !containsVariable(argument, variable))) return {
				numerator: [evaluate(expression, parameters)],
				denominator: [ONE]
			};
			throw new Error(`'${expression.functionName}(…)' is not a rational function of ${variable}`);
	}
}
/** A/B + C/D = (AD + CB) / BD */
function addRationals(left, right) {
	return {
		numerator: addPolynomials(convolvePolynomials(left.numerator, right.denominator), convolvePolynomials(right.numerator, left.denominator)),
		denominator: convolvePolynomials(left.denominator, right.denominator)
	};
}
/** A/B − C/D = (AD − CB) / BD */
function subtractRationals(left, right) {
	return {
		numerator: addPolynomials(convolvePolynomials(left.numerator, right.denominator), convolvePolynomials(right.numerator, left.denominator).map((coefficient) => coefficient.neg())),
		denominator: convolvePolynomials(left.denominator, right.denominator)
	};
}
/** A/B · C/D = AC / BD */
function multiplyRationals(left, right) {
	return {
		numerator: convolvePolynomials(left.numerator, right.numerator),
		denominator: convolvePolynomials(left.denominator, right.denominator)
	};
}
/** (A/B) / (C/D) = AD / BC — avoid U+00F7: rolldown on Windows hangs on it even in comments */
function divideRationals(left, right) {
	return {
		numerator: convolvePolynomials(left.numerator, right.denominator),
		denominator: convolvePolynomials(left.denominator, right.numerator)
	};
}
/** Evaluate a string expression; every value is complex (real = im 0). */
function calcExpression(source, variables = {}) {
	if (source.trim() === "") throw new Error("expression is empty");
	return evaluate(new Parser(tokenize(source)).parse(), variables);
}
//#endregion
//#region src/math/convert.ts
/**
* JSON IO contract for tool values: every quantity crossing the tool
* boundary is a complex number in SI base units, and a quantity and its SI
* unit are one-to-one, so the kind IS the unit category — the single term
* "kind" is used throughout the contract. Kinds are pinned by the static
* tool definitions (parameter schemas, outputs); an input payload does not
* need to repeat its kind and no kind check is applied on unwrap.
*
* INPUT — a value parameter accepts a bare number (a real value), a compact
* complex object ({re, im} for rect, or {mag, ang} for polar — angles are
* radians, SI), or the legacy full forms:
*   rect  { form: Form.Rect,  re, im }     (kind optional)
*   polar { form: Form.Polar, mag, ang }   (kind optional, angles radians)
*
* OUTPUT — a complete snapshot, both projections always present:
*   { re, im, kind, mag, ang }
* The output feeds straight back into any input (re/im match the rect
* branch even with the extra mag/ang/kind keys).
*/
/** Unwrap to a complex.js value from any accepted payload shape. */
function toComplex(value) {
	if (typeof value === "number") return new Complex(value, 0);
	if ("re" in value) return new Complex(value.re, value.im);
	return new Complex(value.mag * Math.cos(value.ang), value.mag * Math.sin(value.ang));
}
/** Unwrap to a real number: the imaginary part must be negligible. */
function toScalar(value) {
	const complex = toComplex(value);
	if (!isNearlyEqual(complex.im, 0)) throw new Error(`expected a real value, got imaginary part ${complex.im}`);
	return complex.re;
}
/**
* JSON cannot carry negative zero or non-finite numbers. complex.js
* arithmetic produces -0 routinely (e.g. +0 divided by a negative number),
* and the harness rejects it at the lossless-JSON boundary — fold -0 to +0
* and raise a readable error for NaN/Infinity instead.
*/
function normalizeOutputNumber(value) {
	if (value === 0) return 0;
	if (!Number.isFinite(value)) throw new Error("result is not a finite number (NaN or Infinity) — check for division by zero or an invalid operation");
	return value;
}
/** Tool output for a complex result: the complete snapshot. */
function serializeComplex(value, kind) {
	return {
		re: normalizeOutputNumber(value.re),
		im: normalizeOutputNumber(value.im),
		kind,
		mag: normalizeOutputNumber(value.abs()),
		ang: normalizeOutputNumber(value.arg())
	};
}
/** Unwrap a value to a real number; a complex value with an imaginary part is rejected. */
function asReal(value, family) {
	if (value instanceof Complex) {
		if (!isNearlyEqual(value.im, 0)) throw new Error(`${family} conversion requires a real value`);
		return value.re;
	}
	return value;
}
/**
* Log scale: ratio ↔ dB. Power ratios use 10·log10, voltage ratios
* 20·log10; requires a real value and a kind.
*/
function convertLogValue(value, from, to, kind) {
	const valueRe = asReal(value, "log");
	let logFactor;
	switch (kind) {
		case "linear":
			logFactor = 10;
			break;
		case "quadratic": logFactor = 20;
	}
	let ratio;
	switch (from) {
		case "db":
			ratio = 10 ** (valueRe / logFactor);
			break;
		case "ratio": ratio = valueRe;
	}
	let converted;
	switch (to) {
		case "db":
			if (ratio <= 0) throw new Error("ratio must be positive");
			converted = logFactor * Math.log10(ratio);
			break;
		case "ratio": converted = ratio;
	}
	return new Complex(converted, 0);
}
//#endregion
//#region src/solvers/expression.ts
/** Kernel complex value → engine-native rect (finite-checked, -0 folded). */
function rectOf$6(value) {
	const snapshot = serializeComplex(value, "none");
	return {
		re: snapshot.re,
		im: snapshot.im
	};
}
const expressionSolvers = [{
	id: "calculate",
	summary: "Evaluate a string math expression and return the complex result",
	parameters: {
		expression: { type: "string" },
		variables: {
			type: "array",
			optional: true,
			items: {
				type: "object",
				fields: {
					name: { type: "string" },
					value: {
						type: "complex",
						kind: "none"
					}
				}
			}
		}
	},
	returns: {
		type: "complex",
		kind: "none"
	},
	run: (args) => {
		const variables = args.variables;
		const bindings = {};
		for (const binding of variables ?? []) bindings[binding.name] = toComplex(binding.value);
		return rectOf$6(calcExpression(args.expression, bindings));
	}
}, {
	id: "rational_coefficients",
	summary: "Reduce an expression in one variable to a rational function and return numerator/denominator coefficients",
	parameters: {
		expression: { type: "string" },
		variable: {
			type: "string",
			optional: true
		},
		reduce: {
			type: "boolean",
			optional: true
		},
		variables: {
			type: "array",
			optional: true,
			items: {
				type: "object",
				fields: {
					name: { type: "string" },
					value: {
						type: "complex",
						kind: "none"
					}
				}
			}
		}
	},
	returns: {
		type: "object",
		fields: {
			variable: { type: "string" },
			numeratorDegree: {
				type: "complex",
				kind: "none"
			},
			denominatorDegree: {
				type: "complex",
				kind: "none"
			},
			numerator: {
				type: "array",
				items: {
					type: "complex",
					kind: "none"
				}
			},
			denominator: {
				type: "array",
				items: {
					type: "complex",
					kind: "none"
				}
			}
		}
	},
	run: (args) => {
		const variable = args.variable ?? "x";
		const bindings = args.variables;
		const parameters = {};
		for (const binding of bindings ?? []) parameters[binding.name] = toComplex(binding.value);
		const { numerator, denominator } = reduceRational(args.expression, variable, args.reduce ?? true, parameters);
		return {
			variable,
			numeratorDegree: numerator.length - 1,
			denominatorDegree: denominator.length - 1,
			numerator: numerator.map((coefficient) => rectOf$6(coefficient)),
			denominator: denominator.map((coefficient) => rectOf$6(coefficient))
		};
	}
}];
//#endregion
//#region src/math/circuits.ts
/**
* Circuit mathematics. All functions operate on SI base units (Hz, Ω, F, H,
* V, A, s) and return plain numbers / complex.js values; engineering
* presentation is the tools' job.
*
* Declaration order: enums, then types, then module-private helpers, then
* public functions grouped by concept.
*/
function calcAngularFreq(frequency) {
	if (!Number.isFinite(frequency) || frequency <= 0) throw new Error("frequency must be a finite positive number (Hz)");
	return 2 * Math.PI * frequency;
}
/** Impedance of one lumped element at a frequency: R, jωL, 1/(jωC).
*  Module-private: the public entry is calcNetworkImpedance with a leaf node. */
function calcElementImpedance(kind, value, frequency) {
	const w = calcAngularFreq(frequency);
	switch (kind) {
		case "resistance": return new Complex(value, 0);
		case "inductance": return new Complex(0, w * value);
		case "capacitance": return new Complex(0, -1 / (w * value));
	}
}
/** Series combination: Z = Σ Zi. */
function combineSeriesImpedances(impedances) {
	if (impedances.length === 0) throw new Error("series combination needs at least one impedance");
	return impedances.reduce((sum, impedance) => sum.add(impedance), new Complex(0, 0));
}
/** Parallel combination: 1/Z = Σ 1/Zi. */
function combineParallelImpedances(impedances) {
	if (impedances.length === 0) throw new Error("parallel combination needs at least one impedance");
	const admittance = impedances.reduce((sum, impedance) => sum.add(impedance.inverse()), new Complex(0, 0));
	if (admittance.abs() === 0) throw new Error("parallel combination has zero total admittance (all open)");
	return admittance.inverse();
}
/** Total impedance of a (possibly nested) network at a frequency. */
function calcNetworkImpedance(node, frequency) {
	if ("kind" in node) return calcElementImpedance(node.kind, node.value, frequency);
	const parts = node.elements.map((child) => calcNetworkImpedance(child, frequency));
	switch (node.topology) {
		case "series": return combineSeriesImpedances(parts);
		case "parallel": return combineParallelImpedances(parts);
	}
}
/** Series resonance: resonantFrequency = 1/(2π√(LC)). Q and bandwidth need R (mode-aware). */
function calcResonance(inductance, capacitance, resistance, mode = "series") {
	if (!Number.isFinite(inductance) || inductance <= 0) throw new Error("inductance must be a finite positive number (H)");
	if (!Number.isFinite(capacitance) || capacitance <= 0) throw new Error("capacitance must be a finite positive number (F)");
	const resonantFrequency = 1 / (2 * Math.PI * Math.sqrt(inductance * capacitance));
	if (resistance === void 0 || !Number.isFinite(resistance)) return { resonantFrequency };
	if (resistance <= 0) throw new Error("resistance must be positive (Ω)");
	let qualityFactor;
	switch (mode) {
		case "series":
			qualityFactor = Math.sqrt(inductance / capacitance) / resistance;
			break;
		case "parallel": qualityFactor = resistance * Math.sqrt(capacitance / inductance);
	}
	return {
		resonantFrequency,
		qualityFactor,
		bandwidth: resonantFrequency / qualityFactor
	};
}
/** AC power from RMS values: S = V·I, P = S·cosφ, Q = S·sinφ, pf = cosφ.
*  The phase angle is in radians (SI). */
function calcAcPower(rmsVoltage, rmsCurrent, phaseAngle = 0) {
	if (rmsVoltage < 0 || rmsCurrent < 0) throw new Error("RMS values must be non-negative");
	const phi = phaseAngle;
	const apparent = rmsVoltage * rmsCurrent;
	return {
		apparent,
		real: apparent * Math.cos(phi),
		reactive: apparent * Math.sin(phi),
		powerFactor: Math.cos(phi)
	};
}
/**
* RC transient at time points (first order): capacitor voltage (state) and
* loop current. mode charge: v(t) = Vs(1−e^(−t/τ)); discharge: v(t) = V0·e^(−t/τ).
* Current: charge = (Vs − v)/R, discharge = v/R. τ = RC.
*/
function calcRcTransientSeries(mode, sourceVoltage, initialVoltage, resistance, capacitance, times) {
	if (resistance <= 0) throw new Error("resistance must be positive (Ω)");
	if (capacitance <= 0) throw new Error("capacitance must be positive (F)");
	for (const time of times) if (time < 0) throw new Error("time must be non-negative (s)");
	const timeConstant = resistance * capacitance;
	return {
		points: times.map((time) => {
			const exp = Math.exp(-time / timeConstant);
			let voltage;
			let current;
			switch (mode) {
				case "charge":
					voltage = sourceVoltage * (1 - exp);
					current = (sourceVoltage - voltage) / resistance;
					break;
				case "discharge":
					voltage = initialVoltage * exp;
					current = voltage / resistance;
			}
			return {
				time,
				voltage,
				current,
				timeConstant
			};
		}),
		timeConstant
	};
}
/**
* RL transient at time points (first order): inductor current (state) and
* inductor voltage. mode charge: i(t) = (Vs/R)(1−e^(−t/τ)); discharge:
* i(t) = I0·e^(−t/τ). Inductor voltage: charge = Vs·e^(−t/τ),
* discharge = I0·R·e^(−t/τ). τ = L/R.
*/
function calcRlTransientSeries(mode, sourceVoltage, initialCurrent, resistance, inductance, times) {
	if (resistance <= 0) throw new Error("resistance must be positive (Ω)");
	if (inductance <= 0) throw new Error("inductance must be positive (H)");
	for (const time of times) if (time < 0) throw new Error("time must be non-negative (s)");
	const timeConstant = inductance / resistance;
	return {
		points: times.map((time) => {
			const exp = Math.exp(-time / timeConstant);
			let current;
			let voltage;
			switch (mode) {
				case "charge":
					current = sourceVoltage / resistance * (1 - exp);
					voltage = sourceVoltage * exp;
					break;
				case "discharge":
					current = initialCurrent * exp;
					voltage = initialCurrent * resistance * exp;
			}
			return {
				time,
				current,
				voltage,
				timeConstant
			};
		}),
		timeConstant
	};
}
/**
* Series-RLC transient at time points (second order): capacitor voltage and
* loop current, closed form by damping regime (α = R/2L, ω₀ = 1/√(LC),
* ζ = α/ω₀). mode charge drives toward sourceVoltage, discharge toward zero;
* both initial conditions (capacitor voltage, inductor current) apply.
*/
function calcRlcTransientSeries(mode, sourceVoltage, initialVoltage, initialCurrent, resistance, capacitance, inductance, times) {
	if (resistance < 0) throw new Error("resistance must be non-negative (Ω)");
	if (capacitance <= 0) throw new Error("capacitance must be positive (F)");
	if (inductance <= 0) throw new Error("inductance must be positive (H)");
	for (const time of times) if (time < 0) throw new Error("time must be non-negative (s)");
	const alpha = resistance / (2 * inductance);
	const omega0 = 1 / Math.sqrt(inductance * capacitance);
	const dampingRatio = alpha / omega0;
	let finalVoltage;
	switch (mode) {
		case "charge":
			finalVoltage = sourceVoltage;
			break;
		case "discharge": finalVoltage = 0;
	}
	const critical = Math.abs(dampingRatio - 1) < 1e-9;
	return {
		points: times.map((time) => {
			let voltage;
			let current;
			if (dampingRatio < 1 && !critical) {
				const omegaD = Math.sqrt(omega0 * omega0 - alpha * alpha);
				const a = initialVoltage - finalVoltage;
				const b = (initialCurrent / capacitance + alpha * a) / omegaD;
				const decay = Math.exp(-alpha * time);
				const cos = Math.cos(omegaD * time);
				const sin = Math.sin(omegaD * time);
				voltage = finalVoltage + decay * (a * cos + b * sin);
				current = capacitance * decay * ((-alpha * a + omegaD * b) * cos - (alpha * b + omegaD * a) * sin);
			} else if (dampingRatio > 1 && !critical) {
				const root = Math.sqrt(alpha * alpha - omega0 * omega0);
				const s1 = -alpha + root;
				const s2 = -alpha - root;
				const a2 = (initialCurrent / capacitance - s1 * (initialVoltage - finalVoltage)) / (s2 - s1);
				const a1 = initialVoltage - finalVoltage - a2;
				voltage = finalVoltage + a1 * Math.exp(s1 * time) + a2 * Math.exp(s2 * time);
				current = capacitance * (a1 * s1 * Math.exp(s1 * time) + a2 * s2 * Math.exp(s2 * time));
			} else {
				const a = initialVoltage - finalVoltage;
				const b = initialCurrent / capacitance + alpha * a;
				const decay = Math.exp(-alpha * time);
				voltage = finalVoltage + (a + b * time) * decay;
				current = capacitance * (b - alpha * a - alpha * b * time) * decay;
			}
			return {
				time,
				voltage,
				current
			};
		}),
		alpha,
		omega0,
		dampingRatio,
		damping: critical ? "critical" : dampingRatio < 1 ? "underdamped" : "overdamped"
	};
}
//#endregion
//#region src/solvers/circuit.ts
/** Element kind → quantity kind: the leaf value object's kind must match. */
const ELEMENT_QUANTITY_KINDS = {
	["resistance"]: "resistance",
	["inductance"]: "inductance",
	["capacitance"]: "capacitance"
};
/** The three element kinds accepted as leaves (explicit set: enum reverse mappings are not emitted at runtime). */
const ELEMENT_KINDS = /* @__PURE__ */ new Set([
	"resistance",
	"inductance",
	"capacitance"
]);
/** Kernel complex value → engine-native rect (finite-checked, -0 folded). */
function rectOf$5(value) {
	const snapshot = serializeComplex(value, "none");
	return {
		re: snapshot.re,
		im: snapshot.im
	};
}
/** Validate a raw JSON network tree into a typed NetworkElement; leaves are
*  complex value objects of kind resistance|inductance|capacitance. */
function validateNetwork(input) {
	if (typeof input !== "object" || input === null) throw new Error("network must be an object");
	const node = input;
	if (typeof node["topology"] !== "string") {
		const kind = node["kind"];
		if (typeof kind !== "string" || !ELEMENT_KINDS.has(kind)) throw new Error(`unknown element kind "${String(kind)}"`);
		if (ELEMENT_QUANTITY_KINDS[kind] === void 0) throw new Error(`unknown element kind "${kind}"`);
		let value;
		try {
			value = toScalar(node);
		} catch (error) {
			throw new Error(`element "${kind}" needs a non-negative real ${kind} value (${error instanceof Error ? error.message : String(error)})`);
		}
		if (!Number.isFinite(value) || value < 0) throw new Error(`element "${kind}" needs a non-negative real value`);
		return {
			kind,
			value
		};
	}
	const elements = node["elements"];
	if (!Array.isArray(elements) || elements.length === 0) throw new Error("a group needs a non-empty elements array");
	return {
		topology: node["topology"],
		elements: elements.map((child) => validateNetwork(child))
	};
}
/** Parse the JSON-text network parameter into a typed NetworkElement. */
function parseNetwork(text) {
	let raw;
	try {
		raw = JSON.parse(text);
	} catch (error) {
		throw new Error(`network must be valid JSON text (${error instanceof Error ? error.message : String(error)})`);
	}
	return validateNetwork(raw);
}
const circuitSolvers = [
	{
		id: "equivalent_impedance",
		summary: "Total impedance of a set of impedances combined in series (Z = Σ Zi) or in parallel (1/Z = Σ 1/Zi)",
		parameters: {
			topology: {
				type: "string",
				enum: ["series", "parallel"]
			},
			impedances: {
				type: "array",
				items: {
					type: "complex",
					kind: "resistance"
				}
			}
		},
		returns: {
			type: "complex",
			kind: "resistance"
		},
		run: (args) => {
			const parts = args.impedances.map((item) => toComplex(item));
			const topology = args.topology;
			let total;
			switch (topology) {
				case "series":
					total = combineSeriesImpedances(parts);
					break;
				case "parallel":
					total = combineParallelImpedances(parts);
					break;
				default: throw new Error(`unknown topology "${String(args.topology)}"`);
			}
			return rectOf$5(total);
		}
	},
	{
		id: "circuit_impedance",
		summary: "Total driving-point impedance of a (possibly nested) series/parallel network at a frequency; network is JSON text of a tree of element leaves (kind resistance|inductance|capacitance) and series/parallel groups",
		parameters: {
			network: { type: "string" },
			frequency: {
				type: "complex",
				kind: "frequency"
			}
		},
		returns: {
			type: "complex",
			kind: "resistance"
		},
		run: (args) => {
			const frequency = toScalar(args.frequency);
			return rectOf$5(calcNetworkImpedance(parseNetwork(String(args.network)), frequency));
		}
	},
	{
		id: "resonance",
		summary: "Series/parallel LC resonance: resonantFrequency, qualityFactor and bandwidth (qualityFactor = (1/R)√(L/C) series, R√(C/L) parallel)",
		parameters: {
			inductance: {
				type: "complex",
				kind: "inductance"
			},
			capacitance: {
				type: "complex",
				kind: "capacitance"
			},
			resistance: {
				type: "complex",
				kind: "resistance"
			},
			mode: {
				type: "string",
				enum: ["series", "parallel"],
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				resonantFrequency: {
					type: "complex",
					kind: "frequency"
				},
				mode: { type: "string" },
				qualityFactor: {
					type: "complex",
					kind: "none"
				},
				bandwidth: {
					type: "complex",
					kind: "frequency"
				}
			}
		},
		run: (args) => {
			const inductance = toScalar(args.inductance);
			const capacitance = toScalar(args.capacitance);
			const resistance = toScalar(args.resistance);
			const mode = args.mode ?? "series";
			const result = calcResonance(inductance, capacitance, resistance, mode);
			if (result.qualityFactor === void 0 || result.bandwidth === void 0) throw new Error("resonance requires a finite resistance to compute qualityFactor and bandwidth");
			return {
				resonantFrequency: result.resonantFrequency,
				mode,
				qualityFactor: result.qualityFactor,
				bandwidth: result.bandwidth
			};
		}
	},
	{
		id: "ac_power",
		summary: "AC power from RMS values: apparent = V·I, real = apparent·cosφ, reactive = apparent·sinφ, powerFactor = cosφ; phaseAngle (radians) is the V–I phase angle",
		parameters: {
			rmsVoltage: {
				type: "complex",
				kind: "voltage"
			},
			rmsCurrent: {
				type: "complex",
				kind: "current"
			},
			phaseAngle: {
				type: "complex",
				kind: "angle",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				apparent: {
					type: "complex",
					kind: "power"
				},
				real: {
					type: "complex",
					kind: "power"
				},
				reactive: {
					type: "complex",
					kind: "power"
				},
				powerFactor: {
					type: "complex",
					kind: "none"
				}
			}
		},
		run: (args) => {
			const { apparent, real, reactive, powerFactor } = calcAcPower(toScalar(args.rmsVoltage), toScalar(args.rmsCurrent), args.phaseAngle === void 0 ? 0 : toScalar(args.phaseAngle));
			return {
				apparent,
				real,
				reactive,
				powerFactor
			};
		}
	},
	{
		id: "transient_response",
		summary: "First- or second-order charge/discharge transient at a list of time points; returns one point per time with voltage and current",
		parameters: {
			kind: {
				type: "string",
				enum: [
					"rc",
					"rl",
					"rlc"
				]
			},
			mode: {
				type: "string",
				enum: ["charge", "discharge"]
			},
			sourceVoltage: {
				type: "complex",
				kind: "voltage",
				optional: true
			},
			initialVoltage: {
				type: "complex",
				kind: "voltage",
				optional: true
			},
			initialCurrent: {
				type: "complex",
				kind: "current",
				optional: true
			},
			resistance: {
				type: "complex",
				kind: "resistance"
			},
			capacitance: {
				type: "complex",
				kind: "capacitance",
				optional: true
			},
			inductance: {
				type: "complex",
				kind: "inductance",
				optional: true
			},
			times: {
				type: "array",
				items: {
					type: "complex",
					kind: "time"
				}
			}
		},
		returns: {
			type: "object",
			fields: {
				kind: { type: "string" },
				mode: { type: "string" },
				points: {
					type: "array",
					items: {
						type: "object",
						fields: {
							time: {
								type: "complex",
								kind: "time"
							},
							voltage: {
								type: "complex",
								kind: "voltage"
							},
							current: {
								type: "complex",
								kind: "current"
							}
						}
					}
				}
			}
		},
		run: (args) => {
			const kind = args.kind;
			const mode = args.mode;
			const resistance = toScalar(args.resistance);
			const times = args.times.map((item) => toScalar(item));
			const sourceVoltage = args.sourceVoltage === void 0 ? 0 : toScalar(args.sourceVoltage);
			const serialize = (point) => ({
				time: point.time,
				voltage: point.voltage,
				current: point.current
			});
			switch (kind) {
				case "rl": {
					if (args.inductance === void 0) throw new Error("rl kind requires inductance");
					const inductance = toScalar(args.inductance);
					const initialCurrent = args.initialCurrent === void 0 ? 0 : toScalar(args.initialCurrent);
					if (mode === "charge" && args.sourceVoltage === void 0) throw new Error("charge mode requires sourceVoltage");
					if (mode === "discharge" && args.initialCurrent === void 0) throw new Error("discharge mode requires initialCurrent");
					const { points } = calcRlTransientSeries(mode, sourceVoltage, initialCurrent, resistance, inductance, times);
					return {
						kind,
						mode,
						points: points.map(serialize)
					};
				}
				case "rc": {
					if (args.capacitance === void 0) throw new Error("rc kind requires capacitance");
					const capacitance = toScalar(args.capacitance);
					const initialVoltage = args.initialVoltage === void 0 ? 0 : toScalar(args.initialVoltage);
					if (mode === "charge" && args.sourceVoltage === void 0) throw new Error("charge mode requires sourceVoltage");
					if (mode === "discharge" && args.initialVoltage === void 0) throw new Error("discharge mode requires initialVoltage");
					const { points } = calcRcTransientSeries(mode, sourceVoltage, initialVoltage, resistance, capacitance, times);
					return {
						kind,
						mode,
						points: points.map(serialize)
					};
				}
				case "rlc": {
					if (args.capacitance === void 0) throw new Error("rlc kind requires capacitance");
					if (args.inductance === void 0) throw new Error("rlc kind requires inductance");
					const capacitance = toScalar(args.capacitance);
					const inductance = toScalar(args.inductance);
					const initialVoltage = args.initialVoltage === void 0 ? 0 : toScalar(args.initialVoltage);
					const initialCurrent = args.initialCurrent === void 0 ? 0 : toScalar(args.initialCurrent);
					if (mode === "charge" && args.sourceVoltage === void 0) throw new Error("charge mode requires sourceVoltage");
					if (mode === "discharge" && args.initialVoltage === void 0 && args.initialCurrent === void 0) throw new Error("discharge mode requires initialVoltage or initialCurrent");
					return {
						kind,
						mode,
						points: calcRlcTransientSeries(mode, sourceVoltage, initialVoltage, initialCurrent, resistance, capacitance, inductance, times).points.map(serialize)
					};
				}
				default: throw new Error(`unknown transient kind "${String(kind)}"`);
			}
		}
	}
];
//#endregion
//#region src/math/smith.ts
/** Pure mappings: match side → element role (used by designLNetworkMatch). */
const SHUNT_ROLE = {
	["source"]: "shunt-source",
	["load"]: "shunt-load"
};
const SERIES_ROLE = {
	["source"]: "series-source",
	["load"]: "series-load"
};
/** Reflection coefficient: Γ = (Z − Z0) / (Z + Z0). */
function convertImpedanceToReflection(impedance, referenceImpedance) {
	if (!Number.isFinite(referenceImpedance) || referenceImpedance <= 0) throw new Error("reference impedance must be a positive number (Ω)");
	return impedance.sub(referenceImpedance).div(impedance.add(referenceImpedance));
}
/** VSWR = (1 + |Γ|) / (1 − |Γ|); |Γ| = 1 (open/short) yields Infinity. */
function convertReflectionToVswr(reflectionCoefficient) {
	const magnitude = reflectionCoefficient.abs();
	if (magnitude === 1) return Number.POSITIVE_INFINITY;
	if (magnitude > 1) throw new Error(`|Γ| = ${magnitude} > 1 — passive load reflection cannot exceed unity`);
	return (1 + magnitude) / (1 - magnitude);
}
/** Return loss in dB: −20·log10(|Γ|). |Γ| = 0 yields +Infinity (no reflection). */
function calcReturnLossDb(reflectionCoefficient) {
	const magnitude = reflectionCoefficient.abs();
	if (magnitude === 0) return Number.POSITIVE_INFINITY;
	return -20 * Math.log10(magnitude);
}
/** Quarter-wave transformer: Z1 = √(Z0·ZL). ZL must be real and positive. */
function calcQuarterWaveImpedance(lineImpedance, loadImpedance) {
	if (lineImpedance <= 0 || loadImpedance <= 0) throw new Error("impedances must be positive (Ω)");
	return Math.sqrt(lineImpedance * loadImpedance);
}
/** Inductance (H) for a positive reactance at ω; undefined for a negative one. */
function calcInductanceFromReactance(reactance, angularFrequency) {
	return reactance > 0 ? reactance / angularFrequency : void 0;
}
/** Capacitance (F) for a negative reactance at ω; undefined for a positive one. */
function calcCapacitanceFromReactance(reactance, angularFrequency) {
	return reactance < 0 ? -1 / (angularFrequency * reactance) : void 0;
}
/**
* L-network matching between two real resistances.
* Q = √(Rl/Rs − 1); series element (X = Q·Rs) sits next to the SMALLER, shunt element (X = Rl/Q) next to the LARGER one.
* Two conjugate solutions (low-pass / high-pass variants) are returned as ordered element lists.
*/
function designLNetworkMatch(sourceImpedance, loadImpedance, frequency) {
	if (sourceImpedance <= 0 || loadImpedance <= 0) throw new Error("impedances must be positive (Ω)");
	if (frequency <= 0) throw new Error("frequency must be positive (Hz)");
	if (sourceImpedance === loadImpedance) return {
		matched: true,
		seriesSide: "source",
		shuntSide: "load"
	};
	const smaller = Math.min(sourceImpedance, loadImpedance);
	const larger = Math.max(sourceImpedance, loadImpedance);
	const seriesSide = sourceImpedance < loadImpedance ? "source" : "load";
	const shuntSide = sourceImpedance < loadImpedance ? "load" : "source";
	const qualityFactor = Math.sqrt(larger / smaller - 1);
	const seriesReactance = qualityFactor * smaller;
	const shuntReactance = larger / qualityFactor;
	const seriesRole = SERIES_ROLE[seriesSide];
	const shuntRole = SHUNT_ROLE[shuntSide];
	return {
		matched: false,
		qualityFactor,
		seriesSide,
		shuntSide,
		solutions: {
			["low-pass"]: [{
				role: seriesRole,
				reactance: seriesReactance
			}, {
				role: shuntRole,
				reactance: -shuntReactance
			}],
			["high-pass"]: [{
				role: seriesRole,
				reactance: -seriesReactance
			}, {
				role: shuntRole,
				reactance: shuntReactance
			}]
		}
	};
}
/**
* Design a pi network matching two real resistances with a specified Q.
* Formulas (Bowick): with Rs < Rl and Q > QL = √(Rl/Rs − 1):
*   Rint = Rs/(1+Q²); Xp1 = Rs/Q; Q2 = √(Rl/Rint − 1);
*   Xp2 = Rl/Q2; Xs = Rint·(Q + Q2).
*/
function designPiNetworkMatch(sourceImpedance, loadImpedance, qualityFactor) {
	const [small, large, flipped] = sourceImpedance <= loadImpedance ? [
		sourceImpedance,
		loadImpedance,
		false
	] : [
		loadImpedance,
		sourceImpedance,
		true
	];
	const minimumQ = Math.sqrt(large / small - 1);
	if (qualityFactor <= minimumQ) throw new Error(`pi network: qualityFactor ${qualityFactor} must exceed the L-network minimum ${minimumQ.toFixed(3)}`);
	const q = qualityFactor;
	const rint = small / (1 + q * q);
	const q2 = Math.sqrt(large / rint - 1);
	const xp1 = small / q;
	const xp2 = large / q2;
	const xs = rint * (q + q2);
	const shuntSource = flipped ? "shunt-load" : "shunt-source";
	const shuntLoad = flipped ? "shunt-source" : "shunt-load";
	return {
		["low-pass"]: [
			{
				role: shuntSource,
				reactance: -xp1
			},
			{
				role: "series",
				reactance: xs
			},
			{
				role: shuntLoad,
				reactance: -xp2
			}
		],
		["high-pass"]: [
			{
				role: shuntSource,
				reactance: xp1
			},
			{
				role: "series",
				reactance: -xs
			},
			{
				role: shuntLoad,
				reactance: xp2
			}
		]
	};
}
/**
* Design a T network matching two real resistances with a specified Q.
*
* A T network is two back-to-back L networks sharing an intermediate
* resistance Rp (Rs → Rp step-up, then Rp → Rl step-down). The two shunt
* elements sit at the same junction and merge into one:
*   Q1 = √(Rp/Rs − 1), Q2 = √(Rp/Rl − 1), Q = Q1 + Q2
* Rp is solved implicitly from the specified Q (bisection), then:
*   Xs1 = Q1·Rs; Xs2 = Q2·Rl; Xp = Rp/Q.
*/
function designTNetworkMatch(sourceImpedance, loadImpedance, qualityFactor) {
	const [small, large, flipped] = sourceImpedance <= loadImpedance ? [
		sourceImpedance,
		loadImpedance,
		false
	] : [
		loadImpedance,
		sourceImpedance,
		true
	];
	const minimumQ = Math.sqrt(large / small - 1);
	if (qualityFactor <= minimumQ) throw new Error(`t network: qualityFactor ${qualityFactor} must exceed the L-network minimum ${minimumQ.toFixed(3)}`);
	const target = (rp) => Math.sqrt(rp / small - 1) + Math.sqrt(rp / large - 1) - qualityFactor;
	let lower = large;
	let upper = large;
	while (target(upper) < 0) upper *= 2;
	for (let i = 0; i < 80; i++) {
		const mid = (lower + upper) / 2;
		if (target(mid) < 0) lower = mid;
		else upper = mid;
	}
	const rp = (lower + upper) / 2;
	const q1 = Math.sqrt(rp / small - 1);
	const q2 = Math.sqrt(rp / large - 1);
	const xs1 = q1 * small;
	const xs2 = q2 * large;
	const xp = rp / qualityFactor;
	const seriesSource = flipped ? "series-load" : "series-source";
	const seriesLoad = flipped ? "series-source" : "series-load";
	return {
		["low-pass"]: [
			{
				role: seriesSource,
				reactance: xs1
			},
			{
				role: "shunt-source",
				reactance: -xp
			},
			{
				role: seriesLoad,
				reactance: xs2
			}
		],
		["high-pass"]: [
			{
				role: seriesSource,
				reactance: -xs1
			},
			{
				role: "shunt-source",
				reactance: xp
			},
			{
				role: seriesLoad,
				reactance: -xs2
			}
		]
	};
}
/** Design any supported matching topology; 'l' uses the implied Q, 'pi'/'t' need a specified Q. */
function designMatch(topology, sourceImpedance, loadImpedance, frequency, qualityFactor) {
	if (sourceImpedance <= 0 || loadImpedance <= 0) throw new Error("impedances must be positive (Ω)");
	if (frequency <= 0) throw new Error("frequency must be positive (Hz)");
	if (sourceImpedance === loadImpedance) throw new Error("source and load are already equal — no network needed");
	switch (topology) {
		case "pi":
			if (qualityFactor === void 0) throw new Error("pi network requires a qualityFactor");
			return {
				topology,
				qualityFactor,
				solutions: designPiNetworkMatch(sourceImpedance, loadImpedance, qualityFactor)
			};
		case "t":
			if (qualityFactor === void 0) throw new Error("t network requires a qualityFactor");
			return {
				topology,
				qualityFactor,
				solutions: designTNetworkMatch(sourceImpedance, loadImpedance, qualityFactor)
			};
		case "l": {
			const result = designLNetworkMatch(sourceImpedance, loadImpedance, frequency);
			if (result.matched) throw new Error("source and load are already equal — no network needed");
			return {
				topology,
				qualityFactor: result.qualityFactor,
				solutions: result.solutions
			};
		}
	}
}
//#endregion
//#region src/solvers/smith.ts
/**
* Engine solver definitions migrated from src/tools/smith-tools.ts —
* one SolverDef per legacy defineJsonTool. run bodies mirror the old executes
* (SI base units; toScalar/toComplex unwrapping preserved); real results
* come back as plain numbers, complex ones as rect complex values.
*
* Migration notes (documented deviations from the legacy tool surface):
* - reflection_to_vswr / return_loss: the legacy tools declared an `infinite`
*   boolean for the |Γ| = 1 / |Γ| = 0 extremes, but their serializers threw
*   on non-finite numbers before that flag could ever be returned (and the
*   engine value universe cannot carry Infinity either), so the migrated
*   solvers return only the finite vswr / returnLossDb and those extremes throw.
* - matched_network: each legacy element carried reactance plus exactly one
*   of inductance (H, positive reactance) or capacitance (F, negative
*   reactance) — an engine quantity has one fixed kind per field, so each
*   element now carries role, reactance, a kind string (inductance or
*   capacitance) and the component magnitude as a kind-None value.
*/
/** Kernel complex value → engine-native rect (finite-checked, -0 folded). */
function rectOf$4(value) {
	const snapshot = serializeComplex(value, "none");
	return {
		re: snapshot.re,
		im: snapshot.im
	};
}
const smithSolvers = [
	{
		id: "impedance_to_reflection",
		summary: "Reflection coefficient Γ = (Z − Z0) / (Z + Z0) for an impedance on a referenceImpedance line (default 50 Ω)",
		parameters: {
			impedance: {
				type: "complex",
				kind: "resistance"
			},
			referenceImpedance: {
				type: "complex",
				kind: "resistance",
				optional: true
			}
		},
		returns: {
			type: "complex",
			kind: "none"
		},
		run: (args) => {
			return rectOf$4(convertImpedanceToReflection(toComplex(args.impedance), args.referenceImpedance === void 0 ? 50 : toScalar(args.referenceImpedance)));
		}
	},
	{
		id: "reflection_to_vswr",
		summary: "Voltage standing wave ratio from a reflection coefficient: vswr = (1+|Γ|)/(1−|Γ|); |Γ| = 1 (open/short) is unbounded and throws because the value universe holds no infinity",
		parameters: { reflectionCoefficient: {
			type: "complex",
			kind: "none"
		} },
		returns: {
			type: "object",
			fields: { vswr: {
				type: "complex",
				kind: "none"
			} }
		},
		run: (args) => {
			return { vswr: convertReflectionToVswr(toComplex(args.reflectionCoefficient)) };
		}
	},
	{
		id: "return_loss",
		summary: "Return loss in dB: −20·log10(|Γ|); |Γ| = 0 (perfect match) is unbounded and throws because the value universe holds no infinity",
		parameters: { reflectionCoefficient: {
			type: "complex",
			kind: "none"
		} },
		returns: {
			type: "object",
			fields: { returnLossDb: {
				type: "complex",
				kind: "log"
			} }
		},
		run: (args) => {
			return { returnLossDb: calcReturnLossDb(toComplex(args.reflectionCoefficient)) };
		}
	},
	{
		id: "quarter_wave_transformer",
		summary: "Quarter-wave transformer characteristic impedance: Z1 = √(Z0·ZL), matching a real load impedance to a line impedance",
		parameters: {
			lineImpedance: {
				type: "complex",
				kind: "resistance"
			},
			loadImpedance: {
				type: "complex",
				kind: "resistance"
			}
		},
		returns: {
			type: "complex",
			kind: "resistance"
		},
		run: (args) => {
			const lineImpedance = toScalar(args.lineImpedance);
			const loadImpedance = toScalar(args.loadImpedance);
			return rectOf$4(new Complex(calcQuarterWaveImpedance(lineImpedance, loadImpedance), 0));
		}
	},
	{
		id: "matched_network",
		summary: "Design a matching network between two real resistances at a frequency: topology l uses the implied quality factor √(Rl/Rs − 1), pi and t need a qualityFactor above that minimum; returns low-pass/high-pass conjugate solutions as ordered elements",
		parameters: {
			topology: {
				type: "string",
				enum: [
					"l",
					"pi",
					"t"
				]
			},
			sourceImpedance: {
				type: "complex",
				kind: "resistance"
			},
			loadImpedance: {
				type: "complex",
				kind: "resistance"
			},
			frequency: {
				type: "complex",
				kind: "frequency"
			},
			qualityFactor: {
				type: "complex",
				kind: "none",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				topology: { type: "string" },
				qualityFactor: {
					type: "complex",
					kind: "none"
				},
				solutions: {
					type: "object",
					fields: {
						"low-pass": {
							type: "object",
							fields: { elements: {
								type: "array",
								items: {
									type: "object",
									fields: {
										role: { type: "string" },
										reactance: {
											type: "complex",
											kind: "resistance"
										},
										kind: { type: "string" },
										value: {
											type: "complex",
											kind: "none"
										}
									}
								}
							} }
						},
						"high-pass": {
							type: "object",
							fields: { elements: {
								type: "array",
								items: {
									type: "object",
									fields: {
										role: { type: "string" },
										reactance: {
											type: "complex",
											kind: "resistance"
										},
										kind: { type: "string" },
										value: {
											type: "complex",
											kind: "none"
										}
									}
								}
							} }
						}
					}
				}
			}
		},
		run: (args) => {
			const sourceImpedance = toScalar(args.sourceImpedance);
			const loadImpedance = toScalar(args.loadImpedance);
			const frequency = toScalar(args.frequency);
			const qualityFactor = args.qualityFactor === void 0 ? void 0 : toScalar(args.qualityFactor);
			const design = designMatch(args.topology, sourceImpedance, loadImpedance, frequency, qualityFactor);
			const angularFrequency = 2 * Math.PI * frequency;
			const serialize = (elements) => elements.map((element) => {
				const inductance = calcInductanceFromReactance(element.reactance, angularFrequency);
				if (inductance !== void 0) return {
					role: element.role,
					reactance: element.reactance,
					kind: "inductance",
					value: inductance
				};
				const capacitance = calcCapacitanceFromReactance(element.reactance, angularFrequency);
				if (capacitance !== void 0) return {
					role: element.role,
					reactance: element.reactance,
					kind: "capacitance",
					value: capacitance
				};
				throw new Error("match element has zero reactance — cannot size a component");
			});
			return {
				topology: design.topology,
				qualityFactor: design.qualityFactor,
				solutions: {
					["low-pass"]: { elements: serialize(design.solutions["low-pass"]) },
					["high-pass"]: { elements: serialize(design.solutions["high-pass"]) }
				}
			};
		}
	}
];
//#endregion
//#region src/math/dft.ts
/**
* Frequency-domain mathematics: DFT/IDFT, Fourier series of standard
* periodic waveforms, and window functions. SI base units; plain
* complex.js values.
*/
/**
* DFT: X[k] = Σₙ x[n]·e^{−j2πkn/N}. Power-of-two lengths use the radix-2
* Cooley-Tukey FFT (O(N log N)); other lengths fall back to the direct
* definition (O(N²)). Both are numerically identical to the definition.
*/
function calcDiscreteFourierTransform(samples) {
	const size = samples.length;
	if (size === 0) return [];
	if (isPowerOfTwo(size)) return fftRadix2(samples);
	return dftDirect(samples);
}
/** IDFT: x[n] = (1/N)·Σₖ X[k]·e^{+j2πkn/N}. The inverse reuses the forward
*  FFT through conjugation: x = conj(FFT(conj(X)))/N. */
function calcInvDiscreteFourierTransform(spectrum) {
	const size = spectrum.length;
	if (size === 0) return [];
	if (isPowerOfTwo(size)) return fftRadix2(spectrum.map((bin) => bin.conjugate())).map((sample) => sample.conjugate().div(size));
	return idftDirect(spectrum);
}
/** Direct DFT from the definition (fallback for non-power-of-two lengths). */
function dftDirect(samples) {
	const size = samples.length;
	return samples.map((_, k) => {
		let sum = new Complex(0, 0);
		for (let n = 0; n < size; n++) {
			const angle = -2 * Math.PI * k * n / size;
			sum = sum.add(samples[n].mul(new Complex(Math.cos(angle), Math.sin(angle))));
		}
		return sum;
	});
}
/** Direct IDFT from the definition (fallback for non-power-of-two lengths). */
function idftDirect(spectrum) {
	const size = spectrum.length;
	return spectrum.map((_, n) => {
		let sum = new Complex(0, 0);
		for (let k = 0; k < size; k++) {
			const angle = 2 * Math.PI * k * n / size;
			sum = sum.add(spectrum[k].mul(new Complex(Math.cos(angle), Math.sin(angle))));
		}
		return sum.div(size);
	});
}
/** Radix-2 iterative Cooley-Tukey FFT (in-place bit reversal + butterflies). */
function fftRadix2(samples) {
	const size = samples.length;
	const result = samples.slice();
	for (let i = 1, j = 0; i < size; i++) {
		let bit = size >> 1;
		for (; (j & bit) !== 0; bit >>= 1) j ^= bit;
		j ^= bit;
		if (i < j) {
			const tmp = result[i];
			result[i] = result[j];
			result[j] = tmp;
		}
	}
	for (let length = 2; length <= size; length <<= 1) {
		const angle = -2 * Math.PI / length;
		const twiddleStep = new Complex(Math.cos(angle), Math.sin(angle));
		for (let start = 0; start < size; start += length) {
			let twiddle = new Complex(1, 0);
			const half = length / 2;
			for (let k = 0; k < half; k++) {
				const even = result[start + k];
				const odd = result[start + k + half].mul(twiddle);
				result[start + k] = even.add(odd);
				result[start + k + half] = even.sub(odd);
				twiddle = twiddle.mul(twiddleStep);
			}
		}
	}
	return result;
}
/** Whether N is a positive power of two. */
function isPowerOfTwo(size) {
	return size > 0 && (size & size - 1) === 0;
}
/**
* Fourier coefficients of standard odd-symmetric periodic waveforms with
* peak amplitude `amplitude` (default 1): DC 0, cosine 0, sine per the
* standard series. Harmonics are 1..harmonics.
*/
function calcFourierSeriesCoeffs(waveform, harmonics, amplitude = 1) {
	if (harmonics < 0) throw new Error("harmonics must be non-negative");
	switch (waveform) {
		case "square": {
			const sine = [];
			for (let n = 1; n <= harmonics; n++) sine.push(n % 2 === 1 ? 4 * amplitude / (n * Math.PI) : 0);
			return {
				dc: 0,
				cosine: new Array(harmonics).fill(0),
				sine
			};
		}
		case "triangle": {
			const sine = [];
			for (let n = 1; n <= harmonics; n++) sine.push(8 * amplitude * Math.sin(n * Math.PI / 2) / (n * n * Math.PI * Math.PI));
			return {
				dc: 0,
				cosine: new Array(harmonics).fill(0),
				sine
			};
		}
		case "sawtooth": {
			const sine = [];
			for (let n = 1; n <= harmonics; n++) sine.push(2 * amplitude * (n % 2 === 1 ? 1 : -1) / (n * Math.PI));
			return {
				dc: 0,
				cosine: new Array(harmonics).fill(0),
				sine
			};
		}
	}
}
/** Window coefficients for a length-N sequence (N = 1 yields [1]). */
function calcWindowSamples(kind, length) {
	if (length <= 0) throw new Error("window length must be positive");
	if (length === 1) return [1];
	const samples = [];
	for (let n = 0; n < length; n++) {
		const angle = 2 * Math.PI * n / (length - 1);
		switch (kind) {
			case "none":
				samples.push(1);
				break;
			case "hann":
				samples.push(.5 * (1 - Math.cos(angle)));
				break;
			case "hamming":
				samples.push(.54 - .46 * Math.cos(angle));
				break;
			case "blackman": samples.push(.42 - .5 * Math.cos(angle) + .08 * Math.cos(2 * angle));
		}
	}
	return samples;
}
/** Apply window weights to a sample sequence (weight i multiplies sample i). */
function applyWindow(samples, weights) {
	return samples.map((sample, i) => sample.mul(weights[i]));
}
/**
* Signal statistics: RMS (√mean|x|²), peak |x|, peak-to-peak of the real
* part, and DC (mean of the real part).
*/
function calcSignalStatistics(samples) {
	if (samples.length === 0) throw new Error("samples must not be empty");
	let sumSquares = 0;
	let peak = 0;
	let dcSum = 0;
	let minimum = Number.POSITIVE_INFINITY;
	let maximum = Number.NEGATIVE_INFINITY;
	for (const sample of samples) {
		const magnitude = sample.abs();
		sumSquares += magnitude * magnitude;
		peak = Math.max(peak, magnitude);
		dcSum += sample.re;
		minimum = Math.min(minimum, sample.re);
		maximum = Math.max(maximum, sample.re);
	}
	const count = samples.length;
	return {
		rms: Math.sqrt(sumSquares / count),
		peak,
		peakToPeak: maximum - minimum,
		dc: dcSum / count
	};
}
/**
* Signal analysis: statistics plus the windowed spectrum in one call.
* Composes calcSignalStatistics, the window and the FFT (all existing
* primitives).
*/
function calcSignalAnalysis(samples, window) {
	const statistics = calcSignalStatistics(samples);
	const weighted = applyWindow(samples, calcWindowSamples(window, samples.length));
	return {
		...statistics,
		spectrum: calcDiscreteFourierTransform(weighted)
	};
}
//#endregion
//#region src/solvers/dft.ts
/** Kernel complex value → engine-native rect (finite-checked, -0 folded). */
function rectOf$3(value) {
	const snapshot = serializeComplex(value, "none");
	return {
		re: snapshot.re,
		im: snapshot.im
	};
}
const sequenceArray = {
	type: "array",
	items: {
		type: "complex",
		kind: "none"
	}
};
const windowParam = {
	type: "string",
	enum: [
		"none",
		"hann",
		"hamming",
		"blackman"
	],
	optional: true
};
const dftSolvers = [
	{
		id: "discrete_fourier_transform",
		summary: "DFT of a complex sample sequence (optionally windowed)",
		parameters: {
			samples: sequenceArray,
			window: windowParam
		},
		returns: {
			type: "object",
			fields: {
				window: { type: "string" },
				spectrum: {
					type: "array",
					items: {
						type: "complex",
						kind: "none"
					}
				}
			}
		},
		run: (args) => {
			const window = args.window ?? "none";
			const samples = args.samples.map((sample) => toComplex(sample));
			return {
				window,
				spectrum: calcDiscreteFourierTransform(applyWindow(samples, calcWindowSamples(window, samples.length))).map((bin) => rectOf$3(bin))
			};
		}
	},
	{
		id: "inverse_discrete_fourier_transform",
		summary: "IDFT of a spectrum: recovers the time-domain sequence (round-trip of the DFT)",
		parameters: { spectrum: sequenceArray },
		returns: {
			type: "object",
			fields: { samples: {
				type: "array",
				items: {
					type: "complex",
					kind: "none"
				}
			} }
		},
		run: (args) => {
			return { samples: calcInvDiscreteFourierTransform(args.spectrum.map((bin) => toComplex(bin))).map((sample) => rectOf$3(sample)) };
		}
	},
	{
		id: "fourier_series_coefficients",
		summary: "Fourier series coefficients (a₀, aₙ, bₙ) of a standard odd-symmetric waveform",
		parameters: {
			waveform: {
				type: "string",
				enum: [
					"square",
					"triangle",
					"sawtooth"
				]
			},
			harmonics: {
				type: "complex",
				kind: "none"
			},
			amplitude: {
				type: "complex",
				kind: "none",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				waveform: { type: "string" },
				harmonics: {
					type: "complex",
					kind: "none"
				},
				dc: {
					type: "complex",
					kind: "none"
				},
				cosine: {
					type: "array",
					items: {
						type: "complex",
						kind: "none"
					}
				},
				sine: {
					type: "array",
					items: {
						type: "complex",
						kind: "none"
					}
				}
			}
		},
		run: (args) => {
			const waveform = args.waveform;
			const harmonics = args.harmonics;
			const coefficients = calcFourierSeriesCoeffs(waveform, harmonics, args.amplitude === void 0 ? 1 : toScalar(args.amplitude));
			return {
				waveform,
				harmonics,
				dc: coefficients.dc,
				cosine: coefficients.cosine,
				sine: coefficients.sine
			};
		}
	},
	{
		id: "signal_analysis",
		summary: "Signal statistics plus the windowed spectrum in one call (RMS, peak, peak-to-peak, DC)",
		parameters: {
			samples: sequenceArray,
			window: windowParam
		},
		returns: {
			type: "object",
			fields: {
				window: { type: "string" },
				rms: {
					type: "complex",
					kind: "none"
				},
				peak: {
					type: "complex",
					kind: "none"
				},
				peakToPeak: {
					type: "complex",
					kind: "none"
				},
				dc: {
					type: "complex",
					kind: "none"
				},
				spectrum: {
					type: "array",
					items: {
						type: "complex",
						kind: "none"
					}
				}
			}
		},
		run: (args) => {
			const window = args.window ?? "none";
			const result = calcSignalAnalysis(args.samples.map((sample) => toComplex(sample)), window);
			return {
				window,
				rms: result.rms,
				peak: result.peak,
				peakToPeak: result.peakToPeak,
				dc: result.dc,
				spectrum: result.spectrum.map((bin) => rectOf$3(bin))
			};
		}
	}
];
//#endregion
//#region src/solvers/polynomial.ts
/** Kernel complex value → engine-native rect (finite-checked, -0 folded). */
function rectOf$2(value) {
	const snapshot = serializeComplex(value, "none");
	return {
		re: snapshot.re,
		im: snapshot.im
	};
}
const coefficientArray$1 = {
	type: "array",
	items: {
		type: "complex",
		kind: "none"
	}
};
const polynomialSolvers = [{
	id: "poles_zeros",
	summary: "Poles and zeros of a ratio-form transfer function",
	parameters: {
		numerator: coefficientArray$1,
		denominator: coefficientArray$1
	},
	returns: {
		type: "object",
		fields: {
			numeratorDegree: {
				type: "complex",
				kind: "none"
			},
			denominatorDegree: {
				type: "complex",
				kind: "none"
			},
			zeros: {
				type: "array",
				items: {
					type: "complex",
					kind: "none"
				}
			},
			poles: {
				type: "array",
				items: {
					type: "complex",
					kind: "none"
				}
			}
		}
	},
	run: (args) => {
		const numerator = args.numerator.map((value) => toComplex(value));
		const denominator = args.denominator.map((value) => toComplex(value));
		const { zeros, poles } = findPolesZeros(numerator, denominator);
		return {
			numeratorDegree: numerator.length - 1,
			denominatorDegree: denominator.length - 1,
			zeros: zeros.map((root) => rectOf$2(root)),
			poles: poles.map((root) => rectOf$2(root))
		};
	}
}, {
	id: "power_series_expansion",
	summary: "Power-series expansion of a z-domain transfer function about z⁻¹ (impulse response)",
	parameters: {
		numerator: coefficientArray$1,
		denominator: coefficientArray$1,
		count: {
			type: "complex",
			kind: "none"
		}
	},
	returns: {
		type: "object",
		fields: {
			count: {
				type: "complex",
				kind: "none"
			},
			coefficients: {
				type: "array",
				items: {
					type: "complex",
					kind: "none"
				}
			}
		}
	},
	run: (args) => {
		const numerator = args.numerator.map((value) => toComplex(value));
		const denominator = args.denominator.map((value) => toComplex(value));
		const count = args.count;
		return {
			count,
			coefficients: expandPowerSeries(numerator, denominator, count).map((coefficient) => rectOf$2(coefficient))
		};
	}
}];
//#endregion
//#region src/math/transfer.ts
/**
* System analysis mathematics: transfer functions in ratio form
* ({ numerator, denominator } descending coefficient arrays, the single
* storage form), partial-fraction expansion, frequency response, step
* response, and difference-equation recursion.
*/
/** H(σ) for each point: N(σ)/D(σ) by Horner evaluation. */
function calcTransferResponse(numerator, denominator, points) {
	return points.map((point) => evaluatePolynomial(numerator, point).div(evaluatePolynomial(denominator, point)));
}
/**
* Evaluation points for a frequency sweep: σ = jω in the s domain,
* σ = e^(jωT) in the z domain (sampleTime required, seconds).
*/
function calcFreqPoints(variable, frequencies, sampleTime) {
	return frequencies.map((frequency) => {
		const angularFrequency = 2 * Math.PI * frequency;
		let point;
		switch (variable) {
			case "z": {
				if (sampleTime === void 0) throw new Error("variable \"z\" requires sampleTime");
				const angle = angularFrequency * sampleTime;
				point = new Complex(Math.cos(angle), Math.sin(angle));
				break;
			}
			case "s": point = new Complex(0, angularFrequency);
		}
		return point;
	});
}
/**
* Logarithmically spaced frequency grid from start to end (Hz): the
* `pointsPerDecade` count is rounded to whole points per decade.
*/
function calcLogarithmicFrequencyGrid(start, end, pointsPerDecade) {
	if (start <= 0) throw new Error("frequency start must be positive (Hz)");
	if (end <= start) throw new Error("frequency end must exceed start (Hz)");
	if (pointsPerDecade < 1) throw new Error("pointsPerDecade must be ≥ 1");
	const decades = Math.log10(end / start);
	const points = Math.max(1, Math.round(decades * pointsPerDecade));
	const grid = [];
	for (let i = 0; i <= points; i++) grid.push(start * 10 ** (i / points * decades));
	return grid;
}
/**
* Bode response: the transfer function sampled on a logarithmic frequency
* grid, with magnitude in dB and phase in degrees. Composes the grid, the
* evaluation points and the response (all existing primitives).
*/
function calcBodeResponse(numerator, denominator, variable, frequencyStart, frequencyEnd, pointsPerDecade, sampleTime) {
	const frequencies = calcLogarithmicFrequencyGrid(frequencyStart, frequencyEnd, pointsPerDecade);
	const responses = calcTransferResponse(numerator, denominator, calcFreqPoints(variable, frequencies, sampleTime));
	return {
		frequencies,
		magnitudesDb: responses.map((response) => convertLogValue(response.abs(), "ratio", "db", "quadratic").re),
		phasesDeg: responses.map((response) => response.arg() * 180 / Math.PI)
	};
}
/**
* Partial-fraction expansion of N(s)/D(s) over the complex plane.
* Steps: long-divide off any polynomial part (deg N ≥ deg D), find and
* group the denominator roots, then solve the linear system
*   N(s) = Σ c·D(s)/(s−p)ᵒʳᵈᵉʳ
* for the residues — no numerical differentiation, exact for polynomial
* arithmetic.
*/
function expandPartialFraction(numerator, denominator) {
	const d = trimPolynomial(denominator);
	if (d.length <= 1) throw new Error("denominator must be at least degree 1");
	let n = trimPolynomial(numerator);
	let polynomial = [];
	if (n.length >= d.length) {
		const division = dividePolynomials(n, d);
		polynomial = division.quotient;
		n = trimPolynomial(division.remainder);
	}
	const roots = findPolyRoots(d);
	const poles = [];
	const sorted = roots.slice().sort((a, b) => a.re - b.re || a.im - b.im);
	for (const root of sorted) {
		const last = poles[poles.length - 1];
		if (last !== void 0 && last.pole.sub(root).abs() < 1e-8) last.multiplicity++;
		else poles.push({
			pole: root,
			multiplicity: 1
		});
	}
	const degree = d.length - 1;
	const columns = [];
	for (const { pole, multiplicity } of poles) {
		const factor = [new Complex(1, 0), pole.neg()];
		let power = [new Complex(1, 0)];
		for (let order = 1; order <= multiplicity; order++) {
			power = convolvePolynomials(power, factor);
			const quotientAscending = dividePolynomials(d, power).quotient.slice().reverse();
			const column = new Array(degree).fill(null).map(() => new Complex(0, 0));
			for (let i = 0; i < quotientAscending.length; i++) column[i] = quotientAscending[i];
			columns.push(column);
		}
	}
	const nAscending = n.slice().reverse();
	const b = new Array(degree).fill(null).map(() => new Complex(0, 0));
	for (let i = 0; i < nAscending.length; i++) b[i] = nAscending[i];
	const residues = solveLinearSystem(new Array(degree).fill(null).map((_, row) => columns.map((column) => column[row])), b);
	const terms = [];
	let index = 0;
	for (const { pole, multiplicity } of poles) for (let order = 1; order <= multiplicity; order++) terms.push({
		pole,
		order,
		residue: residues[index++]
	});
	return {
		polynomial,
		terms
	};
}
/** Gaussian elimination for a complex linear system (rows = equations). */
function solveLinearSystem(matrix, rhs) {
	const size = rhs.length;
	if (size === 0) return [];
	const augmented = matrix.map((row, i) => [...row, rhs[i]]);
	for (let col = 0; col < size; col++) {
		let pivot = col;
		for (let row = col + 1; row < size; row++) if (augmented[row][col].abs() > augmented[pivot][col].abs()) pivot = row;
		if (augmented[pivot][col].abs() === 0) throw new Error("singular system while solving partial-fraction residues");
		[augmented[col], augmented[pivot]] = [augmented[pivot], augmented[col]];
		const pivotValue = augmented[col][col];
		for (let row = 0; row < size; row++) {
			if (row === col) continue;
			const factor = augmented[row][col].div(pivotValue);
			for (let k = col; k <= size; k++) augmented[row][k] = augmented[row][k].sub(factor.mul(augmented[col][k]));
		}
	}
	return augmented.map((row, i) => row[size].div(row[i]));
}
/**
* Step response values y(t) of H(s) = N(s)/D(s): Y(s) = H(s)/s, expanded
* by partial fractions, each term c/(s−p)^k inverts to
* c·t^(k−1)/(k−1)!·e^(pt). Requires deg N ≤ deg D (physically realizable).
*/
function calcStepResponse(numerator, denominator, times) {
	const n = trimPolynomial(numerator);
	const d = trimPolynomial(denominator);
	if (n.length > d.length) throw new Error("step response requires numerator degree ≤ denominator degree");
	if (d.length === 0) throw new Error("denominator must be at least degree 1");
	const { terms } = expandPartialFraction(n, [...d, new Complex(0, 0)]);
	return times.map((t) => {
		let sum = new Complex(0, 0);
		for (const term of terms) {
			const exponential = term.pole.mul(t).exp();
			let tPower = new Complex(1, 0);
			let factorial = 1;
			for (let k = 1; k < term.order; k++) {
				tPower = tPower.mul(t);
				factorial *= k;
			}
			sum = sum.add(term.residue.mul(tPower).mul(exponential).div(factorial));
		}
		return sum;
	});
}
/**
* Difference-equation recursion (Laurent a/b convention, the natural
* form of a digital filter):
*   y[n] = (Σᵢ bᵢ·x[n−i] − Σⱼ aⱼ·y[n−j]) / a₀
* Output length equals the input length; past samples are zero.
*/
function solveDifferenceEquation(a, b, input) {
	const a0 = a[0] ?? new Complex(1, 0);
	if (a0.abs() === 0) throw new Error("a[0] must be non-zero");
	const output = [];
	for (let n = 0; n < input.length; n++) {
		let sum = new Complex(0, 0);
		for (let i = 0; i < b.length; i++) {
			const sample = input[n - i];
			if (sample !== void 0) sum = sum.add(b[i].mul(sample));
		}
		for (let j = 1; j < a.length; j++) {
			const sample = output[n - j];
			if (sample !== void 0) sum = sum.sub(a[j].mul(sample));
		}
		output.push(sum.div(a0));
	}
	return output;
}
//#endregion
//#region src/solvers/transfer.ts
/** Kernel complex value → engine-native rect (finite-checked, -0 folded). */
function rectOf$1(value) {
	const snapshot = serializeComplex(value, "none");
	return {
		re: snapshot.re,
		im: snapshot.im
	};
}
const coefficientArray = {
	type: "array",
	items: {
		type: "complex",
		kind: "none"
	}
};
const transferSolvers = [
	{
		id: "partial_fraction",
		summary: "Partial-fraction expansion of a ratio-form transfer function",
		parameters: {
			numerator: coefficientArray,
			denominator: coefficientArray
		},
		returns: {
			type: "object",
			fields: {
				terms: {
					type: "array",
					items: {
						type: "object",
						fields: {
							pole: {
								type: "complex",
								kind: "none"
							},
							order: {
								type: "complex",
								kind: "none"
							},
							residue: {
								type: "complex",
								kind: "none"
							}
						}
					}
				},
				polynomial: {
					type: "array",
					items: {
						type: "complex",
						kind: "none"
					}
				}
			}
		},
		run: (args) => {
			const result = expandPartialFraction(args.numerator.map((value) => toComplex(value)), args.denominator.map((value) => toComplex(value)));
			return {
				terms: result.terms.map((term) => ({
					pole: rectOf$1(term.pole),
					order: term.order,
					residue: rectOf$1(term.residue)
				})),
				polynomial: result.polynomial.map((coefficient) => rectOf$1(coefficient))
			};
		}
	},
	{
		id: "transfer_function_response",
		summary: "Evaluate a transfer function at frequency points (H(jω) or H(e^(jωT)))",
		parameters: {
			numerator: coefficientArray,
			denominator: coefficientArray,
			variable: {
				type: "string",
				enum: ["s", "z"]
			},
			frequencies: {
				type: "array",
				items: {
					type: "complex",
					kind: "frequency"
				}
			},
			sampleTime: {
				type: "complex",
				kind: "time",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				variable: { type: "string" },
				frequencies: {
					type: "array",
					items: {
						type: "complex",
						kind: "none"
					}
				},
				responses: {
					type: "array",
					items: {
						type: "complex",
						kind: "none"
					}
				}
			}
		},
		run: (args) => {
			const numerator = args.numerator.map((value) => toComplex(value));
			const denominator = args.denominator.map((value) => toComplex(value));
			const frequencies = args.frequencies.map((value) => toScalar(value));
			const sampleTime = args.sampleTime === void 0 ? void 0 : toScalar(args.sampleTime);
			const variable = args.variable;
			return {
				variable,
				frequencies,
				responses: calcTransferResponse(numerator, denominator, calcFreqPoints(variable, frequencies, sampleTime)).map((value) => rectOf$1(value))
			};
		}
	},
	{
		id: "step_response",
		summary: "Step response of a continuous transfer function at time points",
		parameters: {
			numerator: coefficientArray,
			denominator: coefficientArray,
			times: {
				type: "array",
				items: {
					type: "complex",
					kind: "time"
				}
			}
		},
		returns: {
			type: "object",
			fields: { values: {
				type: "array",
				items: {
					type: "complex",
					kind: "none"
				}
			} }
		},
		run: (args) => {
			return { values: calcStepResponse(args.numerator.map((value) => toComplex(value)), args.denominator.map((value) => toComplex(value)), args.times.map((value) => toScalar(value))).map((value) => rectOf$1(value)) };
		}
	},
	{
		id: "difference_equation_response",
		summary: "Difference-equation recursion output y[n] (Laurent a/b convention)",
		parameters: {
			a: coefficientArray,
			b: coefficientArray,
			input: coefficientArray
		},
		returns: {
			type: "object",
			fields: { output: {
				type: "array",
				items: {
					type: "complex",
					kind: "none"
				}
			} }
		},
		run: (args) => {
			return { output: solveDifferenceEquation(args.a.map((value) => toComplex(value)), args.b.map((value) => toComplex(value)), args.input.map((value) => toComplex(value))).map((value) => rectOf$1(value)) };
		}
	},
	{
		id: "bode_response",
		summary: "Bode plot of a ratio-form transfer function on a logarithmic frequency grid",
		parameters: {
			numerator: coefficientArray,
			denominator: coefficientArray,
			variable: {
				type: "string",
				enum: ["s", "z"],
				optional: true
			},
			frequencyStart: {
				type: "complex",
				kind: "frequency"
			},
			frequencyEnd: {
				type: "complex",
				kind: "frequency"
			},
			pointsPerDecade: {
				type: "complex",
				kind: "none",
				optional: true
			},
			sampleTime: {
				type: "complex",
				kind: "time",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				variable: { type: "string" },
				points: {
					type: "array",
					items: {
						type: "object",
						fields: {
							frequency: {
								type: "complex",
								kind: "frequency"
							},
							magnitudeDb: {
								type: "complex",
								kind: "log"
							},
							phase: {
								type: "complex",
								kind: "angle"
							}
						}
					}
				}
			}
		},
		run: (args) => {
			const numerator = args.numerator.map((value) => toComplex(value));
			const denominator = args.denominator.map((value) => toComplex(value));
			const variable = args.variable ?? "s";
			const result = calcBodeResponse(numerator, denominator, variable, toScalar(args.frequencyStart), toScalar(args.frequencyEnd), args.pointsPerDecade ?? 10, args.sampleTime === void 0 ? void 0 : toScalar(args.sampleTime));
			return {
				variable,
				points: result.frequencies.map((frequency, index) => ({
					frequency,
					magnitudeDb: result.magnitudesDb[index],
					phase: result.phasesDeg[index] * Math.PI / 180
				}))
			};
		}
	}
];
//#endregion
//#region src/math/noise.ts
/**
* Noise mathematics: thermal noise, quantization SNR, and cascaded
* noise-figure (Friis). SI base units; dB values are plain numbers.
*/
const BOLTZMANN_CONSTANT = 1380649e-29;
/** Thermal noise power in watts: P = k·T·B. */
function calcThermalNoisePower(temperatureKelvin, bandwidth) {
	if (temperatureKelvin < 0) throw new Error("temperature must be non-negative (K)");
	if (bandwidth < 0) throw new Error("bandwidth must be non-negative (Hz)");
	return BOLTZMANN_CONSTANT * temperatureKelvin * bandwidth;
}
/** Ideal quantization SNR in dB: SNR = 6.02·N + 1.76. */
function calcQuantizationSnr(bits) {
	if (!Number.isInteger(bits) || bits < 1) throw new Error("bits must be a positive integer");
	return 6.02 * bits + 1.76;
}
/**
* Cascaded noise figure (Friis) in dB:
*   F = F₁ + (F₂−1)/G₁ + (F₃−1)/(G₁G₂) + …
* Inputs are dB; gains are linear-power stage gains.
*/
function calcCascadeNoiseFigure(noiseFigureDb, gainDb) {
	if (noiseFigureDb.length === 0) throw new Error("at least one stage is required");
	if (noiseFigureDb.length !== gainDb.length) throw new Error("noiseFigureDb and gainDb must have the same length");
	let totalFactor = 10 ** (noiseFigureDb[0] / 10);
	let cumulativeGain = 10 ** (gainDb[0] / 10);
	for (let i = 1; i < noiseFigureDb.length; i++) {
		totalFactor += (10 ** (noiseFigureDb[i] / 10) - 1) / cumulativeGain;
		cumulativeGain *= 10 ** (gainDb[i] / 10);
	}
	return 10 * Math.log10(totalFactor);
}
//#endregion
//#region src/solvers/noise.ts
/**
* Engine solver definitions migrated from src/tools/noise-tools.ts —
* one SolverDef per legacy defineJsonTool. run bodies mirror the old executes
* (SI base units; toScalar unwrapping preserved); real results come back as
* plain numbers.
*/
const noiseSolvers = [
	{
		id: "thermal_noise",
		summary: "Thermal (Johnson) noise power in a bandwidth: P = k·T·B (k = 1.380649e−23 J/K), temperature in kelvin; returns watts",
		parameters: {
			temperature: {
				type: "complex",
				kind: "none"
			},
			bandwidth: {
				type: "complex",
				kind: "frequency"
			}
		},
		returns: {
			type: "object",
			fields: {
				temperature: {
					type: "complex",
					kind: "none"
				},
				bandwidth: {
					type: "complex",
					kind: "frequency"
				},
				noisePowerWatts: {
					type: "complex",
					kind: "power"
				}
			}
		},
		run: (args) => {
			const temperature = toScalar(args.temperature);
			const bandwidth = toScalar(args.bandwidth);
			return {
				temperature,
				bandwidth,
				noisePowerWatts: calcThermalNoisePower(temperature, bandwidth)
			};
		}
	},
	{
		id: "cascade_noise_figure",
		summary: "Total noise figure of cascaded stages (Friis) from per-stage noise figures and gains in dB: F = F₁ + (F₂−1)/G₁ + (F₃−1)/(G₁G₂) + …; first stage first in both arrays",
		parameters: {
			noiseFigureDb: {
				type: "array",
				items: {
					type: "complex",
					kind: "log"
				}
			},
			gainDb: {
				type: "array",
				items: {
					type: "complex",
					kind: "log"
				}
			}
		},
		returns: {
			type: "object",
			fields: { totalNoiseFigureDb: {
				type: "complex",
				kind: "log"
			} }
		},
		run: (args) => {
			return { totalNoiseFigureDb: calcCascadeNoiseFigure(args.noiseFigureDb.map((value) => toScalar(value)), args.gainDb.map((value) => toScalar(value))) };
		}
	},
	{
		id: "quantization_noise",
		summary: "Ideal SNR of a uniform quantizer in dB: SNR = 6.02·N + 1.76 (16 bits → ≈ 98 dB)",
		parameters: { bits: {
			type: "complex",
			kind: "none"
		} },
		returns: {
			type: "object",
			fields: { snrDb: {
				type: "complex",
				kind: "log"
			} }
		},
		run: (args) => {
			return { snrDb: calcQuantizationSnr(args.bits) };
		}
	}
];
//#endregion
//#region src/math/transmission.ts
/**
* Transmission-line mathematics: wavelength, coaxial-line characterization,
* and rise-time/bandwidth conversion. SI base units.
*/
const SPEED_OF_LIGHT = 299792458;
/** Wavelength in meters: λ = c·velocityFactor / f. */
function calcWavelength(frequency, velocityFactor = 1) {
	if (frequency <= 0) throw new Error("frequency must be positive (Hz)");
	if (velocityFactor <= 0 || velocityFactor > 1) throw new Error("velocity factor must be in (0, 1]");
	return SPEED_OF_LIGHT * velocityFactor / frequency;
}
/**
* Coaxial-line characterization from geometry:
*   Z₀ = (138/√εr)·log₁₀(D/d)
*   velocityFactor = 1/√εr
*   C′ = 1/(vf·c·Z₀), L′ = Z₀/(vf·c)
*/
function calcCoaxialParameters(innerDiameter, outerDiameter, relativePermittivity) {
	if (innerDiameter <= 0) throw new Error("inner diameter must be positive (m)");
	if (outerDiameter <= innerDiameter) throw new Error("outer diameter must exceed inner diameter (m)");
	if (relativePermittivity < 1) throw new Error("relative permittivity must be ≥ 1");
	const impedance = 138 / Math.sqrt(relativePermittivity) * Math.log10(outerDiameter / innerDiameter);
	const velocityFactor = 1 / Math.sqrt(relativePermittivity);
	return {
		impedance,
		velocityFactor,
		capacitancePerMeter: 1 / (velocityFactor * SPEED_OF_LIGHT * impedance),
		inductancePerMeter: impedance / (velocityFactor * SPEED_OF_LIGHT)
	};
}
/** Rise time in seconds from bandwidth: tr ≈ 0.35/BW. */
function calcRiseTimeFromBandwidth(bandwidth) {
	if (bandwidth <= 0) throw new Error("bandwidth must be positive (Hz)");
	return .35 / bandwidth;
}
/** Bandwidth in Hz from rise time: BW ≈ 0.35/tr. */
function calcBandwidthFromRiseTime(riseTime) {
	if (riseTime <= 0) throw new Error("rise time must be positive (s)");
	return .35 / riseTime;
}
//#endregion
//#region src/solvers/transmission.ts
/**
* Transmission-line solvers (migrated from tools/transmission-tools.ts):
* wavelength, coaxial-line characterization, and rise-time/bandwidth
* conversion. Kinds mirror the old tool declarations.
*/
const transmissionSolvers = [
	{
		id: "wavelength_frequency",
		summary: "Wavelength from frequency (velocity factor aware)",
		parameters: {
			frequency: {
				type: "complex",
				kind: "frequency"
			},
			velocityFactor: {
				type: "complex",
				kind: "none",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				frequency: {
					type: "complex",
					kind: "frequency"
				},
				velocityFactor: {
					type: "complex",
					kind: "none"
				},
				wavelength: {
					type: "complex",
					kind: "none"
				}
			}
		},
		run: (args) => {
			const frequency = toScalar(args.frequency);
			const velocityFactor = args.velocityFactor === void 0 ? 1 : toScalar(args.velocityFactor);
			return {
				frequency,
				velocityFactor,
				wavelength: calcWavelength(frequency, velocityFactor)
			};
		}
	},
	{
		id: "coaxial_parameters",
		summary: "Coaxial-line characterization from geometry (impedance, velocity factor, per-meter C and L)",
		parameters: {
			innerDiameter: {
				type: "complex",
				kind: "none"
			},
			outerDiameter: {
				type: "complex",
				kind: "none"
			},
			relativePermittivity: {
				type: "complex",
				kind: "none"
			}
		},
		returns: {
			type: "object",
			fields: {
				impedance: {
					type: "complex",
					kind: "resistance"
				},
				velocityFactor: {
					type: "complex",
					kind: "none"
				},
				capacitancePerMeter: {
					type: "complex",
					kind: "capacitance"
				},
				inductancePerMeter: {
					type: "complex",
					kind: "inductance"
				}
			}
		},
		run: (args) => {
			const result = calcCoaxialParameters(toScalar(args.innerDiameter), toScalar(args.outerDiameter), toScalar(args.relativePermittivity));
			return {
				impedance: result.impedance,
				velocityFactor: result.velocityFactor,
				capacitancePerMeter: result.capacitancePerMeter,
				inductancePerMeter: result.inductancePerMeter
			};
		}
	},
	{
		id: "rise_time_bandwidth",
		summary: "Convert between rise time and bandwidth (tr ≈ 0.35/BW)",
		parameters: {
			bandwidth: {
				type: "complex",
				kind: "frequency",
				optional: true
			},
			riseTime: {
				type: "complex",
				kind: "time",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				bandwidth: {
					type: "complex",
					kind: "frequency"
				},
				riseTime: {
					type: "complex",
					kind: "time"
				}
			}
		},
		run: (args) => {
			const bandwidth = args.bandwidth === void 0 ? void 0 : toScalar(args.bandwidth);
			const riseTime = args.riseTime === void 0 ? void 0 : toScalar(args.riseTime);
			if (bandwidth === void 0 === (riseTime === void 0)) throw new Error("provide exactly one of bandwidth or riseTime");
			return bandwidth !== void 0 ? {
				bandwidth,
				riseTime: calcRiseTimeFromBandwidth(bandwidth)
			} : {
				bandwidth: calcBandwidthFromRiseTime(riseTime),
				riseTime
			};
		}
	}
];
//#endregion
//#region src/math/electronics.ts
/**
* Electronics mathematics: op-amp configurations, time constants, voltage
* dividers and LED series resistors. SI base units; op-amp frequency-domain
* gains are complex.
*/
/** Inverting amplifier: gain = −Rf/Rin; output = gain·Vin. */
function calcInvertingOpamp(inputVoltage, feedbackResistance, inputResistance) {
	const gain = new Complex(-feedbackResistance / inputResistance, 0);
	return {
		gain,
		outputVoltage: gain.mul(inputVoltage)
	};
}
/** Non-inverting amplifier: gain = 1 + Rf/Rin; output = gain·Vin. */
function calcNonInvertingOpamp(inputVoltage, feedbackResistance, inputResistance) {
	const gain = new Complex(1 + feedbackResistance / inputResistance, 0);
	return {
		gain,
		outputVoltage: gain.mul(inputVoltage)
	};
}
/** Voltage follower: gain = 1; output = input. */
function calcVoltageFollowerOpamp(inputVoltage) {
	return {
		gain: new Complex(1, 0),
		outputVoltage: new Complex(inputVoltage, 0)
	};
}
/** Difference amplifier: Vout = (Rf/R1)(V₂−V₁). */
function calcDifferenceOpamp(inputVoltage1, inputVoltage2, feedbackResistance, inputResistance) {
	const gain = new Complex(feedbackResistance / inputResistance, 0);
	return {
		gain,
		outputVoltage: gain.mul(inputVoltage2 - inputVoltage1)
	};
}
/** Integrator: H(jω) = −1/(jωRC); output = gain·Vin. */
function calcIntegratorOpamp(inputVoltage, inputResistance, capacitance, frequency) {
	const omega = 2 * Math.PI * frequency;
	const gain = new Complex(0, 1 / (omega * inputResistance * capacitance));
	return {
		gain,
		outputVoltage: gain.mul(inputVoltage)
	};
}
/** Differentiator: H(jω) = −jωRC; output = gain·Vin. */
function calcDifferentiatorOpamp(inputVoltage, feedbackResistance, capacitance, frequency) {
	const omega = 2 * Math.PI * frequency;
	const gain = new Complex(0, -omega * feedbackResistance * capacitance);
	return {
		gain,
		outputVoltage: gain.mul(inputVoltage)
	};
}
/**
* Time constant and cutoff frequency: τ = RC (capacitance given) or
* τ = L/R (inductance given); exactly one of the two must be provided.
*/
function calcTimeConstant(resistance, capacitance, inductance) {
	if (resistance <= 0) throw new Error("resistance must be positive (Ω)");
	let timeConstant;
	switch (true) {
		case capacitance !== void 0 && inductance === void 0:
			if (capacitance <= 0) throw new Error("capacitance must be positive (F)");
			timeConstant = resistance * capacitance;
			break;
		case inductance !== void 0 && capacitance === void 0:
			if (inductance <= 0) throw new Error("inductance must be positive (H)");
			timeConstant = inductance / resistance;
			break;
		default: throw new Error("provide exactly one of capacitance or inductance");
	}
	return {
		timeConstant,
		cutoffFrequency: 1 / (2 * Math.PI * timeConstant)
	};
}
/**
* Resistive divider: outputVoltage = Vs·R2/(R1+R2); with a load resistance
* the divider ratio uses R2∥RL. outputResistance is the Thévenin source
* resistance R1∥R2.
*/
function calcVoltageDivider(sourceVoltage, resistance1, resistance2, loadResistance) {
	if (resistance1 <= 0 || resistance2 <= 0) throw new Error("resistances must be positive (Ω)");
	if (loadResistance !== void 0 && loadResistance <= 0) throw new Error("load resistance must be positive (Ω)");
	const unloaded = sourceVoltage * (resistance2 / (resistance1 + resistance2));
	const outputResistance = resistance1 * resistance2 / (resistance1 + resistance2);
	if (loadResistance === void 0) return {
		outputVoltage: unloaded,
		outputResistance
	};
	const parallel = resistance2 * loadResistance / (resistance2 + loadResistance);
	const loaded = sourceVoltage * (parallel / (resistance1 + parallel));
	return {
		outputVoltage: loaded,
		unloadedOutputVoltage: unloaded,
		loadCurrent: loaded / loadResistance,
		outputResistance
	};
}
/** LED series resistor: R = (Vs − Vf)/I, with dissipated power P = I²·R. */
function calcLedResistor(sourceVoltage, forwardVoltage, current) {
	if (sourceVoltage <= forwardVoltage) throw new Error("source voltage must exceed the LED forward voltage (V)");
	if (current <= 0) throw new Error("current must be positive (A)");
	const resistance = (sourceVoltage - forwardVoltage) / current;
	return {
		resistance,
		power: current * current * resistance
	};
}
//#endregion
//#region src/solvers/electronics.ts
/** Kernel complex value → engine-native rect (finite-checked, -0 folded). */
function rectOf(value) {
	const snapshot = serializeComplex(value, "none");
	return {
		re: snapshot.re,
		im: snapshot.im
	};
}
const electronicsSolvers = [
	{
		id: "opamp_configurations",
		summary: "Ideal op-amp gain and output for a configuration: inverting −Rf/Rin, non-inverting 1+Rf/Rin, voltage-follower 1, difference (Rf/R1)(V₂−V₁), integrator −1/(jωRC) and differentiator −jωRC at a frequency",
		parameters: {
			configuration: {
				type: "string",
				enum: [
					"inverting",
					"non-inverting",
					"voltage-follower",
					"difference",
					"integrator",
					"differentiator"
				]
			},
			feedbackResistance: {
				type: "complex",
				kind: "resistance",
				optional: true
			},
			inputResistance: {
				type: "complex",
				kind: "resistance",
				optional: true
			},
			inputVoltage: {
				type: "complex",
				kind: "voltage"
			},
			secondInputVoltage: {
				type: "complex",
				kind: "voltage",
				optional: true
			},
			capacitance: {
				type: "complex",
				kind: "capacitance",
				optional: true
			},
			frequency: {
				type: "complex",
				kind: "frequency",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				configuration: { type: "string" },
				gain: {
					type: "complex",
					kind: "none"
				},
				outputVoltage: {
					type: "complex",
					kind: "voltage"
				}
			}
		},
		run: (args) => {
			const configuration = args.configuration;
			const serialize = (gain, outputVoltage) => ({
				configuration,
				gain: rectOf(gain),
				outputVoltage: rectOf(outputVoltage)
			});
			switch (configuration) {
				case "inverting": {
					if (args.feedbackResistance === void 0 || args.inputResistance === void 0) throw new Error("inverting requires feedbackResistance and inputResistance");
					const { gain, outputVoltage } = calcInvertingOpamp(toScalar(args.inputVoltage), toScalar(args.feedbackResistance), toScalar(args.inputResistance));
					return serialize(gain, outputVoltage);
				}
				case "non-inverting": {
					if (args.feedbackResistance === void 0 || args.inputResistance === void 0) throw new Error("non-inverting requires feedbackResistance and inputResistance");
					const { gain, outputVoltage } = calcNonInvertingOpamp(toScalar(args.inputVoltage), toScalar(args.feedbackResistance), toScalar(args.inputResistance));
					return serialize(gain, outputVoltage);
				}
				case "voltage-follower": {
					const { gain, outputVoltage } = calcVoltageFollowerOpamp(toScalar(args.inputVoltage));
					return serialize(gain, outputVoltage);
				}
				case "difference": {
					if (args.feedbackResistance === void 0 || args.inputResistance === void 0 || args.secondInputVoltage === void 0) throw new Error("difference requires secondInputVoltage, feedbackResistance and inputResistance");
					const { gain, outputVoltage } = calcDifferenceOpamp(toScalar(args.inputVoltage), toScalar(args.secondInputVoltage), toScalar(args.feedbackResistance), toScalar(args.inputResistance));
					return serialize(gain, outputVoltage);
				}
				case "integrator": {
					if (args.inputResistance === void 0 || args.capacitance === void 0 || args.frequency === void 0) throw new Error("integrator requires inputResistance, capacitance and frequency");
					const { gain, outputVoltage } = calcIntegratorOpamp(toScalar(args.inputVoltage), toScalar(args.inputResistance), toScalar(args.capacitance), toScalar(args.frequency));
					return serialize(gain, outputVoltage);
				}
				case "differentiator": {
					if (args.feedbackResistance === void 0 || args.capacitance === void 0 || args.frequency === void 0) throw new Error("differentiator requires feedbackResistance, capacitance and frequency");
					const { gain, outputVoltage } = calcDifferentiatorOpamp(toScalar(args.inputVoltage), toScalar(args.feedbackResistance), toScalar(args.capacitance), toScalar(args.frequency));
					return serialize(gain, outputVoltage);
				}
				default: throw new Error(`unknown op-amp configuration "${String(configuration)}"`);
			}
		}
	},
	{
		id: "time_constant",
		summary: "Time constant and cutoff frequency: τ = RC (give capacitance) or τ = L/R (give inductance); exactly one of capacitance or inductance, cutoffFrequency = 1/(2πτ)",
		parameters: {
			resistance: {
				type: "complex",
				kind: "resistance"
			},
			capacitance: {
				type: "complex",
				kind: "capacitance",
				optional: true
			},
			inductance: {
				type: "complex",
				kind: "inductance",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				timeConstant: {
					type: "complex",
					kind: "time"
				},
				cutoffFrequency: {
					type: "complex",
					kind: "frequency"
				}
			}
		},
		run: (args) => {
			const { timeConstant, cutoffFrequency } = calcTimeConstant(toScalar(args.resistance), args.capacitance === void 0 ? void 0 : toScalar(args.capacitance), args.inductance === void 0 ? void 0 : toScalar(args.inductance));
			return {
				timeConstant,
				cutoffFrequency
			};
		}
	},
	{
		id: "voltage_divider",
		summary: "Resistive divider: outputVoltage = Vs·R2/(R1+R2), with R2∥RL when a loadResistance is given (plus unloadedOutputVoltage and loadCurrent); outputResistance is the Thévenin source resistance R1∥R2",
		parameters: {
			sourceVoltage: {
				type: "complex",
				kind: "voltage"
			},
			resistance1: {
				type: "complex",
				kind: "resistance"
			},
			resistance2: {
				type: "complex",
				kind: "resistance"
			},
			loadResistance: {
				type: "complex",
				kind: "resistance",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				outputVoltage: {
					type: "complex",
					kind: "voltage"
				},
				outputResistance: {
					type: "complex",
					kind: "resistance"
				},
				unloadedOutputVoltage: {
					type: "complex",
					kind: "voltage"
				},
				loadCurrent: {
					type: "complex",
					kind: "current"
				}
			}
		},
		run: (args) => {
			const result = calcVoltageDivider(toScalar(args.sourceVoltage), toScalar(args.resistance1), toScalar(args.resistance2), args.loadResistance === void 0 ? void 0 : toScalar(args.loadResistance));
			if (result.unloadedOutputVoltage !== void 0) return {
				outputVoltage: result.outputVoltage,
				outputResistance: result.outputResistance,
				unloadedOutputVoltage: result.unloadedOutputVoltage,
				loadCurrent: result.loadCurrent
			};
			return {
				outputVoltage: result.outputVoltage,
				outputResistance: result.outputResistance,
				unloadedOutputVoltage: result.outputVoltage,
				loadCurrent: 0
			};
		}
	},
	{
		id: "led_resistor",
		summary: "LED series resistor: R = (Vs − Vf)/I and its dissipated power P = I²·R (requires sourceVoltage > forwardVoltage)",
		parameters: {
			sourceVoltage: {
				type: "complex",
				kind: "voltage"
			},
			forwardVoltage: {
				type: "complex",
				kind: "voltage"
			},
			current: {
				type: "complex",
				kind: "current"
			}
		},
		returns: {
			type: "object",
			fields: {
				resistance: {
					type: "complex",
					kind: "resistance"
				},
				power: {
					type: "complex",
					kind: "power"
				}
			}
		},
		run: (args) => {
			const { resistance, power } = calcLedResistor(toScalar(args.sourceVoltage), toScalar(args.forwardVoltage), toScalar(args.current));
			return {
				resistance,
				power
			};
		}
	}
];
//#endregion
//#region src/math/filter.ts
/** Butterworth low-pass ladder design (equal source/load terminations). */
function designButterworthLowpass(order, cutoffFrequency, resistance) {
	if (!Number.isInteger(order) || order < 1) throw new Error("order must be a positive integer");
	if (cutoffFrequency <= 0) throw new Error("cutoff frequency must be positive (Hz)");
	if (resistance <= 0) throw new Error("resistance must be positive (Ω)");
	const angularCutoff = 2 * Math.PI * cutoffFrequency;
	const elements = [];
	for (let k = 1; k <= order; k++) {
		const g = 2 * Math.sin((2 * k - 1) * Math.PI / (2 * order));
		const series = k % 2 === 1;
		elements.push(series ? {
			role: "series",
			kind: "inductance",
			value: resistance * g / angularCutoff
		} : {
			role: "shunt",
			kind: "capacitance",
			value: g / (resistance * angularCutoff)
		});
	}
	return elements;
}
/** Butterworth attenuation at a frequency: 10·log10(1 + (f/fc)^(2n)) dB. */
function calcButterworthAttenuation(order, cutoffFrequency, frequency) {
	if (frequency <= 0) throw new Error("query frequency must be positive (Hz)");
	const ratio = frequency / cutoffFrequency;
	return 10 * Math.log10(1 + Math.pow(ratio, 2 * order));
}
//#endregion
//#region src/solvers/filter.ts
/**
* Engine solver definitions migrated from src/tools/filter-tool.ts —
* one SolverDef for the legacy filter_design tool. run mirrors the old execute;
* real results come back as plain numbers.
*
* Migration notes (documented deviations from the legacy tool surface):
* - queryFrequency was optional in the legacy tool (attenuationAtQueryDb was
*   then omitted). An engine returns object has one exact shape per solver, so
*   queryFrequency is required here and attenuationAtQueryDb is always
*   present; pass the cutoff frequency as queryFrequency when only the design
*   is wanted (both attenuation fields then report the −3 dB point).
* - elements[].value is the series-inductance (H) or shunt-capacitance (F)
*   magnitude; an engine quantity has one fixed kind per field while the
*   element kind alternates, so the magnitude is declared kind None and the
*   unit is carried by the element kind string.
*/
const filterSolvers = [{
	id: "filter_design",
	summary: "Design a Butterworth low-pass ladder: order, cutoffFrequency and equal source/load resistance give the element list (series inductors, shunt capacitors); attenuation in dB at the cutoff and at the query frequency",
	parameters: {
		order: {
			type: "complex",
			kind: "none"
		},
		cutoffFrequency: {
			type: "complex",
			kind: "frequency"
		},
		resistance: {
			type: "complex",
			kind: "resistance"
		},
		queryFrequency: {
			type: "complex",
			kind: "frequency"
		}
	},
	returns: {
		type: "object",
		fields: {
			response: { type: "string" },
			kind: { type: "string" },
			order: {
				type: "complex",
				kind: "none"
			},
			cutoffFrequency: {
				type: "complex",
				kind: "frequency"
			},
			resistance: {
				type: "complex",
				kind: "resistance"
			},
			elements: {
				type: "array",
				items: {
					type: "object",
					fields: {
						role: { type: "string" },
						kind: { type: "string" },
						value: {
							type: "complex",
							kind: "none"
						}
					}
				}
			},
			attenuationAtCutoffDb: {
				type: "complex",
				kind: "log"
			},
			attenuationAtQueryDb: {
				type: "complex",
				kind: "log"
			}
		}
	},
	run: (args) => {
		const order = args.order;
		const cutoffFrequency = toScalar(args.cutoffFrequency);
		const resistance = toScalar(args.resistance);
		const queryFrequency = toScalar(args.queryFrequency);
		return {
			response: "lowpass",
			kind: "butterworth",
			order,
			cutoffFrequency,
			resistance,
			elements: designButterworthLowpass(order, cutoffFrequency, resistance).map((element) => ({
				role: element.role,
				kind: element.kind,
				value: element.value
			})),
			attenuationAtCutoffDb: calcButterworthAttenuation(order, cutoffFrequency, cutoffFrequency),
			attenuationAtQueryDb: calcButterworthAttenuation(order, cutoffFrequency, queryFrequency)
		};
	}
}];
//#endregion
//#region src/math/series.ts
/**
* Arithmetic series: a₁, a₁+d, …, a₁+(n−1)d.
* Sum = n·(a₁ + aₙ)/2 with last term aₙ = a₁ + (n−1)d.
*/
function calcArithmeticSeries(firstTerm, commonDifference, count) {
	if (count < 1 || !Number.isInteger(count)) throw new Error("count must be a positive integer");
	const lastTerm = firstTerm + (count - 1) * commonDifference;
	return {
		sum: count * (firstTerm + lastTerm) / 2,
		lastTerm
	};
}
/**
* Geometric series: a₁, a₁·r, …, a₁·rⁿ⁻¹.
* Finite: sum = a₁(1−rⁿ)/(1−r) (r = 1 handled separately) with last term
* a₁·rⁿ⁻¹. Infinite (infinite = true): converges iff |r| < 1 to a₁/(1−r);
* a diverging infinite series raises an error.
*/
function calcGeometricSeries(firstTerm, commonRatio, count, infinite = false) {
	if (count < 1 || !Number.isInteger(count)) throw new Error("count must be a positive integer");
	if (infinite) {
		if (Math.abs(commonRatio) >= 1) throw new Error("infinite geometric series diverges unless |r| < 1");
		return {
			sum: firstTerm / (1 - commonRatio),
			converges: true
		};
	}
	if (commonRatio === 1) return {
		sum: firstTerm * count,
		lastTerm: firstTerm
	};
	const lastTerm = firstTerm * commonRatio ** (count - 1);
	return {
		sum: firstTerm * (1 - commonRatio ** count) / (1 - commonRatio),
		lastTerm
	};
}
/**
* Natural-number power sum: Σk = n(n+1)/2, Σk² = n(n+1)(2n+1)/6,
* Σk³ = [n(n+1)/2]².
*/
function calcPowerSum(power, count) {
	if (count < 1 || !Number.isInteger(count)) throw new Error("count must be a positive integer");
	const n = count;
	switch (power) {
		case "linear": return { sum: n * (n + 1) / 2 };
		case "square": return { sum: n * (n + 1) * (2 * n + 1) / 6 };
		case "cube": return { sum: (n * (n + 1) / 2) ** 2 };
	}
}
//#endregion
//#region src/solvers/series.ts
/**
* Series solvers (migrated from tools/series-tools.ts): series_sum with an
* arithmetic / geometric / power kind discriminator.
*
* Engine object returns are closed and require every declared field, so the
* old per-branch output shapes ({kind,sum,lastTerm} / {kind,sum,converges} /
* {kind,power,sum}) are unified into the full five-key object: power is an
* empty string when no exponent applies; converges is always truthful (finite
* sums and a convergent infinite sum all converge — a diverging infinite
* input errors inside the kernel); lastTerm is 0 for the convergent infinite
* geometric case (the limit of its general term) and count^p for power sums
* (the last summed term).
*/
/** Last summed term of a power sum Σk^p over the first n naturals = n^p. */
function powerLastTerm(power, count) {
	return count ** (power === "linear" ? 1 : power === "square" ? 2 : 3);
}
const seriesSolvers = [{
	id: "series_sum",
	summary: "Sum of a number sequence: arithmetic, geometric (finite or convergent infinite), or power sum",
	parameters: {
		kind: {
			type: "string",
			enum: [
				"arithmetic",
				"geometric",
				"power"
			]
		},
		firstTerm: {
			type: "complex",
			kind: "none",
			optional: true
		},
		commonDifference: {
			type: "complex",
			kind: "none",
			optional: true
		},
		commonRatio: {
			type: "complex",
			kind: "none",
			optional: true
		},
		count: {
			type: "complex",
			kind: "none",
			optional: true
		},
		infinite: {
			type: "boolean",
			optional: true
		},
		power: {
			type: "string",
			enum: [
				"linear",
				"square",
				"cube"
			],
			optional: true
		}
	},
	returns: {
		type: "object",
		fields: {
			kind: { type: "string" },
			power: { type: "string" },
			sum: {
				type: "complex",
				kind: "none"
			},
			lastTerm: {
				type: "complex",
				kind: "none"
			},
			converges: { type: "boolean" }
		}
	},
	run: (args) => {
		const kind = args.kind;
		switch (kind) {
			case "arithmetic": {
				const firstTerm = args.firstTerm;
				const commonDifference = args.commonDifference;
				const count = args.count;
				if (firstTerm === void 0 || commonDifference === void 0 || count === void 0) throw new Error("arithmetic requires firstTerm, commonDifference and count");
				const { sum, lastTerm } = calcArithmeticSeries(toScalar(firstTerm), toScalar(commonDifference), count);
				return {
					kind,
					power: "",
					sum,
					lastTerm,
					converges: true
				};
			}
			case "geometric": {
				const firstTerm = args.firstTerm;
				const commonRatio = args.commonRatio;
				if (firstTerm === void 0 || commonRatio === void 0) throw new Error("geometric requires firstTerm and commonRatio");
				const infinite = args.infinite ?? false;
				const count = args.count;
				if (!infinite && count === void 0) throw new Error("geometric requires count unless infinite is true");
				const result = calcGeometricSeries(toScalar(firstTerm), toScalar(commonRatio), count ?? 1, infinite);
				return {
					kind,
					power: "",
					sum: result.sum,
					lastTerm: result.lastTerm ?? 0,
					converges: result.converges ?? true
				};
			}
			case "power": {
				const power = args.power;
				const count = args.count;
				if (power === void 0 || count === void 0) throw new Error("power requires power and count");
				const { sum } = calcPowerSum(power, count);
				return {
					kind,
					power,
					sum,
					lastTerm: powerLastTerm(power, count),
					converges: true
				};
			}
		}
	}
}];
//#endregion
//#region src/math/signal-quality.ts
/**
* Signal-quality mathematics: total harmonic distortion (THD), clock-jitter
* SNR, and the ADC noise budget that combines quantization, jitter and
* thermal noise into a total SNR / ENOB. SI base units.
*/
/**
* Total harmonic distortion of a sampled signal: the ratio of the summed
* harmonic energy (bins 2f₀..harmonics·f₀ of the dominant non-DC bin) to the
* fundamental. The DFT bin magnitudes are used directly — the 2/N factor of
* the single-sided convention cancels in the ratio. Harmonics alias back
* (spectral folding): bin index = (order·f₀) mod N, which also makes the
* result invariant to which of the two mirror peaks is picked as the
* fundamental. thdDb is 20·log10(thd) (−Infinity when there are no harmonics).
*/
function calcThd(samples, harmonics) {
	if (samples.length === 0) throw new Error("at least one sample is required");
	if (harmonics < 1) throw new Error("harmonics must be ≥ 1");
	const spectrum = calcDiscreteFourierTransform(samples.map((value) => new Complex(value, 0)));
	let fundamentalIndex = -1;
	let fundamental = 0;
	for (let k = 1; k < spectrum.length; k++) {
		const magnitude = spectrum[k].abs();
		if (magnitude > fundamental) {
			fundamental = magnitude;
			fundamentalIndex = k;
		}
	}
	if (fundamental === 0) throw new Error("no non-DC fundamental found (silent or DC-only signal)");
	const harmonicAmplitudes = [];
	for (let order = 2; order <= harmonics; order++) harmonicAmplitudes.push(spectrum[order * fundamentalIndex % spectrum.length].abs());
	const harmonicEnergy = harmonicAmplitudes.reduce((sum, amplitude) => sum + amplitude * amplitude, 0);
	const thd = Math.sqrt(harmonicEnergy) / fundamental;
	return {
		thd,
		thdDb: 20 * Math.log10(thd),
		fundamental,
		harmonicAmplitudes
	};
}
/**
* SNR ceiling set by sampling-clock jitter:
*   SNR = −20·log10(2π·f·tⱼ) dB
* with signal frequency f and RMS jitter tⱼ. Higher frequency or jitter
* lowers the ceiling; independent of the quantizer.
*/
function calcJitterSnr(signalFrequency, jitter) {
	if (signalFrequency <= 0) throw new Error("signal frequency must be positive (Hz)");
	if (jitter <= 0) throw new Error("jitter must be positive (s)");
	return -20 * Math.log10(2 * Math.PI * signalFrequency * jitter);
}
/**
* ADC noise budget: quantization SNR (6.02·N + 1.76 dB), jitter SNR
* (−20·log10(2π·f·tⱼ)), and an optional thermal SNR (signal-dependent; the
* caller supplies it, e.g. from thermal_noise against the signal level).
* Noise powers add linearly, then the total is converted back to dB and to
* ENOB: (SNR_total − 1.76)/6.02.
*/
function calcAdcBudget(bits, signalFrequency, jitter, thermalSnrDb) {
	if (!Number.isInteger(bits) || bits < 1) throw new Error("bits must be a positive integer");
	const snrQuantizationDb = calcQuantizationSnr(bits);
	const snrJitterDb = calcJitterSnr(signalFrequency, jitter);
	const components = [snrQuantizationDb, snrJitterDb];
	if (thermalSnrDb !== void 0) {
		if (!Number.isFinite(thermalSnrDb)) throw new Error("thermal SNR must be a finite dB value");
		components.push(thermalSnrDb);
	}
	const totalFactor = components.reduce((sum, snr) => sum + 10 ** (-snr / 10), 0);
	const snrTotalDb = -10 * Math.log10(totalFactor);
	return {
		snrQuantizationDb,
		snrJitterDb,
		...thermalSnrDb === void 0 ? {} : { snrThermalDb: thermalSnrDb },
		snrTotalDb,
		enob: (snrTotalDb - 1.76) / 6.02
	};
}
//#endregion
//#region src/solvers/signal-quality.ts
/**
* Signal-quality solvers (migrated from tools/signal-quality-tools.ts): THD,
* clock-jitter SNR ceiling, and the combined ADC noise budget. Kinds mirror
* the old tool declarations (thd is a fraction → none, SNR values → log).
*/
const signalQualitySolvers = [
	{
		id: "thd",
		summary: "Total harmonic distortion of a sampled signal (fraction plus dB)",
		parameters: {
			samples: {
				type: "array",
				items: {
					type: "complex",
					kind: "none"
				}
			},
			harmonics: {
				type: "complex",
				kind: "none",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				thd: {
					type: "complex",
					kind: "none"
				},
				thdDb: {
					type: "complex",
					kind: "log"
				},
				fundamental: {
					type: "complex",
					kind: "none"
				},
				harmonicAmplitudes: {
					type: "array",
					items: {
						type: "complex",
						kind: "none"
					}
				}
			}
		},
		run: (args) => {
			const result = calcThd(args.samples.map((sample) => toScalar(sample)), args.harmonics ?? 10);
			return {
				thd: result.thd,
				thdDb: result.thd === 0 ? -300 : result.thdDb,
				fundamental: result.fundamental,
				harmonicAmplitudes: result.harmonicAmplitudes
			};
		}
	},
	{
		id: "jitter_snr",
		summary: "SNR ceiling set by sampling-clock jitter",
		parameters: {
			signalFrequency: {
				type: "complex",
				kind: "frequency"
			},
			jitter: {
				type: "complex",
				kind: "time"
			}
		},
		returns: {
			type: "object",
			fields: { snrDb: {
				type: "complex",
				kind: "log"
			} }
		},
		run: (args) => {
			return { snrDb: calcJitterSnr(toScalar(args.signalFrequency), toScalar(args.jitter)) };
		}
	},
	{
		id: "adc_budget",
		summary: "ADC noise budget: quantization, jitter and optional thermal SNR into a total SNR and ENOB",
		parameters: {
			bits: {
				type: "complex",
				kind: "none"
			},
			signalFrequency: {
				type: "complex",
				kind: "frequency"
			},
			jitter: {
				type: "complex",
				kind: "time"
			},
			thermalSnrDb: {
				type: "complex",
				kind: "log",
				optional: true
			}
		},
		returns: {
			type: "object",
			fields: {
				snrQuantizationDb: {
					type: "complex",
					kind: "log"
				},
				snrJitterDb: {
					type: "complex",
					kind: "log"
				},
				snrTotalDb: {
					type: "complex",
					kind: "log"
				},
				enob: {
					type: "complex",
					kind: "none"
				}
			}
		},
		run: (args) => {
			const result = calcAdcBudget(args.bits, toScalar(args.signalFrequency), toScalar(args.jitter), args.thermalSnrDb === void 0 ? void 0 : toScalar(args.thermalSnrDb));
			return {
				snrQuantizationDb: result.snrQuantizationDb,
				snrJitterDb: result.snrJitterDb,
				snrTotalDb: result.snrTotalDb,
				enob: result.enob
			};
		}
	}
];
//#endregion
//#region src/solvers/index.ts
function registerKernelSolvers() {
	return [
		...expressionSolvers,
		...circuitSolvers,
		...smithSolvers,
		...dftSolvers,
		...polynomialSolvers,
		...transferSolvers,
		...noiseSolvers,
		...transmissionSolvers,
		...electronicsSolvers,
		...filterSolvers,
		...seriesSolvers,
		...signalQualitySolvers
	];
}
//#endregion
//#region src/same-origin.ts
/**
* 审计 C1/C2/C4：Web 端点的同源守卫。拒绝 Origin 与 Host 不一致的浏览器请求，
* 阻断跨站读写（未认证任意写、目录枚举、删记录、注册求解器）。
*/
function sameOriginGuard(req) {
	const headers = req.headers ?? {};
	const origin = String(headers.origin ?? "");
	const host = String(headers.host ?? "");
	const site = String(headers["sec-fetch-site"] ?? "");
	if (site === "none" || site === "same-origin" || site === "same-site") return true;
	if (origin === "") return true;
	try {
		return new URL(origin).host === host;
	} catch {
		return false;
	}
}
/** 同源守卫未通过时写 403 并返回 true（表示已拒绝，调用方应 return）。 */
function rejectCrossOrigin(req, res) {
	if (sameOriginGuard(req)) return false;
	res.statusCode = 403;
	if (typeof res.setHeader === "function") res.setHeader("content-type", "application/json");
	res.end(JSON.stringify({ error: "forbidden: cross-origin request" }));
	return true;
}
//#endregion
//#region src/generate.ts
/** The article-language face of a template language (same wire values, distinct enum types). */
function templateLanguageToArticleLanguage(templateLanguage) {
	switch (templateLanguage) {
		case "zh-CN": return "zh-CN";
		case "en": return "en";
	}
}
/** The article-language sentence pinned in the system prompt. */
function articleLanguageInstruction(language) {
	switch (language) {
		case "zh-CN": return "The ENTIRE article must be written in Simplified Chinese (简体中文) — every heading, sentence, and label. Never switch to another language.";
		case "en": return "The ENTIRE article must be written in English — every heading, sentence, and label. Never switch to another language.";
		case "auto": return "Write in the language of the question.";
	}
}
/**
* Resolve the article language for a DOCUMENT SHELL (LaTeX preamble), which
* must be fixed before generation: Auto probes the question text. Only
* en/zh-CN ship templates today; the probe is the single extension point for
* other scripts (hiragana → ja + jlreq, hangul → ko + kotex, cyrillic → ru…).
*/
function resolveTemplateLanguage(language, question) {
	switch (language) {
		case "zh-CN": return "zh-CN";
		case "en": return "en";
		case "auto": return /[\u3400-\u4dbf\u4e00-\u9fff]/.test(question) ? "zh-CN" : "en";
	}
}
/** Force the file name to end with the format's extension (.md / .tex). */
function normalizeFileName(fileName, format) {
	const base = fileName.trim().replace(/\.(md|tex)$/i, "");
	let extension;
	switch (format) {
		case "latex":
			extension = ".tex";
			break;
		case "markdown": extension = ".md";
	}
	return base.length === 0 ? `electro-lab-article${extension}` : `${base}${extension}`;
}
/** The record rendered as neutral facts for the model (values verbatim). */
function renderRecord(record) {
	const lines = ["Record information to base the article on:", ""];
	lines.push(`- The question to solve: ${record.question}`);
	if (record.analyse.length > 0) lines.push(`- Approach notes: ${record.analyse}`);
	for (const call of record.calls) lines.push(`- Calculation step ${call.name}: ${call.arguments.length > 0 ? call.arguments : "(no arguments)"}`);
	for (const result of record.results) {
		const content = result.content.trim();
		if (content.length > 0) lines.push(`- Step result: ${content}`);
	}
	lines.push(`- Final answer: ${record.answer}`);
	return lines.join("\n");
}
const MARKDOWN_SHARED_RULES = [
	"Restate the question clearly at the start, in the user's own words. Remove any meta or filler text that was added while merging multiple inputs into one question.",
	"Every number must come from the provided step results and the final answer — never invent or recompute values.",
	"Never include record ids or timestamps anywhere in the article.",
	"Never mention ElectroLab, DeepSeek Harness, the harness, solvers, calculation steps, records or the generation process in the article — present the work as if you carried out the calculation yourself, from the problem statement to the final result. The only allowed occurrences of the name are the document's fixed title 'DeepSeek Harness ElectroLab Solution' and the author line 'DeepSeek Harness ElectroLab'."
];
/**
* The generation prompt: the article reads like a proper technical article —
* section headings, formulas and calculations on their own formatted lines —
* not a chat reply and not the record's own five-section layout. The two
* formats get format-specific instructions (Markdown headings vs LaTeX body
* with a host-provided shell); the shared rules above stay common.
*/
function buildArticlePrompt(record, language = "auto", format = "markdown") {
	const languageNote = language === "auto" ? "" : `\n\nImportant: ${articleLanguageInstruction(language)}`;
	const user = renderRecord(record) + languageNote;
	switch (format) {
		case "latex": return {
			system: [
				"You are the article writer for DeepSeek Harness ElectroLab.",
				"Write ONE self-contained LaTeX article body that solves the calculation question described in the record information. The article must read like a proper technical article, not a chat reply and not a thinking transcript.",
				"The host wraps your output in the document shell — the preamble, \\title{DeepSeek Harness ElectroLab Solution}, \\author{DeepSeek Harness ElectroLab}, \\maketitle and the document environment are ALREADY in place. Output ONLY the body: start directly with the first section heading. Do NOT output \\documentclass, any \\usepackage, \\title, \\author, \\date, \\maketitle, \\begin{document} or \\end{document} — no preamble and no environment commands.",
				"Structure the body with \\section headings for the question, the approach, the calculations and the conclusion — choose headings that fit the content; do NOT reproduce the record's internal step labels as headings.",
				"Put formulas and calculations on their OWN lines: display math (\\[...\\]) or the align* environment for equations, inline math ($...$) for symbols inside prose, and state the computed result in prose right after the calculation.",
				"Write values with units as \\SI{<number>}{<unit>} using siunitx macros (\\volt, \\ohm, \\farad, \\henry, \\ampere, \\second, \\hertz, \\watt) — otherwise write plain numbers.",
				...MARKDOWN_SHARED_RULES,
				"Write plain LaTeX only: no Markdown syntax (no # headings, no ** emphasis, no backticks), no HTML, no percent signs in prose (the host escapes them).",
				articleLanguageInstruction(language)
			].join(" "),
			user
		};
		case "markdown": return {
			system: [
				"You are the article writer for DeepSeek Harness ElectroLab.",
				"Write ONE self-contained Markdown article that solves the calculation question described in the record information. The article must read like a proper technical article, not a chat reply and not a thinking transcript.",
				"Structure it with headings: the H1 title must be exactly: DeepSeek Harness ElectroLab Solution, followed by an author line with exactly: DeepSeek Harness ElectroLab. Then use clear H2 section headings for the question, the approach, the calculations and the conclusion — choose headings that fit the content; do NOT reproduce the record's internal step labels as headings.",
				"Put formulas and calculations on their OWN lines in a clean format: each equation on a separate line (e.g. `τ = R·C = 100 Ω × 0.1 F = 10 s`), intermediate steps as separate lines, and the computed result stated in prose right after the calculation. Use Markdown formatting — headings, lists, and fenced or inline code for equations — so formulas and calculations are visually distinct from the surrounding prose.",
				...MARKDOWN_SHARED_RULES,
				articleLanguageInstruction(language)
			].join(" "),
			user
		};
	}
}
/**
* Commands a generated BODY must never contain: anything that restructures
* the document (preamble classes/packages), reads or writes files, or
* redefines TeX behavior. Math environments (\begin{align}…) are allowed —
* only \begin{document}/\end{document} is rejected.
*/
const LATEX_FORBIDDEN = /\\\s*(documentclass|usepackage|RequirePackage|input|include|includeonly|write|immediate|catcode|special|makeatletter|makeatother|newcommand|renewcommand|newenvironment|renewenvironment|let|edef|gdef|global|csname|endcsname|def)(?![A-Za-z])|\\\s*(begin|end)\s*\{\s*document\s*\}/g;
/**
* Make a model-generated LaTeX body safe to compile:
* - reject preamble/restructuring commands (injection) and mismatched braces/dollars,
* - escape bare % (a comment starter in EVERY TeX mode — "50 %" would swallow the rest of the line).
*/
function sanitizeLatexBody(body) {
	const forbidden = body.match(LATEX_FORBIDDEN);
	if (forbidden !== null) return {
		ok: false,
		error: `the article body contains a forbidden LaTeX command: ${forbidden[0]}`
	};
	const escaped = body.replace(/(?<!\\)%/g, "\\%");
	const stripped = escaped.replace(/\\./g, "");
	const opens = (stripped.match(/\{/g) ?? []).length;
	const closes = (stripped.match(/\}/g) ?? []).length;
	if (opens !== closes) return {
		ok: false,
		error: `unbalanced braces in the article body (${opens} open, ${closes} close)`
	};
	if ((stripped.match(/\$/g) ?? []).length % 2 !== 0) return {
		ok: false,
		error: "unbalanced $ in the article body (odd count)"
	};
	return {
		ok: true,
		body: escaped
	};
}
/**
* The document shell around a model body. Engine is XeLaTeX for every
* language (Unicode-native; ctex needs it); template rows are the extension
* point for further languages (jlreq, kotex, …). The H1-equivalent title and
* author are fixed by the host — never by the model — and carry no date.
*
* unicode-math switches math to scalable OpenType fonts (Latin Modern Math),
* which removes the fixed-size cmex font entirely — without it, ctexart's
* zh-CN size ladder requests odd math sizes (e.g. 10.53937pt) and LaTeX emits
* "Font shape OMX/cmex/m/n not available" substitution warnings.
*/
function latexDocumentShell(templateLanguage) {
	const title = "\\title{DeepSeek Harness ElectroLab Solution}\n";
	const author = "\\author{DeepSeek Harness ElectroLab}\n";
	const head = "% !TeX program = xelatex\n";
	const opening = "\n\\begin{document}\n\\maketitle\n";
	const math = "\\usepackage{unicode-math}\n";
	switch (templateLanguage) {
		case "zh-CN": return head + "\\documentclass{ctexart}\n" + "\\usepackage{amsmath}\n\\usepackage{siunitx}\n" + math + title + author + opening;
		case "en": return head + "\\documentclass{article}\n" + "\\usepackage{fontspec}\n\\usepackage{amsmath}\n\\usepackage{siunitx}\n" + math + title + author + opening;
	}
}
/**
* Full, compilable LaTeX document from a model body: sanitize first, then wrap
* in the shell for the resolved template language.
*/
function buildLatexDocument(body, templateLanguage) {
	const checked = sanitizeLatexBody(body);
	if (!checked.ok) return checked;
	const trimmed = checked.body.trim();
	if (trimmed.length === 0) return {
		ok: false,
		error: "the model produced an empty article body"
	};
	return {
		ok: true,
		text: latexDocumentShell(templateLanguage) + trimmed + "\n\\end{document}\n"
	};
}
//#endregion
//#region src/generate-server.ts
/**
* Host article generation subsystem: LLM article jobs, file writing, optional
* PDF compilation for LaTeX (delegated to latexmk), OS reveal/open, host-driven
* directory browsing and the remembered generation settings. Ported from the v0.9.0
* generation feature and wired to the engine record store through the
* `loadRecord` dependency — this module has no Cordis imports; `register`
* takes the services it needs (web server, optional llm/agentDefaultModel).
*/
/** The web paths of the generation subsystem (shared wire contract host ↔ client). */
const GENERATE_PATH = "/api/dsh-electro-lab/generate";
const GENERATE_PROGRESS_PATH = "/api/dsh-electro-lab/generate-progress";
const GENERATE_CANCEL_PATH = "/api/dsh-electro-lab/generate-cancel";
const REVEAL_PATH = "/api/dsh-electro-lab/reveal";
const LIST_DIRS_PATH = "/api/dsh-electro-lab/list-dirs";
const LIST_ROOTS_PATH = "/api/dsh-electro-lab/list-roots";
const DIRECTORY_TREE_CSS_PATH = "/api/dsh-electro-lab/directory-tree.css";
const GENERATE_DIR_PATH = "/api/dsh-electro-lab/generate-dir";
const GENERATE_CAPABILITY_PATH = "/api/dsh-electro-lab/generate-capability";
/** Legacy plain-text location of the remembered directory (migrated on read). */
const LEGACY_GENERATE_DIR_FILE = "generate-dir.txt";
/** Membership guards for query-string enum values. */
function isArticleFormat(value) {
	return value === "markdown" || value === "latex";
}
function isArticleLanguage(value) {
	return value === "auto" || value === "zh-CN" || value === "en";
}
/** The remembered generation state, with a one-time migration from the legacy plain-text file. */
function readGenerateState(home) {
	const stored = readState(home);
	const state = {
		generateDir: typeof stored.generateDir === "string" && stored.generateDir.trim().length > 0 ? stored.generateDir.trim() : void 0,
		generateLanguage: typeof stored.generateLanguage === "string" && stored.generateLanguage.length > 0 ? stored.generateLanguage : void 0,
		generateFormat: isArticleFormat(stored.generateFormat) ? stored.generateFormat : void 0,
		generateCompile: typeof stored.generateCompile === "boolean" ? stored.generateCompile : void 0
	};
	if (state.generateDir === void 0) try {
		const legacy = readFileSync(join(home, LEGACY_GENERATE_DIR_FILE), "utf8").trim();
		if (legacy.length > 0) state.generateDir = legacy;
	} catch {}
	return state;
}
/** Persist the generation settings into the shared state file; undefined fields keep their stored values. */
function writeGenerateState(home, state) {
	updateState(home, (stored) => {
		for (const [key, value] of Object.entries(state)) if (value !== void 0) stored[key] = value;
		if (typeof stored.generateDir !== "string" || stored.generateDir.trim().length === 0) delete stored.generateDir;
		if (typeof stored.generateLanguage !== "string" || stored.generateLanguage.length === 0) delete stored.generateLanguage;
		if (!isArticleFormat(stored.generateFormat)) delete stored.generateFormat;
		if (typeof stored.generateCompile !== "boolean") delete stored.generateCompile;
	});
	try {
		rmSync(join(home, LEGACY_GENERATE_DIR_FILE), { force: true });
	} catch {}
}
/** Existing drive roots on Windows (empty elsewhere). */
function listDriveRoots() {
	if (process.platform !== "win32") return [];
	const roots = [];
	for (let code = 65; code <= 90; code++) {
		const root = `${String.fromCharCode(code)}:\\`;
		try {
			if (existsSync(root)) roots.push(root);
		} catch {}
	}
	return roots;
}
/** List one directory: its absolute path, parent, sorted subdirectory and file names, plus drive roots. */
function listDirectories(inputPath) {
	const requested = inputPath.trim();
	const resolved = requested.length > 0 && existsSync(requested) && statSync(requested).isDirectory() ? requested : homedir();
	const names = readdirSync(resolved, { withFileTypes: true });
	const entries = names.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort((a, b) => a.localeCompare(b));
	const files = names.filter((entry) => entry.isFile()).map((entry) => entry.name).sort((a, b) => a.localeCompare(b));
	const parent = join(resolved, "..");
	return {
		path: resolved,
		parent,
		entries,
		files,
		roots: parent === resolved ? listDriveRoots() : []
	};
}
/** The vendored directory-tree stylesheet (MIT, from @aiquants/directory-tree's standalone build). */
function readDirectoryTreeCss() {
	try {
		return readFileSync(new URL("../assets/directory-tree.css", import.meta.url), "utf8");
	} catch {
		return "";
	}
}
function openRecipe() {
	switch (process.platform) {
		case "darwin": return {
			commands: ["/usr/bin/open"],
			args: (target, mode, isDir) => mode === "open" || isDir ? [target] : ["-R", target]
		};
		case "win32": return {
			commands: ["explorer.exe"],
			args: (target, mode, isDir) => mode === "open" ? [target] : [isDir ? target : `/select,${target}`]
		};
		default: return {
			commands: ["xdg-open", "/usr/bin/xdg-open"],
			args: (target, mode, isDir) => [mode === "open" || isDir ? target : dirname(target)]
		};
	}
}
function spawnDetached(command, args) {
	return new Promise((resolve) => {
		try {
			const child = spawn(command, args, { detached: true });
			const timer = setTimeout(() => resolve({
				ok: true,
				message: "ok"
			}), 1e4);
			child.once("spawn", () => {
				clearTimeout(timer);
				resolve({
					ok: true,
					message: "ok"
				});
			});
			child.once("error", (error) => {
				clearTimeout(timer);
				resolve({
					ok: false,
					code: error.code,
					message: error.message
				});
			});
			child.unref();
		} catch (error) {
			resolve({
				ok: false,
				code: "THROW",
				message: error instanceof Error ? error.message : String(error)
			});
		}
	});
}
async function launchInOs(target, mode) {
	if (!existsSync(target)) return `failed: no such file or directory: ${target}`;
	const isDir = statSync(target).isDirectory();
	const recipe = openRecipe();
	const args = recipe.args(target, mode, isDir);
	for (const command of recipe.commands) {
		const outcome = await spawnDetached(command, args);
		if (outcome.ok) return "ok";
		if (outcome.code !== "ENOENT") return `failed: ${outcome.message}`;
	}
	return "failed: no suitable opener found";
}
/**
* Generate the solution article for one record through the host LLM. For
* Markdown the model's text IS the article; for LaTeX the model writes only
* the body, which is sanitized and wrapped in the document shell here.
*/
async function generateArticle(ctx, record, signal, language, format, onProgress) {
	const llm = ctx.get?.("llm");
	if (llm === void 0) throw new Error("the LLM service is unavailable in this deployment");
	const route = (ctx.get?.("agentDefaultModel"))?.currentSelection();
	if (route === void 0 || route.provider === void 0 || route.model === void 0) throw new Error("no default model is configured — pick one in Settings first");
	let templateLanguage;
	switch (format) {
		case "latex": templateLanguage = resolveTemplateLanguage(language, record.question);
	}
	const { system, user } = buildArticlePrompt(record, templateLanguage === void 0 ? language : templateLanguageToArticleLanguage(templateLanguage), format);
	const startedAt = Date.now();
	let text = "";
	for await (const raw of llm.stream({
		provider: route.provider,
		model: route.model,
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: user
			}]
		}],
		system,
		maxTokens: 4096,
		signal
	})) {
		const chunk = raw;
		if (chunk.type === "text-delta") text += chunk.text ?? "";
		else if (chunk.type === "tool-call-delta") throw new Error("the generation model unexpectedly requested a tool");
		else if (chunk.type === "finish" && chunk.reason === "aborted") throw new Error("article generation was aborted");
		if (onProgress !== void 0) onProgress(Math.min(90, 10 + (Date.now() - startedAt) / 3e4 * 80));
	}
	const trimmed = text.trim();
	if (trimmed.length === 0) throw new Error("the model produced no article text");
	if (templateLanguage === void 0) return trimmed;
	const document = buildLatexDocument(trimmed, templateLanguage);
	if (!document.ok) throw new Error(`LaTeX validation failed: ${document.error}`);
	return document.text;
}
const generateJobs = /* @__PURE__ */ new Map();
/** Run one command and collect its output tail; kills on timeout. */
function runCommand(command, args, cwd, timeoutMs) {
	return new Promise((resolve) => {
		try {
			const child = spawn(command, args, { cwd });
			let output = "";
			let timedOut = false;
			const timer = setTimeout(() => {
				timedOut = true;
				child.kill();
			}, timeoutMs);
			child.stdout?.on("data", (chunk) => {
				output += String(chunk);
			});
			child.stderr?.on("data", (chunk) => {
				output += String(chunk);
			});
			child.on("error", (error) => {
				clearTimeout(timer);
				resolve({
					ok: false,
					code: null,
					output: error.message,
					timedOut
				});
			});
			child.on("close", (code) => {
				clearTimeout(timer);
				resolve({
					ok: code === 0,
					code,
					output: output.slice(-4e3),
					timedOut
				});
			});
		} catch (error) {
			resolve({
				ok: false,
				code: null,
				output: error instanceof Error ? error.message : String(error),
				timedOut: false
			});
		}
	});
}
/**
* The LaTeX drivers compilation can be delegated to, in preference order: latexmk (TeX Live, and MiKTeX
* with its Perl runtime), then texify (MiKTeX's own driver, no Perl). Both decide themselves how many
* engine passes a document needs. Which one a run uses is settled before the run starts.
*/
const LATEX_DRIVERS = [{
	command: "latexmk",
	args: [
		"-pdfxe",
		"-interaction=nonstopmode",
		"-halt-on-error",
		"-synctex=1"
	]
}, {
	command: "texify",
	args: [
		"--pdf",
		"--engine=xetex",
		"--synctex=1",
		"--tex-option=--interaction=nonstopmode"
	]
}];
/** Both drivers run this engine; a distribution without it cannot produce a PDF however good the driver is. */
const REQUIRED_ENGINE = "xelatex";
/** One driver's own budget; it runs the engine as often as it needs inside it. */
const COMPILE_TIMEOUT_MS = 12e4;
/** What the dialog says when no driver is installed at all. */
const NO_DRIVER_MESSAGE = "no LaTeX driver found (latexmk or texify)";
/** What it says when a driver exists but the engine it would run does not. */
const NO_ENGINE_MESSAGE = "no xelatex engine found";
/** The argument set of a driver the pre-flight chose; the run only uses it and never picks one itself. */
function driverArgs(command) {
	const known = LATEX_DRIVERS.find((driver) => command.toLowerCase().includes(driver.command));
	if (known === void 0) throw new Error(`unknown LaTeX driver "${command}"`);
	return known.args;
}
/** Where one driver binary is looked for: PATH first, then the known MiKTeX install locations on Windows. */
function driverCandidates(command) {
	const candidates = [command];
	if (process.platform === "win32") {
		for (const root of listDriveRoots()) candidates.push(join(root, "MiKTeX", "miktex", "bin", "x64", `${command}.exe`));
		const local = process.env.LOCALAPPDATA;
		if (local !== void 0) candidates.push(join(local, "Programs", "MiKTeX", "miktex", "bin", "x64", `${command}.exe`));
		candidates.push(`C:\\Program Files\\MiKTeX\\miktex\\bin\\x64\\${command}.exe`);
		candidates.push(`C:\\Program Files (x86)\\MiKTeX\\miktex\\bin\\x64\\${command}.exe`);
	}
	return candidates;
}
/**
* One short line for the dialog; a driver's full output goes to the log, where length costs nothing.
* A TeX error line (the engine marks those with `!`) says the most, then a line naming a cause, and
* only then the driver's own wrapper line — its banner is worth nothing to the reader.
*/
function firstLine(text) {
	const lines = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
	const line = lines.find((part) => part.startsWith("!")) ?? lines.find((part) => /error|could not|can't|cannot|not found/i.test(part)) ?? lines.find((part) => /did not succeed/i.test(part)) ?? lines[0] ?? "";
	return line.length > 120 ? `${line.slice(0, 120)}…` : line;
}
/**
* Compile a generated LaTeX source to PDF with the driver the pre-flight chose: one run, no fallback and
* no choice made here. The driver owns how many times the engine runs; this function only reports what
* came of it — `detail` for the log (the driver's own output, or a description of its silence) and
* `quoted` for the dialog (the one line worth showing, empty when the driver said nothing usable).
*/
async function compileLatexToPdf(directory, fileName, driver) {
	const pdfPath = join(directory, fileName.replace(/\.(tex)$/i, ".pdf"));
	const name = basename(driver);
	const result = await runCommand(driver, [...driverArgs(driver), fileName], directory, COMPILE_TIMEOUT_MS);
	if (!result.ok) {
		const started = result.code !== null;
		return {
			ok: false,
			detail: result.timedOut ? `the driver timed out after ${COMPILE_TIMEOUT_MS / 1e3} s` : started ? result.output.trim() || "the driver failed without any output" : `${name} could not be started: ${result.output.trim()}`,
			quoted: result.timedOut || !started ? "" : firstLine(result.output)
		};
	}
	if (!existsSync(pdfPath)) {
		const failure = `${name} finished but produced no PDF`;
		return {
			ok: false,
			detail: failure,
			quoted: failure
		};
	}
	return {
		ok: true,
		pdfPath
	};
}
/** A probe is only a version query; a driver that does not answer quickly is unusable anyway. */
const PROBE_TIMEOUT_MS = 5e3;
/** The macros each document shell needs (a missing one is a hint, never a block: MiKTeX installs on demand). */
const SHELL_PACKAGES = {
	["zh-CN"]: ["ctexart.cls"],
	["en"]: [
		"fontspec.sty",
		"unicode-math.sty",
		"siunitx.sty"
	]
};
/** Probe one command by asking for its version: exit 0 means it can run at all. */
async function probeDriver(command) {
	for (const candidate of driverCandidates(command)) {
		const result = await runCommand(candidate, ["--version"], homedir(), PROBE_TIMEOUT_MS);
		if (!result.ok) {
			if (result.code === null) continue;
			return {
				command,
				ok: false,
				detail: firstLine(result.output)
			};
		}
		return {
			command,
			ok: true,
			path: candidate
		};
	}
	return {
		command,
		ok: false,
		detail: "not installed"
	};
}
/** Which of the asked languages' shell macros kpsewhich cannot find; no kpsewhich at all means all of them. */
async function probePackages(language) {
	const templates = language === "zh-CN" ? ["zh-CN"] : language === "en" ? ["en"] : ["zh-CN", "en"];
	const missing = [];
	for (const template of templates) for (const file of SHELL_PACKAGES[template]) {
		const found = await runCommand("kpsewhich", [file], homedir(), PROBE_TIMEOUT_MS);
		if (!found.ok || found.output.trim().length === 0) missing.push(file);
	}
	return missing;
}
/**
* Probe the drivers and the engine they would run. A driver that cannot run is logged here — once,
* because this is the only place that looks at them.
*/
async function probeToolchain() {
	const drivers = [];
	for (const driver of LATEX_DRIVERS) {
		const probe = await probeDriver(driver.command);
		drivers.push(probe);
		if (!probe.ok) log.warn("latex driver unusable", {
			driver: probe.command,
			error: probe.detail
		});
		if (probe.ok) break;
	}
	const chosen = drivers.find((probe) => probe.ok);
	const engine = chosen === void 0 ? {
		command: REQUIRED_ENGINE,
		ok: false,
		detail: "no driver to run it"
	} : await probeDriver(REQUIRED_ENGINE);
	if (chosen !== void 0 && !engine.ok) log.warn("latex driver unusable", {
		driver: engine.command,
		error: engine.detail
	});
	const ready = chosen !== void 0 && engine.ok;
	return {
		ready,
		driver: ready ? chosen.path ?? chosen.command : null,
		drivers,
		engine
	};
}
let toolchainCache = null;
let toolchainProbe = null;
/**
* The toolchain, probed once per plugin mount: neither generating an article nor installing a TeX
* distribution is a frequent event, so a host restart — which an installation wants anyway — is the
* natural moment to look again. Callers arriving during the first probe share it.
*/
async function readToolchain() {
	if (toolchainCache !== null) return toolchainCache;
	if (toolchainProbe !== null) return toolchainProbe;
	const probe = probeToolchain();
	toolchainProbe = probe;
	try {
		const toolchain = await probe;
		toolchainCache = toolchain;
		return toolchain;
	} finally {
		toolchainProbe = null;
	}
}
const packageCache = /* @__PURE__ */ new Map();
/** This language's missing shell macros, probed once per plugin mount like the toolchain. */
async function readPackages(language) {
	const cached = packageCache.get(language);
	if (cached !== void 0) return cached;
	const missing = await probePackages(language);
	packageCache.set(language, missing);
	return missing;
}
/**
* The capability report for one article language. The toolchain is decided once for the whole process,
* so neither a dialog nor a job start re-probes or re-logs it; only the macros depend on the language.
*/
async function readCapability(language) {
	const toolchain = await readToolchain();
	return {
		ready: toolchain.ready,
		driver: toolchain.driver,
		drivers: toolchain.drivers,
		engine: toolchain.engine,
		missingPackages: toolchain.ready ? await readPackages(language) : []
	};
}
/** Start a background generation job and return its id; progress is polled via GET /generate-progress. */
/**
* 审计 C1（纵深）：返回 path 最深「已存在祖先」的 realpath；不存在任何祖先时返回 null。
* 用于在目标尚未创建时仍能捕获「中间目录是链接」的逃逸。
* 必须用 realpathSync.native：普通 realpathSync 在 Windows 上**不解析 junction**
* （实测返回 junction 自身路径），而 junction 是 Windows 上不需管理员即可创建的逃逸路径。
*/
function deepestExistingRealPath(path) {
	let current = path;
	for (;;) {
		try {
			return realpathSync.native(current);
		} catch {}
		const parent = dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
/**
* 审计 C1：解析输出路径并做「词法 + realpath」双重包含校验，限制在 outputRoot
* （默认 <home>/generated）内；越界即抛错。beginGenerate 在启动任务前先调一次
* （fail-fast，不浪费 LLM token），写入前再调一次（防父目录中途被换成符号链接）。
*/
function resolveOutputTarget(directory, fileName, isLatex, home) {
	const root = resolve(home, "generated");
	const resolvedDir = isAbsolute(directory) ? resolve(directory) : resolve(root, directory);
	const targetDir = isLatex ? join(resolvedDir, fileName.replace(/\.tex$/i, "")) : resolvedDir;
	const target = resolve(targetDir, fileName);
	const rel = relative(root, target);
	if (rel !== "" && (rel.startsWith(".." + sep) || rel === ".." || isAbsolute(rel))) throw new Error(`输出路径越界：${target} 不在 ${root} 内`);
	const realRoot = deepestExistingRealPath(root);
	if (realRoot !== null) {
		const realAncestor = deepestExistingRealPath(target) ?? realRoot;
		const realRel = relative(realRoot, realAncestor);
		if (realRel !== "" && (realRel.startsWith(".." + sep) || realRel === ".." || isAbsolute(realRel))) throw new Error(`输出路径越界：${target} 经符号链接指向 ${root} 外（realpath ${realAncestor}）`);
	}
	return {
		targetDir,
		target
	};
}
function startGenerateJob(ctx, deps, record, directory, fileName, language, format, compile, driver) {
	const jobId = randomUUID();
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 3e5);
	const startedAt = Date.now();
	const job = {
		status: "running",
		percent: 5,
		phase: "prepare",
		abort: () => controller.abort()
	};
	generateJobs.set(jobId, job);
	(async () => {
		log.info("article generation started", {
			format,
			language,
			file: fileName,
			dir: directory
		});
		try {
			job.percent = 10;
			job.phase = "generate";
			const article = await generateArticle(ctx, record, controller.signal, language, format, (percent) => {
				job.percent = percent;
			});
			job.phase = "write";
			job.percent = 92;
			const isLatex = format === "latex";
			const { targetDir, target } = resolveOutputTarget(directory, fileName, isLatex, deps.home);
			mkdirSync(targetDir, { recursive: true });
			writeFileSync(target, article, "utf8");
			if (compile && isLatex) {
				job.phase = "compile";
				job.percent = 96;
				if (driver === null) {
					log.warn("latex compile failed", {
						file: target,
						error: NO_DRIVER_MESSAGE
					});
					job.compileError = "";
				} else {
					const compiled = await compileLatexToPdf(targetDir, fileName, driver);
					if (compiled.ok) job.pdfPath = compiled.pdfPath;
					else {
						log.warn("latex compile failed", {
							file: target,
							error: compiled.detail
						});
						job.compileError = compiled.quoted;
					}
				}
			}
			job.status = "done";
			job.percent = 100;
			job.path = target;
			log.info("article generation finished", {
				format,
				took_ms: Date.now() - startedAt,
				path: target
			});
		} catch (error) {
			job.status = "error";
			job.error = error instanceof Error ? error.message : String(error);
			log.error("article generation failed", {
				format,
				took_ms: Date.now() - startedAt,
				error
			});
		} finally {
			clearTimeout(timeout);
			setTimeout(() => {
				generateJobs.delete(jobId);
			}, 6e4);
		}
	})();
	return jobId;
}
/** Validate the generation request and start the job; throws on bad input. */
async function beginGenerate(ctx, deps, url) {
	const params = new URL(url, "http://dsh.local").searchParams;
	const recordId = params.get("recordId") ?? "";
	const formatParam = params.get("format") ?? "markdown";
	if (!isArticleFormat(formatParam)) throw new Error(`unsupported format "${formatParam}"`);
	const languageParam = params.get("language") ?? "auto";
	if (!isArticleLanguage(languageParam)) throw new Error(`unsupported language "${languageParam}"`);
	const directory = (params.get("directory") ?? "").trim();
	if (directory.length === 0) throw new Error("output directory is required");
	const record = deps.loadRecord(recordId);
	if (record === void 0) throw new Error(`record "${recordId}" not found`);
	const rawName = (params.get("fileName") ?? "").trim();
	const fileName = rawName.length === 0 ? normalizeFileName(`electro-lab-${record.id.slice(0, 8)}`, formatParam) : normalizeFileName(rawName, formatParam);
	resolveOutputTarget(directory, fileName, formatParam === "latex", deps.home);
	const compile = params.get("compile") === "true";
	let driver = null;
	if (compile && formatParam === "latex") {
		const capability = await readCapability(languageParam);
		if (capability.driver === null) throw new Error(capability.drivers.some((probe) => probe.ok) ? NO_ENGINE_MESSAGE : NO_DRIVER_MESSAGE);
		driver = capability.driver;
	}
	return { jobId: startGenerateJob(ctx, deps, record, directory, fileName, languageParam, formatParam, compile, driver) };
}
/** Register every generation endpoint; returns one disposer for all of them. */
function registerGenerateEndpoints(ctx, deps) {
	const disposers = [];
	disposers.push(ctx.webServer.register({
		kind: "exact",
		path: GENERATE_PATH,
		handler: async (req, res) => {
			if (rejectCrossOrigin(req, res)) return;
			const request = req;
			if ((request.method ?? "GET") !== "POST") {
				res.statusCode = 405;
				res.end("method not allowed");
				return;
			}
			try {
				const { jobId } = await beginGenerate(ctx, deps, request.url ?? "");
				res.setHeader("content-type", "application/json");
				res.end(JSON.stringify({ jobId }));
			} catch (error) {
				res.statusCode = 400;
				res.setHeader("content-type", "application/json");
				res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
			}
		}
	}));
	disposers.push(ctx.webServer.register({
		kind: "exact",
		path: GENERATE_CAPABILITY_PATH,
		handler: async (req, res) => {
			if (rejectCrossOrigin(req, res)) return;
			const request = req;
			if ((request.method ?? "GET") !== "GET") {
				res.statusCode = 405;
				res.end("method not allowed");
				return;
			}
			const languageParam = request.url === void 0 ? null : new URL(request.url, "http://dsh.local").searchParams.get("language");
			const language = languageParam !== null && isArticleLanguage(languageParam) ? languageParam : "auto";
			res.setHeader("content-type", "application/json");
			res.end(JSON.stringify(await readCapability(language)));
		}
	}));
	disposers.push(ctx.webServer.register({
		kind: "exact",
		path: LIST_DIRS_PATH,
		handler: (req, res) => {
			if (rejectCrossOrigin(req, res)) return;
			const request = req;
			if ((request.method ?? "GET") !== "GET") {
				res.statusCode = 405;
				res.end("method not allowed");
				return;
			}
			const path = request.url === void 0 ? "" : new URL(request.url, "http://dsh.local").searchParams.get("path") ?? "";
			try {
				res.setHeader("content-type", "application/json");
				res.end(JSON.stringify(listDirectories(path)));
			} catch (error) {
				res.statusCode = 400;
				res.setHeader("content-type", "application/json");
				res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
			}
		}
	}));
	disposers.push(ctx.webServer.register({
		kind: "exact",
		path: LIST_ROOTS_PATH,
		handler: (req, res) => {
			if (rejectCrossOrigin(req, res)) return;
			if ((req.method ?? "GET") !== "GET") {
				res.statusCode = 405;
				res.end("method not allowed");
				return;
			}
			const drives = listDriveRoots();
			res.setHeader("content-type", "application/json");
			res.end(JSON.stringify({ roots: drives.length > 0 ? drives : [homedir()] }));
		}
	}));
	disposers.push(ctx.webServer.register({
		kind: "exact",
		path: DIRECTORY_TREE_CSS_PATH,
		handler: (req, res) => {
			if (rejectCrossOrigin(req, res)) return;
			if ((req.method ?? "GET") !== "GET") {
				res.statusCode = 405;
				res.end("method not allowed");
				return;
			}
			res.setHeader("content-type", "text/css");
			res.end(readDirectoryTreeCss());
		}
	}));
	disposers.push(ctx.webServer.register({
		kind: "exact",
		path: GENERATE_CANCEL_PATH,
		handler: (req, res) => {
			if (rejectCrossOrigin(req, res)) return;
			const request = req;
			if ((request.method ?? "GET") !== "POST") {
				res.statusCode = 405;
				res.end("method not allowed");
				return;
			}
			const jobId = request.url === void 0 ? null : new URL(request.url, "http://dsh.local").searchParams.get("jobId");
			const job = jobId === null ? void 0 : generateJobs.get(jobId);
			if (job !== void 0 && job.status === "running") job.abort();
			res.setHeader("content-type", "application/json");
			res.end(JSON.stringify({ cancelled: job !== void 0 && job.status === "running" }));
		}
	}));
	disposers.push(ctx.webServer.register({
		kind: "exact",
		path: REVEAL_PATH,
		handler: async (req, res) => {
			if (rejectCrossOrigin(req, res)) return;
			const request = req;
			if ((request.method ?? "GET") !== "POST") {
				res.statusCode = 405;
				res.end("method not allowed");
				return;
			}
			const url = new URL(request.url ?? "", "http://dsh.local");
			const target = url.searchParams.get("path") ?? "";
			if (target.length === 0) {
				res.statusCode = 400;
				res.setHeader("content-type", "application/json");
				res.end(JSON.stringify({ error: "path is required" }));
				return;
			}
			const action = url.searchParams.get("action") === "open" ? "open" : "reveal";
			res.setHeader("content-type", "application/json");
			res.end(JSON.stringify({ result: await launchInOs(target, action) }));
		}
	}));
	disposers.push(ctx.webServer.register({
		kind: "exact",
		path: GENERATE_PROGRESS_PATH,
		handler: (req, res) => {
			if (rejectCrossOrigin(req, res)) return;
			const request = req;
			if ((request.method ?? "GET") !== "GET") {
				res.statusCode = 405;
				res.end("method not allowed");
				return;
			}
			const jobId = request.url === void 0 ? null : new URL(request.url, "http://dsh.local").searchParams.get("jobId");
			const job = jobId === null ? void 0 : generateJobs.get(jobId);
			if (job === void 0) {
				res.statusCode = 404;
				res.setHeader("content-type", "application/json");
				res.end(JSON.stringify({ error: "generation job not found" }));
				return;
			}
			res.setHeader("content-type", "application/json");
			res.end(JSON.stringify({
				status: job.status,
				percent: job.percent,
				phase: job.phase,
				...job.path === void 0 ? {} : { path: job.path },
				...job.pdfPath === void 0 ? {} : { pdfPath: job.pdfPath },
				...job.compileError === void 0 ? {} : { compileError: job.compileError },
				...job.error === void 0 ? {} : { error: job.error }
			}));
		}
	}));
	disposers.push(ctx.webServer.register({
		kind: "exact",
		path: GENERATE_DIR_PATH,
		handler: (req, res) => {
			if (rejectCrossOrigin(req, res)) return;
			const request = req;
			const method = request.method ?? "GET";
			if (method === "PUT") {
				const url = new URL(request.url ?? "", "http://dsh.local");
				const dir = url.searchParams.get("dir");
				const language = url.searchParams.get("language");
				const format = url.searchParams.get("format");
				const compileParam = url.searchParams.get("compile");
				const state = {};
				if (dir !== null) state.generateDir = dir;
				if (language !== null) state.generateLanguage = language;
				if (format !== null) state.generateFormat = format;
				if (compileParam === "true" || compileParam === "false") state.generateCompile = compileParam === "true";
				writeGenerateState(deps.home, state);
				res.setHeader("content-type", "application/json");
				res.end(JSON.stringify({ saved: true }));
				return;
			}
			if (method !== "GET") {
				res.statusCode = 405;
				res.end("method not allowed");
				return;
			}
			const state = readGenerateState(deps.home);
			res.setHeader("content-type", "application/json");
			res.end(JSON.stringify({
				directory: state.generateDir ?? "",
				language: state.generateLanguage ?? "auto",
				format: state.generateFormat ?? "markdown",
				compile: state.generateCompile ?? false
			}));
		}
	}));
	return () => {
		for (const off of disposers) off();
	};
}
//#endregion
//#region src/skill.ts
/**
* Skill registration. Skill bodies live as individual Markdown files under
* skills/ (frontmatter carries name/description/whenToUse, the body is the
* instruction content). The plugin reads them from the installed package at
* runtime and registers them with the skills service; a missing service or
* file is logged and skipped — tools keep working either way.
*/
/** Strip matching surrounding double quotes (frontmatter values are valid YAML scalars). */
function unquote(value) {
	if (value.length >= 2 && value.startsWith("\"") && value.endsWith("\"")) return value.slice(1, -1);
	return value;
}
/** Parse leading YAML frontmatter (--- delimited, simple `key: value` lines) plus the body. */
function parseSkillFile(text) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
	if (match === null) throw new Error("skill file is missing YAML frontmatter");
	const meta = {};
	for (const line of match[1].split(/\r?\n/)) {
		const kv = /^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/.exec(line);
		if (kv !== null) meta[kv[1]] = unquote(kv[2]);
	}
	const name = meta["name"];
	const description = meta["description"];
	if (name === void 0 || description === void 0) throw new Error("skill frontmatter needs name and description");
	const skill = {
		name,
		description,
		content: match[2].trim() + "\n"
	};
	if (meta["whenToUse"] !== void 0) skill.whenToUse = meta["whenToUse"];
	return skill;
}
/** Package-relative skills directory (lib/.. = package root). */
const SKILLS_DIR = new URL("../skills/", import.meta.url);
/** Skill files shipped with the package, in registration order. Skill names
*  carry the plugin prefix (electro-lab-*) so they never collide with
*  skills from other plugins in the shared registry. */
const SKILL_FILES = ["electro-lab-template.md", "electro-lab-interface.md"];
/** Register every packaged skill; returns one disposer that unregisters all. */
function registerSkills(ctx) {
	const skills = ctx.get("skills");
	if (skills === void 0) return () => {};
	const disposers = [];
	for (const file of SKILL_FILES) try {
		const skill = parseSkillFile(readFileSync(new URL(file, SKILLS_DIR), "utf8"));
		disposers.push(skills.register(skill));
	} catch (error) {
		log.warn("skill not registered", {
			file,
			error
		});
	}
	return () => {
		for (const off of disposers) off();
	};
}
//#endregion
//#region src/preset.ts
/**
* Packaged-preset installation: the plugin ships an `electro-lab` agent
* preset under its own `presets/` directory (no plugin, no tools — the
* preset travels with the package). On apply it is synced into the DSH
* user preset root ($DSH_HOME/.agent-presets/<id>), where the agentPresets
* discovery re-reads the roots on every list(), so the picker sees it once
* the plugin is loaded.
*
* The preset is plugin-owned: every apply overwrites the target with the
* packaged files, so the shipped preset always matches the installed
* plugin version. Local edits to the preset are intentionally not
* preserved — a stale preset would drift from the tools the plugin
* actually registers.
*/
/** Package-relative presets directory (lib/.. = package root). */
const PRESETS_DIR = new URL("../presets/", import.meta.url);
/** Files a preset directory must carry to be installable. */
const REQUIRED_FILES = ["agent.cordis.yml", "preset.yml"];
/** The DSH user preset root (matches dsh-agent-presets' USER_PRESET_DIR). */
function userPresetRoot() {
	const home = process.env.DSH_HOME ?? join(homedir(), ".dsh");
	return join(home, ".agent-presets");
}
/**
* Sync every packaged preset into the user preset root, overwriting any
* existing copy. Returns the ids it synced (for logging); throws on
* filesystem errors so the caller can warn without breaking the plugin.
*/
function installPresets() {
	const synced = [];
	for (const entry of readdirSync(PRESETS_DIR, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const id = entry.name;
		const target = join(userPresetRoot(), id);
		mkdirSync(target, { recursive: true });
		for (const file of REQUIRED_FILES) copyFileSync(new URL(`${id}/${file}`, PRESETS_DIR), join(target, file));
		synced.push(id);
	}
	return synced;
}
//#endregion
//#region src/index.ts
/**
* Host half of dsh-electro-lab (engine era).
*
* One process-wide global engine (Engine): variable table + solver registry + record storage.
* apply assembly: registers the kernel and external solvers, registers the LLM tool surface (set/get/call +
* markers) and the declaration management tools (external_solver_add/update/delete), and mounts two
* endpoints (record index, external solver archive management).
*/
/** Plugin identity for cordis.yml rows. */
const name = "dsh-electro-lab";
/** Services required before mounting: the tool registry and the web server (endpoint host). */
const inject = ["tools", "webServer"];
/** An unexpected endpoint throw is logged before it reaches the web server; behavior is unchanged. */
function guard(path, handler) {
	return (req, res) => {
		if (rejectCrossOrigin(req, res)) return;
		try {
			const pending = handler(req, res);
			if (pending instanceof Promise) return pending.catch((error) => {
				log.error("endpoint failed", {
					path,
					error
				});
				throw error;
			});
			return pending;
		} catch (error) {
			log.error("endpoint failed", {
				path,
				error
			});
			throw error;
		}
	};
}
/** The records home: records/ + record-index.jsonl live here. */
const recordsHome = process.env.DSH_ELECTRO_LAB_HOME ?? join(homedir(), ".dsh-electro-lab");
/** Global single engine: one engine per process; any session's markers act on it. */
const engine = new Engine(recordsHome);
const RECORDS_INDEX_PATH = "/api/dsh-electro-lab/records-index";
const RECORDS_BODY_PREFIX = "/api/dsh-electro-lab/records";
const EXTERNAL_PATH = "/api/dsh-electro-lab/external-solvers";
/**
* Flatten one stored engine record into the article-generation facts: the
* question, established conditions, analysis notes, successful solver steps
* with their resolved arguments and results, and the final answer. Failed
* attempts and introspection rows are skipped.
*/
function loadGenerationRecord(id) {
	const meta = engine.indexRows().find((row) => row.id === id);
	if (meta === void 0) return void 0;
	const conditions = [];
	const notes = [];
	const calls = [];
	const results = [];
	let answer = "";
	for (const row of engine.store.readRows(id)) {
		if (row.ok !== true) continue;
		if (row.tool === "marker") {
			const text = typeof row.text === "string" ? row.text.trim() : "";
			if (text.length === 0) continue;
			if (row.kind === "analyse") notes.push(text);
			else if (row.kind === "answer") answer = text;
			continue;
		}
		if (row.tool === "set") {
			const name = typeof row.name === "string" ? row.name : "";
			if (row.deleted === true) conditions.push(`${name}: removed`);
			else conditions.push(`${name}: ${JSON.stringify(row.value)}`);
			continue;
		}
		if (row.tool === "call" && typeof row.solver === "string") {
			const callId = String(row.seq);
			calls.push({
				callId,
				name: row.solver,
				arguments: JSON.stringify(row.resolved ?? row.args ?? {})
			});
			if (row.result !== null && row.result !== void 0) results.push({
				callId,
				content: JSON.stringify(row.result)
			});
		}
	}
	const analyse = [conditions.length > 0 ? `Established conditions:\n${conditions.map((line) => `- ${line}`).join("\n")}` : "", ...notes].filter((line) => line.length > 0).join("\n\n");
	return {
		id,
		question: meta.question,
		analyse,
		answer,
		calls,
		results
	};
}
function apply(ctx) {
	const level = resolveLevel(process.env.DSH_ELECTRO_LAB_LOG_LEVEL);
	setLevel(level);
	ctx.effect(() => {
		const startedAt = Date.now();
		const detachConsole = attachConsoleSink();
		let run;
		try {
			run = attachFileSink(recordsHome);
		} catch (error) {
			log.warn("log file sink unavailable", {
				home: recordsHome,
				error
			});
		}
		log.info("plugin mounted", {
			home: recordsHome,
			file: run?.file ?? null,
			pid: process.pid,
			level
		});
		return () => {
			log.info("plugin unmounted", { uptime_ms: Date.now() - startedAt });
			if (run !== void 0) run.close();
			detachConsole();
		};
	}, "dsh-electro-lab: logger");
	ctx.effect(() => {
		const disposers = [];
		engine.start();
		for (const solver of registerKernelSolvers()) if (engine.registry.get(solver.id) === void 0) engine.registry.register(solver);
		for (const declaration of readDeclarations(recordsHome)) {
			if (declaration.enabled === false) continue;
			try {
				const solver = compileExternalSolver(declaration);
				if (solver !== null && engine.registry.get(solver.id) === void 0) engine.registry.register(solver);
			} catch (error) {
				log.warn("declaration skipped", {
					solver: declaration.name,
					error
				});
			}
		}
		try {
			clearRestartRequired(recordsHome);
		} catch (error) {
			log.warn("restart flag not cleared", {
				home: recordsHome,
				error
			});
		}
		for (const tool of createEngineTools(engine)) disposers.push(ctx.tools.register(tool));
		return () => {
			for (const off of disposers) off();
		};
	}, "dsh-electro-lab: engine");
	ctx.effect(() => registerSkills(ctx), "dsh-electro-lab: skills");
	ctx.effect(() => {
		const disposers = [];
		disposers.push(ctx.webServer.register({
			kind: "exact",
			path: RECORDS_INDEX_PATH,
			handler: guard(RECORDS_INDEX_PATH, (req, res) => {
				if ((req.method ?? "GET") !== "GET") {
					res.statusCode = 405;
					res.end("method not allowed");
					return;
				}
				res.setHeader("content-type", "application/json");
				res.end(JSON.stringify({ rows: engine.indexRows() }));
			})
		}));
		disposers.push(ctx.webServer.register({
			kind: "prefix",
			path: RECORDS_BODY_PREFIX,
			handler: guard(RECORDS_BODY_PREFIX, (req, res) => {
				const request = req;
				const method = request.method ?? "GET";
				res.setHeader("content-type", "application/json");
				const path = request.url === void 0 ? "" : request.url.split("?")[0] ?? "";
				const id = path.startsWith(`${RECORDS_BODY_PREFIX}/`) ? path.slice(29) : "";
				if (id.length === 0) {
					res.statusCode = 400;
					res.end(JSON.stringify({ error: "a record id is required" }));
					return;
				}
				if (method === "DELETE") {
					if (engine.openId() === id) {
						res.statusCode = 409;
						res.end(JSON.stringify({ error: `record "${id}" is open — finish or settle it first` }));
						return;
					}
					if (engine.indexRows().find((row) => row.id === id) === void 0) {
						res.statusCode = 404;
						res.end(JSON.stringify({ error: `no record "${id}"` }));
						return;
					}
					engine.store.deleteRecord(id);
					res.end(JSON.stringify({ deleted: true }));
					return;
				}
				if (method !== "GET") {
					res.statusCode = 405;
					res.end("method not allowed");
					return;
				}
				const meta = engine.indexRows().find((row) => row.id === id);
				if (meta === void 0 || !engine.store.hasRecord(id)) {
					res.statusCode = 404;
					res.end(JSON.stringify({ error: `no record "${id}"` }));
					return;
				}
				res.end(JSON.stringify({
					id,
					openedAt: meta.openedAt,
					sealedAt: meta.sealedAt,
					question: meta.question,
					rows: engine.store.readRows(id)
				}));
			})
		}));
		disposers.push(ctx.webServer.register({
			kind: "exact",
			path: EXTERNAL_PATH,
			handler: guard(EXTERNAL_PATH, (req, res) => {
				const request = req;
				const method = request.method ?? "GET";
				res.setHeader("content-type", "application/json");
				if (method === "PUT") {
					const encoded = request.url === void 0 ? null : new URL(request.url, "http://dsh.local").searchParams.get("config");
					if (encoded === null) {
						res.statusCode = 400;
						res.end(JSON.stringify({ error: "config parameter is required (base64 JSON)" }));
						return;
					}
					let config;
					try {
						config = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
					} catch {
						res.statusCode = 400;
						res.end(JSON.stringify({ error: "config is not valid base64 JSON" }));
						return;
					}
					const errors = validateDeclaration(config);
					if (errors.length > 0) {
						res.statusCode = 400;
						res.end(JSON.stringify({ error: errors.join("; ") }));
						return;
					}
					upsertDeclaration(recordsHome, config);
					res.end(JSON.stringify({
						saved: true,
						restartRequired: true
					}));
					return;
				}
				if (method === "DELETE") {
					const name = request.url === void 0 ? null : new URL(request.url, "http://dsh.local").searchParams.get("name");
					const deleted = name !== null && deleteDeclaration(recordsHome, name);
					res.end(JSON.stringify({
						deleted,
						restartRequired: restartRequired(recordsHome)
					}));
					return;
				}
				if (method !== "GET") {
					res.statusCode = 405;
					res.end("method not allowed");
					return;
				}
				res.end(JSON.stringify({
					solvers: readDeclarations(recordsHome),
					restartRequired: restartRequired(recordsHome)
				}));
			})
		}));
		disposers.push(registerGenerateEndpoints(ctx, {
			home: recordsHome,
			loadRecord: loadGenerationRecord
		}));
		return () => {
			for (const off of disposers) off();
		};
	}, "dsh-electro-lab: web");
	try {
		const synced = installPresets();
		if (synced.length > 0) log.info("presets synced", { count: synced.length });
	} catch (error) {
		log.warn("preset sync failed", { error });
	}
}
//#endregion
export { apply, engine, inject, name };
