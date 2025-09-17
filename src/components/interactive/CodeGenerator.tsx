import React, { useState, useCallback } from 'react';
import clsx from 'clsx';

interface CodeGeneratorProps {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  parameters?: Record<string, any>;
}

const LANGUAGES = [
  { id: 'curl', name: 'cURL', icon: '🌐' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'php', name: 'PHP', icon: '🐘' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'csharp', name: 'C#', icon: '🔷' },
];

export default function CodeGenerator({
  endpoint,
  method,
  parameters = {}
}: CodeGeneratorProps): JSX.Element {
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [apiKey, setApiKey] = useState('your-api-key-here');
  const [customParams, setCustomParams] = useState(parameters);

  const generateCode = useCallback((language: string) => {
    const baseUrl = 'https://api.lanonasis.com';
    const fullUrl = `${baseUrl}${endpoint}`;

    switch (language) {
      case 'curl':
        return generateCurl(fullUrl, method, customParams, apiKey);
      case 'javascript':
        return generateJavaScript(fullUrl, method, customParams, apiKey);
      case 'typescript':
        return generateTypeScript(fullUrl, method, customParams, apiKey);
      case 'python':
        return generatePython(fullUrl, method, customParams, apiKey);
      case 'php':
        return generatePHP(fullUrl, method, customParams, apiKey);
      case 'go':
        return generateGo(fullUrl, method, customParams, apiKey);
      case 'java':
        return generateJava(fullUrl, method, customParams, apiKey);
      case 'csharp':
        return generateCSharp(fullUrl, method, customParams, apiKey);
      default:
        return '';
    }
  }, [endpoint, method, customParams, apiKey]);

  const copyToClipboard = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, []);

  return (
    <div className="code-generator border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Code Generator</h3>
          <button
            onClick={() => copyToClipboard(generateCode(selectedLanguage))}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Copy Code
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={clsx(
                'px-3 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-2',
                selectedLanguage === lang.id
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <span>{lang.icon}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your-api-key-here"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base URL
            </label>
            <input
              type="text"
              value="https://api.lanonasis.com"
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-100 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Generated Code */}
      <div className="p-4">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
          <code>{generateCode(selectedLanguage)}</code>
        </pre>
      </div>
    </div>
  );
}

function generateCurl(url: string, method: string, params: any, apiKey: string): string {
  let curl = `curl -X ${method} "${url}" \\\n`;
  curl += `  -H "Authorization: Bearer ${apiKey}" \\\n`;
  curl += `  -H "Content-Type: application/json"`;
  
  if (method !== 'GET' && Object.keys(params).length > 0) {
    curl += ` \\\n  -d '${JSON.stringify(params, null, 2)}'`;
  }
  
  return curl;
}

function generateJavaScript(url: string, method: string, params: any, apiKey: string): string {
  let code = `const response = await fetch('${url}', {\n`;
  code += `  method: '${method}',\n`;
  code += `  headers: {\n`;
  code += `    'Authorization': 'Bearer ${apiKey}',\n`;
  code += `    'Content-Type': 'application/json'\n`;
  code += `  }`;
  
  if (method !== 'GET' && Object.keys(params).length > 0) {
    code += `,\n  body: JSON.stringify(${JSON.stringify(params, null, 4)})`;
  }
  
  code += `\n});\n\n`;
  code += `const data = await response.json();\n`;
  code += `console.log(data);`;
  
  return code;
}

function generateTypeScript(url: string, method: string, params: any, apiKey: string): string {
  let code = `interface Response {\n`;
  code += `  success: boolean;\n`;
  code += `  data?: any;\n`;
  code += `  error?: {\n`;
  code += `    code: string;\n`;
  code += `    message: string;\n`;
  code += `  };\n`;
  code += `}\n\n`;
  
  code += `const response = await fetch('${url}', {\n`;
  code += `  method: '${method}',\n`;
  code += `  headers: {\n`;
  code += `    'Authorization': 'Bearer ${apiKey}',\n`;
  code += `    'Content-Type': 'application/json'\n`;
  code += `  }`;
  
  if (method !== 'GET' && Object.keys(params).length > 0) {
    code += `,\n  body: JSON.stringify(${JSON.stringify(params, null, 4)})`;
  }
  
  code += `\n});\n\n`;
  code += `const data: Response = await response.json();\n`;
  code += `console.log(data);`;
  
  return code;
}

function generatePython(url: string, method: string, params: any, apiKey: string): string {
  let code = `import requests\n\n`;
  code += `url = '${url}'\n`;
  code += `headers = {\n`;
  code += `    'Authorization': 'Bearer ${apiKey}',\n`;
  code += `    'Content-Type': 'application/json'\n`;
  code += `}\n\n`;
  
  if (method !== 'GET' && Object.keys(params).length > 0) {
    code += `data = ${JSON.stringify(params, null, 4)}\n\n`;
    code += `response = requests.${method.toLowerCase()}('${url}', headers=headers, json=data)\n`;
  } else {
    code += `response = requests.${method.toLowerCase()}('${url}', headers=headers)\n`;
  }
  
  code += `\ndata = response.json()\n`;
  code += `print(data)`;
  
  return code;
}

function generatePHP(url: string, method: string, params: any, apiKey: string): string {
  let code = `<?php\n\n`;
  code += `$url = '${url}';\n`;
  code += `$headers = [\n`;
  code += `    'Authorization: Bearer ${apiKey}',\n`;
  code += `    'Content-Type: application/json'\n`;
  code += `];\n\n`;
  
  if (method !== 'GET' && Object.keys(params).length > 0) {
    code += `$data = ${JSON.stringify(params, null, 4)};\n\n`;
    code += `$ch = curl_init();\n`;
    code += `curl_setopt($ch, CURLOPT_URL, $url);\n`;
    code += `curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);\n`;
    code += `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${method}');\n`;
    code += `curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));\n`;
    code += `curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n\n`;
    code += `$response = curl_exec($ch);\n`;
    code += `curl_close($ch);\n\n`;
    code += `$data = json_decode($response, true);\n`;
    code += `print_r($data);`;
  } else {
    code += `$ch = curl_init();\n`;
    code += `curl_setopt($ch, CURLOPT_URL, $url);\n`;
    code += `curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);\n`;
    code += `curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n\n`;
    code += `$response = curl_exec($ch);\n`;
    code += `curl_close($ch);\n\n`;
    code += `$data = json_decode($response, true);\n`;
    code += `print_r($data);`;
  }
  
  return code;
}

function generateGo(url: string, method: string, params: any, apiKey: string): string {
  let code = `package main\n\n`;
  code += `import (\n`;
  code += `    "bytes"\n`;
  code += `    "encoding/json"\n`;
  code += `    "fmt"\n`;
  code += `    "net/http"\n`;
  code += `)\n\n`;
  
  code += `func main() {\n`;
  code += `    url := "${url}"\n`;
  code += `    apiKey := "${apiKey}"\n\n`;
  
  if (method !== 'GET' && Object.keys(params).length > 0) {
    code += `    data := map[string]interface{}{${JSON.stringify(params, null, 8).replace(/"/g, '`')}}\n`;
    code += `    jsonData, _ := json.Marshal(data)\n\n`;
    code += `    req, _ := http.NewRequest("${method}", url, bytes.NewBuffer(jsonData))\n`;
  } else {
    code += `    req, _ := http.NewRequest("${method}", url, nil)\n`;
  }
  
  code += `    req.Header.Set("Authorization", "Bearer " + apiKey)\n`;
  code += `    req.Header.Set("Content-Type", "application/json")\n\n`;
  code += `    client := &http.Client{}\n`;
  code += `    resp, _ := client.Do(req)\n`;
  code += `    defer resp.Body.Close()\n\n`;
  code += `    var result map[string]interface{}\n`;
  code += `    json.NewDecoder(resp.Body).Decode(&result)\n`;
  code += `    fmt.Println(result)\n`;
  code += `}`;
  
  return code;
}

function generateJava(url: string, method: string, params: any, apiKey: string): string {
  let code = `import java.net.http.HttpClient;\n`;
  code += `import java.net.http.HttpRequest;\n`;
  code += `import java.net.http.HttpResponse;\n`;
  code += `import java.net.URI;\n`;
  code += `import java.net.http.HttpRequest.BodyPublishers;\n`;
  code += `import com.fasterxml.jackson.databind.ObjectMapper;\n\n`;
  
  code += `public class ApiClient {\n`;
  code += `    public static void main(String[] args) throws Exception {\n`;
  code += `        String url = "${url}";\n`;
  code += `        String apiKey = "${apiKey}";\n\n`;
  
  code += `        HttpClient client = HttpClient.newHttpClient();\n`;
  code += `        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()\n`;
  code += `            .uri(URI.create(url))\n`;
  code += `            .header("Authorization", "Bearer " + apiKey)\n`;
  code += `            .header("Content-Type", "application/json");\n\n`;
  
  if (method !== 'GET' && Object.keys(params).length > 0) {
    code += `        ObjectMapper mapper = new ObjectMapper();\n`;
    code += `        String jsonData = mapper.writeValueAsString(${JSON.stringify(params, null, 8)});\n\n`;
    code += `        HttpRequest request = requestBuilder\n`;
    code += `            .${method.toLowerCase()}(BodyPublishers.ofString(jsonData))\n`;
    code += `            .build();\n`;
  } else {
    code += `        HttpRequest request = requestBuilder\n`;
    code += `            .${method.toLowerCase()}(BodyPublishers.noBody())\n`;
    code += `            .build();\n`;
  }
  
  code += `\n        HttpResponse<String> response = client.send(request,\n`;
  code += `            HttpResponse.BodyHandlers.ofString());\n\n`;
  code += `        System.out.println(response.body());\n`;
  code += `    }\n`;
  code += `}`;
  
  return code;
}

function generateCSharp(url: string, method: string, params: any, apiKey: string): string {
  let code = `using System;\n`;
  code += `using System.Net.Http;\n`;
  code += `using System.Text;\n`;
  code += `using System.Text.Json;\n`;
  code += `using System.Threading.Tasks;\n\n`;
  
  code += `class Program\n`;
  code += `{\n`;
  code += `    static async Task Main(string[] args)\n`;
  code += `    {\n`;
  code += `        string url = "${url}";\n`;
  code += `        string apiKey = "${apiKey}";\n\n`;
  
  code += `        using var client = new HttpClient();\n`;
  code += `        client.DefaultRequestHeaders.Add("Authorization", "Bearer " + apiKey);\n`;
  code += `        client.DefaultRequestHeaders.Add("Content-Type", "application/json");\n\n`;
  
  if (method !== 'GET' && Object.keys(params).length > 0) {
    code += `        var data = ${JSON.stringify(params, null, 8)};\n`;
    code += `        var json = JsonSerializer.Serialize(data);\n`;
    code += `        var content = new StringContent(json, Encoding.UTF8, "application/json");\n\n`;
    code += `        var response = await client.${method.toLowerCase()}Async(url, content);\n`;
  } else {
    code += `        var response = await client.${method.toLowerCase()}Async(url);\n`;
  }
  
  code += `\n        var result = await response.Content.ReadAsStringAsync();\n`;
  code += `        Console.WriteLine(result);\n`;
  code += `    }\n`;
  code += `}`;
  
  return code;
}