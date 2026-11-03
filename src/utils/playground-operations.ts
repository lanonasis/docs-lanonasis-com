/**
 * Operation extraction for the API Playground.
 *
 * Kept in its own module so it can be unit tested without pulling in the
 * Docusaurus page (which depends on `@theme/*` aliases only available inside
 * a Docusaurus build).
 */

export interface Parameter {
  name: string;
  in: "query" | "path" | "header";
  required: boolean;
  description: string;
  schema: {
    type?: string;
    enum?: string[];
    default?: any;
  };
}

export interface Operation {
  path: string;
  method: string;
  summary?: string;
  params: Parameter[];
  hasBody: boolean;
  defaultBody: string;
}

/**
 * The only keys of a Path Item Object that describe an operation.
 * Everything else (`servers`, `parameters`, `summary`, `description`, `$ref`
 * and any `x-` extension) is path-level metadata, not an endpoint.
 */
export const HTTP_METHODS: ReadonlySet<string> = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
  "trace",
]);

export function operationKey(method: string, path: string): string {
  return `${method} ${path}`;
}

/**
 * Flatten an OpenAPI document's `paths` into a de-duplicated list of
 * operations. Non-HTTP path-item keys are skipped before their value is
 * inspected, and the result is keyed on `METHOD path` so a generator
 * regression cannot surface the same endpoint twice.
 */
export function extractOperations(spec: any): Operation[] {
  const byKey = new Map<string, Operation>();
  if (!spec?.paths || typeof spec.paths !== "object") return [];

  Object.entries(spec.paths).forEach(([path, pathItemRaw]) => {
    const pathItem = pathItemRaw as any;
    if (!pathItem || typeof pathItem !== "object") return;

    Object.entries(pathItem).forEach(([methodRaw, detailsRaw]) => {
      const method = String(methodRaw).toLowerCase();
      // Whitelist first: never treat `servers`/`parameters`/`x-*` as an operation.
      if (!HTTP_METHODS.has(method)) return;

      const details = detailsRaw as any;
      if (typeof details !== "object" || !details) return;

      const key = operationKey(method, path);
      if (byKey.has(key)) return;

      const params: Parameter[] = [];
      (details?.parameters || []).forEach((p: any) => {
        params.push({
          name: p.name,
          in: p.in,
          required: Boolean(p.required),
          description: p.description || "",
          schema: p.schema || {},
        });
      });

      const hasBody = Boolean(details?.requestBody);
      let defaultBody = "";
      if (hasBody) {
        try {
          const content = details?.requestBody?.content || {};
          const jsonContent = content["application/json"];
          if (jsonContent?.example) {
            defaultBody = JSON.stringify(jsonContent.example, null, 2);
          } else if (jsonContent?.examples) {
            const first = Object.values(jsonContent.examples)[0] as any;
            defaultBody = JSON.stringify(first?.value, null, 2);
          }
        } catch {
          // Ignore malformed examples
        }
      }

      byKey.set(key, {
        path,
        method,
        summary: details?.summary,
        params,
        hasBody,
        defaultBody,
      });
    });
  });

  return Array.from(byKey.values());
}
