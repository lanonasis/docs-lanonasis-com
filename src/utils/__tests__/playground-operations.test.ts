import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  HTTP_METHODS,
  extractOperations,
  operationKey,
} from "../playground-operations";

// Resolved from the repo root: `bun test` runs with the project root as cwd.
const SPEC_PATH = path.join(process.cwd(), "static", "memory-api.json");

function loadSpec(): any {
  return JSON.parse(readFileSync(SPEC_PATH, "utf8"));
}

describe("extractOperations", () => {
  const spec = loadSpec();
  const operations = extractOperations(spec);

  test("returns exactly the 39 real operations in memory-api.json", () => {
    // 34 path keys, 5 of which carry two HTTP methods.
    expect(Object.keys(spec.paths)).toHaveLength(34);
    expect(operations).toHaveLength(39);
  });

  test("only emits whitelisted HTTP methods", () => {
    for (const op of operations) {
      expect(HTTP_METHODS.has(op.method)).toBe(true);
    }
    expect(operations.some((op) => op.method === "servers")).toBe(false);
  });

  test("does not emit path-level metadata as operations", () => {
    const metadataKeys = new Set([
      "servers",
      "parameters",
      "summary",
      "description",
      "$ref",
    ]);
    for (const op of operations) {
      expect(metadataKeys.has(op.method)).toBe(false);
    }
    // The four path-level `servers` blocks must not add rows.
    const pathsWithServers = Object.entries(spec.paths)
      .filter(([, item]: [string, any]) => Array.isArray(item?.servers))
      .map(([p]) => p);
    expect(pathsWithServers.length).toBeGreaterThan(0);
    for (const p of pathsWithServers) {
      expect(operations.filter((op) => op.path === p).length).toBeLessThanOrEqual(2);
      expect(operations.some((op) => op.path === p && op.method === "servers")).toBe(false);
    }
  });

  test("has no duplicate METHOD path pair", () => {
    const keys = operations.map((op) => operationKey(op.method, op.path));
    expect(new Set(keys).size).toBe(keys.length);
  });

  test("dedupes a regressed spec that repeats an operation", () => {
    const regressed = {
      paths: {
        "/memories/search": {
          get: { summary: "search" },
          post: { summary: "search" },
          servers: [{ url: "https://example.test" }],
        },
      },
    };
    const ops = extractOperations(regressed);
    expect(ops.map((o) => o.method)).toEqual(["get", "post"]);
  });
});
