import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import styles from './ApiPlayground.module.css';

/**
 * Enhanced API Playground for LanOnasis Documentation
 *
 * A modern, interactive interface for exploring the LanOnasis API directly
 * from the documentation. Features include:
 * - Split-pane request/response layout
 * - Multi-language code generation with tabbed interface
 * - Response metadata (status, timing, size)
 * - Request history with replay capability
 * - Copy-to-clipboard functionality
 * - Smooth animations and visual feedback
 */

// Language configuration for code generation
const LANGUAGES = [
  { id: 'curl', name: 'cURL', icon: '🌐' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'php', name: 'PHP', icon: '🐘' },
] as const;

type LanguageId = typeof LANGUAGES[number]['id'];

interface Operation {
  path: string;
  method: string;
  summary?: string;
  params: Parameter[];
  hasBody: boolean;
  defaultBody: string;
}

interface Parameter {
  name: string;
  in: 'query' | 'path' | 'header';
  required: boolean;
  description: string;
  schema: {
    type?: string;
    enum?: string[];
    default?: any;
  };
}

interface ResponseMeta {
  status: number;
  statusText: string;
  time: number;
  size: string;
}

interface HistoryItem {
  id: string;
  method: string;
  path: string;
  params: Record<string, string>;
  status: number;
  time: number;
  timestamp: Date;
}

export default function ApiPlayground() {
  // Core state
  const [operations, setOperations] = useState<Operation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyText, setBodyText] = useState('');
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lanonasis_api_key') ?? '';
    }
    return '';
  });

  // Response state
  const [response, setResponse] = useState<string>('');
  const [responseMeta, setResponseMeta] = useState<ResponseMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Code generation state
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>('curl');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lanonasis_playground_history');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const specRef = useRef<any>(null);

  // Fetch OpenAPI spec on mount
  useEffect(() => {
    async function fetchSpec() {
      const candidateUrls = ['/openapi.json', '/openapi.yaml', '/openapi.yml'];
      let spec: any = null;
      let lastError = '';

      for (const url of candidateUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const text = await res.text();
            if (url.endsWith('.json')) {
              spec = JSON.parse(text);
            } else {
              try {
                const yaml = await import('js-yaml');
                spec = yaml.load(text);
              } catch (yamlError: any) {
                lastError = `YAML parsing failed: ${yamlError.message}`;
                continue;
              }
            }
            break;
          }
        } catch (e: any) {
          lastError = e.message;
        }
      }

      if (spec) {
        specRef.current = spec;
        setOperations(extractOperations(spec));
      } else {
        setError(`Failed to load API specification. ${lastError}`);
      }
    }
    fetchSpec();
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lanonasis_playground_history', JSON.stringify(history.slice(0, 20)));
    }
  }, [history]);

  // Extract operations from OpenAPI spec
  function extractOperations(spec: any): Operation[] {
    const ops: Operation[] = [];
    if (!spec?.paths) return ops;

    Object.entries(spec.paths).forEach(([path, methods]) => {
      Object.entries(methods as any).forEach(([method, details]) => {
        if (typeof details !== 'object' || !details) return;

        const params: Parameter[] = [];
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
            const content = details.requestBody?.content || {};
            const jsonContent = content['application/json'];
            if (jsonContent?.example) {
              defaultBody = JSON.stringify(jsonContent.example, null, 2);
            } else if (jsonContent?.examples) {
              const first = Object.values(jsonContent.examples)[0] as any;
              defaultBody = JSON.stringify(first?.value, null, 2);
            }
          } catch {
            // Ignore
          }
        }

        ops.push({
          path,
          method,
          summary: details.summary,
          params,
          hasBody,
          defaultBody,
        });
      });
    });

    return ops;
  }

  // Handle parameter changes
  const updateParam = useCallback((name: string, value: string) => {
    setParamValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Persist API key
  const handleApiKeyChange = useCallback((key: string) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lanonasis_api_key', key);
    }
  }, []);

  // Build full URL for request
  const buildUrl = useCallback((op: Operation): string => {
    const spec = specRef.current;
    const baseUrl = spec?.servers?.[0]?.url?.replace(/\/$/, '') || '';
    let urlPath = op.path;

    // Substitute path parameters
    op.params
      .filter(p => p.in === 'path')
      .forEach(p => {
        const value = paramValues[p.name] || '';
        urlPath = urlPath.replace(`{${p.name}}`, encodeURIComponent(value));
      });

    // Build query string
    const queryParts = op.params
      .filter(p => p.in === 'query' && paramValues[p.name])
      .map(p => `${encodeURIComponent(p.name)}=${encodeURIComponent(paramValues[p.name])}`);

    const queryString = queryParts.join('&');
    return `${baseUrl}${urlPath}${queryString ? (urlPath.includes('?') ? '&' : '?') + queryString : ''}`;
  }, [paramValues]);

  // Generate code for selected language
  const generateCode = useCallback((language: LanguageId): string => {
    if (selectedIndex === null) return '';
    const op = operations[selectedIndex];
    const url = buildUrl(op);
    const method = op.method.toUpperCase();

    const generators: Record<LanguageId, () => string> = {
      curl: () => {
        let cmd = `curl -X ${method} "${url}"`;
        if (apiKey) cmd += ` \\\n  -H "Authorization: Bearer ${apiKey}"`;
        if (op.hasBody && bodyText) {
          cmd += ` \\\n  -H "Content-Type: application/json"`;
          cmd += ` \\\n  -d '${bodyText.replace(/\n/g, '')}'`;
        }
        return cmd;
      },
      javascript: () => {
        let code = `const response = await fetch('${url}', {\n`;
        code += `  method: '${method}',\n`;
        code += `  headers: {\n`;
        if (apiKey) code += `    'Authorization': 'Bearer ${apiKey}',\n`;
        code += `    'Content-Type': 'application/json'\n`;
        code += `  }`;
        if (op.hasBody && bodyText) {
          code += `,\n  body: JSON.stringify(${bodyText})`;
        }
        code += `\n});\n\nconst data = await response.json();\nconsole.log(data);`;
        return code;
      },
      typescript: () => {
        let code = `interface ApiResponse {\n  success: boolean;\n  data?: any;\n  error?: { code: string; message: string; };\n}\n\n`;
        code += `const response = await fetch('${url}', {\n`;
        code += `  method: '${method}',\n`;
        code += `  headers: {\n`;
        if (apiKey) code += `    'Authorization': 'Bearer ${apiKey}',\n`;
        code += `    'Content-Type': 'application/json'\n`;
        code += `  }`;
        if (op.hasBody && bodyText) {
          code += `,\n  body: JSON.stringify(${bodyText})`;
        }
        code += `\n});\n\nconst data: ApiResponse = await response.json();\nconsole.log(data);`;
        return code;
      },
      python: () => {
        let code = `import requests\n\n`;
        code += `url = '${url}'\n`;
        code += `headers = {\n`;
        if (apiKey) code += `    'Authorization': 'Bearer ${apiKey}',\n`;
        code += `    'Content-Type': 'application/json'\n}\n\n`;
        if (op.hasBody && bodyText) {
          code += `data = ${bodyText}\n\n`;
          code += `response = requests.${method.toLowerCase()}(url, headers=headers, json=data)\n`;
        } else {
          code += `response = requests.${method.toLowerCase()}(url, headers=headers)\n`;
        }
        code += `print(response.json())`;
        return code;
      },
      go: () => {
        let code = `package main\n\nimport (\n    "fmt"\n    "net/http"\n`;
        if (op.hasBody && bodyText) code += `    "bytes"\n`;
        code += `    "io"\n)\n\nfunc main() {\n`;
        if (op.hasBody && bodyText) {
          code += `    body := []byte(\`${bodyText}\`)\n`;
          code += `    req, _ := http.NewRequest("${method}", "${url}", bytes.NewBuffer(body))\n`;
        } else {
          code += `    req, _ := http.NewRequest("${method}", "${url}", nil)\n`;
        }
        if (apiKey) code += `    req.Header.Set("Authorization", "Bearer ${apiKey}")\n`;
        code += `    req.Header.Set("Content-Type", "application/json")\n\n`;
        code += `    client := &http.Client{}\n`;
        code += `    resp, _ := client.Do(req)\n`;
        code += `    defer resp.Body.Close()\n\n`;
        code += `    data, _ := io.ReadAll(resp.Body)\n`;
        code += `    fmt.Println(string(data))\n}`;
        return code;
      },
      php: () => {
        let code = `<?php\n\n$url = '${url}';\n`;
        code += `$headers = [\n`;
        if (apiKey) code += `    'Authorization: Bearer ${apiKey}',\n`;
        code += `    'Content-Type: application/json'\n];\n\n`;
        code += `$ch = curl_init();\n`;
        code += `curl_setopt($ch, CURLOPT_URL, $url);\n`;
        code += `curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);\n`;
        code += `curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n`;
        if (method !== 'GET') {
          code += `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${method}');\n`;
        }
        if (op.hasBody && bodyText) {
          code += `curl_setopt($ch, CURLOPT_POSTFIELDS, '${bodyText.replace(/\n/g, '')}');\n`;
        }
        code += `\n$response = curl_exec($ch);\ncurl_close($ch);\n\nprint_r(json_decode($response, true));`;
        return code;
      },
    };

    return generators[language]?.() || '';
  }, [selectedIndex, operations, buildUrl, apiKey, bodyText]);

  // Execute API request
  const runRequest = useCallback(async () => {
    if (selectedIndex === null) return;

    const op = operations[selectedIndex];
    setIsLoading(true);
    setError(null);
    setResponse('');
    setResponseMeta(null);

    const startTime = performance.now();

    try {
      const url = buildUrl(op);
      const headers: Record<string, string> = {};
      if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

      let body: any;
      if (op.hasBody && bodyText) {
        try {
          body = JSON.parse(bodyText);
          headers['Content-Type'] = 'application/json';
        } catch {
          throw new Error('Invalid JSON in request body');
        }
      }

      const res = await fetch(url, {
        method: op.method.toUpperCase(),
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const endTime = performance.now();
      const contentType = res.headers.get('content-type') || '';
      let data: any;
      let responseText: string;

      if (contentType.includes('application/json')) {
        data = await res.json();
        responseText = JSON.stringify(data, null, 2);
      } else {
        responseText = await res.text();
      }

      const size = new Blob([responseText]).size;
      setResponse(responseText);
      setResponseMeta({
        status: res.status,
        statusText: res.statusText,
        time: Math.round(endTime - startTime),
        size: size > 1024 ? `${(size / 1024).toFixed(1)} KB` : `${size} B`,
      });

      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        method: op.method.toUpperCase(),
        path: op.path,
        params: { ...paramValues },
        status: res.status,
        time: Math.round(endTime - startTime),
        timestamp: new Date(),
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 19)]);

    } catch (e: any) {
      setError(e.message || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  }, [selectedIndex, operations, buildUrl, apiKey, bodyText, paramValues]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, type: 'code' | 'response') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedResponse(true);
        setTimeout(() => setCopiedResponse(false), 2000);
      }
    } catch {
      // Fallback
    }
  }, []);

  // Replay history item
  const replayHistory = useCallback((item: HistoryItem) => {
    const idx = operations.findIndex(op => op.path === item.path && op.method.toUpperCase() === item.method);
    if (idx !== -1) {
      setSelectedIndex(idx);
      setParamValues(item.params);
    }
  }, [operations]);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lanonasis_playground_history');
    }
  }, []);

  // Reset form when operation changes
  useEffect(() => {
    if (selectedIndex === null) return;
    const op = operations[selectedIndex];
    setParamValues({});
    setBodyText(op.defaultBody || '');
    setResponse('');
    setResponseMeta(null);
    setError(null);
  }, [selectedIndex, operations]);

  // Get method badge class
  const getMethodClass = (method: string) => {
    const m = method.toLowerCase();
    return styles[`method${m.charAt(0).toUpperCase() + m.slice(1)}`] || styles.methodGet;
  };

  // Get status class
  const getStatusClass = (status: number) => {
    if (status >= 200 && status < 300) return styles.statusSuccess;
    if (status >= 400) return styles.statusError;
    return styles.statusWarning;
  };

  const selectedOp = selectedIndex !== null ? operations[selectedIndex] : null;

  return (
    <Layout
      title="API Playground"
      description="Interactively test the LanOnasis Memory as a Service API endpoints."
    >
      <div className="container margin-vert--lg">
        {/* Hero Section */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>API Playground</h1>
          <p className={styles.heroSubtitle}>
            Explore and test the LanOnasis API in real-time
          </p>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Memory as a Service
          </div>
        </div>

        {error && !operations.length ? (
          <div className={styles.errorBanner}>
            <span className={styles.errorIcon}>⚠️</span>
            <div className={styles.errorContent}>
              <h3 className={styles.errorTitle}>Error Loading API Specification</h3>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          </div>
        ) : !operations.length ? (
          <div className={styles.emptyState}>
            <div className={styles.spinner} />
            <p className={styles.emptyStateText}>Loading API specification...</p>
          </div>
        ) : (
          <>
            {/* Main Playground */}
            <div className={styles.playgroundContainer}>
              {/* Request Panel */}
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>
                    <span className={styles.panelIcon}>📤</span>
                    Request
                  </h2>
                </div>
                <div className={styles.panelContent}>
                  {/* Endpoint Selector */}
                  <div className={styles.endpointSelector}>
                    {selectedOp && (
                      <span className={clsx(styles.methodBadge, getMethodClass(selectedOp.method))}>
                        {selectedOp.method.toUpperCase()}
                      </span>
                    )}
                    <select
                      value={selectedIndex ?? ''}
                      onChange={(e) => setSelectedIndex(e.target.value === '' ? null : parseInt(e.target.value, 10))}
                      className={styles.endpointSelect}
                      aria-label="Select endpoint"
                    >
                      <option value="">Select an endpoint...</option>
                      {operations.map((op, idx) => (
                        <option key={idx} value={idx}>
                          {op.path}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedOp && (
                    <>
                      {/* Parameters */}
                      {selectedOp.params.length > 0 && (
                        <div className={styles.paramSection}>
                          <div className={styles.paramSectionTitle}>
                            <span>📋</span> Parameters
                          </div>
                          {selectedOp.params.map((p) => (
                            <div key={p.name} className={styles.formGroup}>
                              <label className={styles.formLabel}>
                                {p.name}
                                {p.required && <span className={styles.required}>*</span>}
                                {p.schema.type && (
                                  <span className={styles.paramType}>{p.schema.type}</span>
                                )}
                              </label>
                              {p.schema.enum ? (
                                <select
                                  value={paramValues[p.name] || p.schema.default || ''}
                                  onChange={(e) => updateParam(p.name, e.target.value)}
                                  className={styles.input}
                                >
                                  <option value="">Select...</option>
                                  {p.schema.enum.map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={paramValues[p.name] || ''}
                                  onChange={(e) => updateParam(p.name, e.target.value)}
                                  placeholder={p.schema.default?.toString() || `Enter ${p.name}...`}
                                  className={styles.input}
                                />
                              )}
                              {p.description && (
                                <small className={styles.description}>{p.description}</small>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Request Body */}
                      {selectedOp.hasBody && (
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>
                            Request Body
                            <span className={styles.paramType}>JSON</span>
                          </label>
                          <textarea
                            value={bodyText}
                            onChange={(e) => setBodyText(e.target.value)}
                            placeholder='{"key": "value"}'
                            className={clsx(styles.input, styles.textarea)}
                          />
                        </div>
                      )}

                      {/* API Key */}
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          🔑 API Key
                          <span className={styles.paramType}>Bearer</span>
                        </label>
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => handleApiKeyChange(e.target.value)}
                          placeholder="Enter your API key..."
                          className={styles.input}
                        />
                        <small className={styles.description}>
                          Stored locally in your browser for convenience
                        </small>
                      </div>

                      {/* Run Button */}
                      <button
                        onClick={runRequest}
                        disabled={isLoading}
                        className={clsx(styles.runButton, isLoading && styles.runButtonLoading)}
                      >
                        {isLoading ? (
                          <>
                            <span className={styles.spinner} />
                            Sending...
                          </>
                        ) : (
                          <>
                            <span>▶️</span>
                            Send Request
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Response Panel */}
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>
                    <span className={styles.panelIcon}>📥</span>
                    Response
                  </h2>
                </div>
                <div className={styles.panelContent}>
                  {error && (
                    <div className={clsx(styles.errorBanner, styles.fadeIn)}>
                      <span className={styles.errorIcon}>❌</span>
                      <div className={styles.errorContent}>
                        <h3 className={styles.errorTitle}>Request Failed</h3>
                        <p className={styles.errorMessage}>{error}</p>
                      </div>
                    </div>
                  )}

                  {responseMeta && (
                    <div className={clsx(styles.responseMetadata, styles.fadeIn)}>
                      <div className={styles.metadataItem}>
                        <span className={styles.metadataLabel}>Status:</span>
                        <span className={clsx(styles.metadataValue, getStatusClass(responseMeta.status))}>
                          {responseMeta.status} {responseMeta.statusText}
                        </span>
                      </div>
                      <div className={styles.metadataItem}>
                        <span className={styles.metadataLabel}>Time:</span>
                        <span className={styles.metadataValue}>{responseMeta.time}ms</span>
                      </div>
                      <div className={styles.metadataItem}>
                        <span className={styles.metadataLabel}>Size:</span>
                        <span className={styles.metadataValue}>{responseMeta.size}</span>
                      </div>
                    </div>
                  )}

                  {response ? (
                    <div className={clsx(styles.responseBody, styles.fadeIn)}>
                      <button
                        onClick={() => copyToClipboard(response, 'response')}
                        className={clsx(styles.copyButton, copiedResponse && styles.copySuccess)}
                      >
                        {copiedResponse ? '✓ Copied!' : '📋 Copy'}
                      </button>
                      <CodeBlock language="json">{response}</CodeBlock>
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyStateIcon}>🚀</div>
                      <p className={styles.emptyStateText}>Ready to explore</p>
                      <p className={styles.emptyStateHint}>
                        Select an endpoint and click "Send Request"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Code Generation Section */}
            {selectedOp && (
              <div className={clsx(styles.panel, 'margin-top--lg', styles.fadeIn)}>
                <div className={styles.codeTabs}>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={clsx(
                        styles.codeTab,
                        selectedLanguage === lang.id && styles.codeTabActive
                      )}
                    >
                      <span className={styles.codeTabIcon}>{lang.icon}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
                <div className={styles.panelContent}>
                  <div className={styles.responseBody}>
                    <button
                      onClick={() => copyToClipboard(generateCode(selectedLanguage), 'code')}
                      className={clsx(styles.copyButton, copiedCode && styles.copySuccess)}
                    >
                      {copiedCode ? '✓ Copied!' : '📋 Copy'}
                    </button>
                    <CodeBlock language={selectedLanguage === 'curl' ? 'bash' : selectedLanguage}>
                      {generateCode(selectedLanguage)}
                    </CodeBlock>
                  </div>
                </div>
              </div>
            )}

            {/* Request History */}
            {history.length > 0 && (
              <div className={styles.historySection}>
                <div className={styles.historyHeader}>
                  <h3 className={styles.historyTitle}>
                    <span>🕒</span> Recent Requests
                  </h3>
                  <button onClick={clearHistory} className={styles.clearHistoryBtn}>
                    Clear History
                  </button>
                </div>
                <div className={styles.historyList}>
                  {history.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => replayHistory(item)}
                      className={styles.historyItem}
                    >
                      <span className={clsx(styles.historyMethod, styles.methodBadge, getMethodClass(item.method))}>
                        {item.method}
                      </span>
                      <span className={styles.historyEndpoint}>{item.path}</span>
                      <span className={clsx(styles.historyStatus, getStatusClass(item.status))}>
                        {item.status}
                      </span>
                      <span className={styles.historyTime}>{item.time}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
