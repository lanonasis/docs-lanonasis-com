import React, {useState, useEffect, useRef} from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import styles from './ApiPlayground.module.css';

/**
 * API Playground page
 *
 * This component provides an interactive interface for exploring your OpenAPI
 * specification directly from your documentation. It reads the API
 * definition from `/openapi.json` or `/openapi.yaml` at runtime and
 * auto‑generates a form for query/path parameters and request bodies.
 *
 * The UI follows the LanOnasis docs theme, using Docusaurus utilities and
 * CSS variables for a cohesive look. Your API key is persisted in
 * localStorage so you don't need to re‑enter it on every visit.
 */
export default function ApiPlayground() {
  const [operations, setOperations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyText, setBodyText] = useState('');
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('apiKey') ?? '';
    }
    return '';
  });
  const [response, setResponse] = useState('');
  const [curl, setCurl] = useState('');
  const specRef = useRef<any>(null);

  // Fetch the OpenAPI spec on mount
  useEffect(() => {
    async function fetchSpec() {
      const candidateUrls = ['/openapi.json', '/openapi.yaml', '/openapi.yml'];
      let spec: any = null;
      for (const url of candidateUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const text = await res.text();
            if (url.endsWith('.json')) {
              spec = JSON.parse(text);
            } else {
              // Dynamically import js-yaml to parse YAML definitions
              const yaml = await import('js-yaml');
              spec = yaml.load(text);
            }
            break;
          }
        } catch (e) {
          // ignore and try the next candidate
        }
      }
      if (spec) {
        specRef.current = spec;
        setOperations(extractOperations(spec));
      }
    }
    fetchSpec();
  }, []);

  // Helper to build operations list from spec
  function extractOperations(spec: any) {
    const ops: any[] = [];
    if (!spec || !spec.paths) return ops;
    Object.entries(spec.paths).forEach(([path, methods]) => {
      Object.entries(methods as any).forEach(([method, details]) => {
        const params: any[] = [];
        (details.parameters || []).forEach((p: any) => {
          params.push({
            name: p.name,
            in: p.in,
            required: Boolean(p.required),
            description: p.description || '',
            schema: p.schema || {},
          });
        });
        const hasBody = Boolean(details.requestBody);
        let defaultBody = '';
        if (hasBody) {
          try {
            const content = details.requestBody.content || {};
            const jsonContent = content['application/json'] || content['application/json; charset=utf-8'];
            if (jsonContent) {
              if (jsonContent.example) {
                defaultBody = JSON.stringify(jsonContent.example, null, 2);
              } else if (jsonContent.examples) {
                const first = Object.values(jsonContent.examples)[0] as any;
                defaultBody = JSON.stringify(first.value, null, 2);
              } else if (jsonContent.schema && jsonContent.schema.example) {
                defaultBody = JSON.stringify(jsonContent.schema.example, null, 2);
              }
            }
          } catch (e) {
            // ignore
          }
        }
        ops.push({ path, method, params, hasBody, defaultBody });
      });
    });
    return ops;
  }

  // Update parameter values
  const updateParam = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };

  // Persist API key on change
  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('apiKey', key);
    }
  };

  // Compose and send request
  async function runRequest() {
    if (selectedIndex === null) return;
    const op = operations[selectedIndex];
    // Determine base URL from servers list or use window origin
    const spec = specRef.current;
    const baseUrl = spec?.servers?.[0]?.url?.replace(/\/$/, '') || '';
    // Build path with path params substituted
    let urlPath = op.path as string;
    op.params
      .filter((p: any) => p.in === 'path')
      .forEach((p: any) => {
        const value = paramValues[p.name] || '';
        urlPath = urlPath.replace(`{${p.name}}`, encodeURIComponent(value));
      });
    // Build query string
    const queryParts = op.params
      .filter((p: any) => p.in === 'query' && paramValues[p.name])
      .map((p: any) => `${encodeURIComponent(p.name)}=${encodeURIComponent(paramValues[p.name])}`);
    const queryString = queryParts.join('&');
    const fullUrl = `${baseUrl}${urlPath}${queryString ? (urlPath.includes('?') ? '&' : '?') + queryString : ''}`;
    const headers: Record<string, string> = {};
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    let body: any;
    if (op.hasBody) {
      try {
        body = bodyText ? JSON.parse(bodyText) : undefined;
        if (body) headers['Content-Type'] = 'application/json';
      } catch (e) {
        setResponse('Invalid JSON in request body');
        return;
      }
    }
    const options: any = { method: op.method.toUpperCase(), headers };
    if (body !== undefined) options.body = JSON.stringify(body);
    try {
      const res = await fetch(fullUrl, options);
      const contentType = res.headers.get('content-type') || '';
      let data: any;
      if (contentType.includes('application/json')) {
        data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
      } else {
        data = await res.text();
        setResponse(data);
      }
      // Build cURL snippet
      const headerFlags = Object.entries(headers)
        .map(([k, v]) => `-H \"${k}: ${v}\"`)
        .join(' ');
      const dataFlag = options.body ? `-d '${options.body}'` : '';
      const curlCmd = `curl -X ${options.method} \"${fullUrl}\" ${headerFlags} ${dataFlag}`.trim();
      setCurl(curlCmd);
    } catch (e: any) {
      setResponse(`Error: ${e.message || e.toString()}`);
    }
  }

  // Reset form when operation changes
  useEffect(() => {
    if (selectedIndex === null) return;
    const op = operations[selectedIndex];
    setParamValues({});
    setBodyText(op.defaultBody || '');
    setResponse('');
    setCurl('');
  }, [selectedIndex]);

  return (
    <Layout
      title="API Playground"
      description="Interactively test the LanOnasis API endpoints directly from the docs."
    >
      <div className="container margin-vert--lg">
        <h1>API Playground</h1>
        {operations.length ? (
          <>
            {/* Endpoint selector */}
            <div className={styles.formGroup}>
              <label htmlFor="endpoint">Endpoint</label>
              <select
                id="endpoint"
                value={selectedIndex ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedIndex(value === '' ? null : parseInt(value, 10));
                }}
                className={styles.input}
              >
                <option value="">Select an endpoint</option>
                {operations.map((op: any, idx: number) => (
                  <option key={idx} value={idx}>{`${op.method.toUpperCase()} ${op.path}`}</option>
                ))}
              </select>
            </div>
            {/* Parameter inputs */}
            {selectedIndex !== null && operations[selectedIndex].params.length > 0 && (
              <div className={styles.paramSection}>
                {operations[selectedIndex].params.map((p: any) => (
                  <div key={p.name} className={styles.formGroup}>
                    <label>
                      {p.name}
                      {p.required && <span style={{ color: 'var(--ifm-color-danger)' }}> *</span>}
                    </label>
                    <input
                      type="text"
                      value={paramValues[p.name] || ''}
                      onChange={(e) => updateParam(p.name, e.target.value)}
                      className={styles.input}
                    />
                    {p.description && <small className={styles.description}>{p.description}</small>}
                  </div>
                ))}
              </div>
            )}
            {/* Body */}
            {selectedIndex !== null && operations[selectedIndex].hasBody && (
              <div className={styles.formGroup}>
                <label>Request Body (JSON)</label>
                <textarea
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className={clsx(styles.input, styles.textarea)}
                />
              </div>
            )}
            {/* API Key */}
            <div className={styles.formGroup}>
              <label htmlFor="apiKey">API Key (Bearer token)</label>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className={styles.input}
              />
            </div>
            {/* Run button */}
            <button
              className={clsx('button button--primary', styles.runButton)}
              onClick={runRequest}
              disabled={selectedIndex === null}
            >
              Run Request
            </button>
            {/* Response output */}
            {response && (
              <div className="margin-top--lg">
                <h2>Response</h2>
                {/* Use CodeBlock to provide syntax highlighting */}
                <CodeBlock language="json">{response}</CodeBlock>
              </div>
            )}
            {/* cURL snippet */}
            {curl && (
              <div className="margin-top--lg">
                <h2>cURL</h2>
                <CodeBlock language="bash">{curl}</CodeBlock>
              </div>
            )}
          </>
        ) : (
          <p>Loading API specification...</p>
        )}
      </div>
    </Layout>
  );
}