import React, { useState, useCallback } from 'react';
import clsx from 'clsx';

interface APIPlaygroundProps {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  examples?: Array<{
    name: string;
    request: any;
    response: any;
  }>;
}

export default function APIPlayground({
  endpoint,
  method,
  description,
  examples = []
}: APIPlaygroundProps): JSX.Element {
  const [selectedExample, setSelectedExample] = useState(0);
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExampleSelect = useCallback((index: number) => {
    setSelectedExample(index);
    if (examples[index]) {
      setRequestBody(JSON.stringify(examples[index].request, null, 2));
    }
  }, [examples]);

  const handleExecute = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const url = `https://api.lanonasis.com${endpoint}`;
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-api-key'
        }
      };

      if (method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Request failed');
      }

      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, method, requestBody]);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="api-playground border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={clsx(
              'px-2 py-1 rounded text-sm font-medium',
              getMethodColor(method)
            )}>
              {method}
            </span>
            <code className="text-sm font-mono text-gray-700">{endpoint}</code>
          </div>
          <button
            onClick={handleExecute}
            disabled={loading}
            className={clsx(
              'px-4 py-2 rounded text-sm font-medium transition-colors',
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {loading ? 'Executing...' : 'Execute'}
          </button>
        </div>
        {description && (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Request Panel */}
        <div className="border-r border-gray-200">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Request</h3>
          </div>
          
          {/* Examples */}
          {examples.length > 0 && (
            <div className="px-4 py-3 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Examples
              </label>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleSelect(index)}
                    className={clsx(
                      'px-3 py-1 rounded text-sm transition-colors',
                      selectedExample === index
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Request Body */}
          {method !== 'GET' && (
            <div className="px-4 py-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Body
              </label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 rounded font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter JSON request body..."
              />
            </div>
          )}
        </div>

        {/* Response Panel */}
        <div>
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Response</h3>
          </div>
          
          <div className="p-4">
            {loading && (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {response && (
              <div className="bg-gray-50 border border-gray-200 rounded p-3">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}

            {!loading && !error && !response && (
              <div className="text-center text-gray-500 py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm">Click Execute to test the API</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}