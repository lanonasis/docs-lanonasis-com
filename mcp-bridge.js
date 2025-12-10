#!/usr/bin/env node

const { stdin, stdout, stderr } = require('process');
const https = require('https');

// Buffer for incoming JSON-RPC messages
let inputBuffer = '';

// Handle incoming data from Claude Desktop
stdin.on('data', (chunk) => {
  inputBuffer += chunk.toString();

  // Process complete lines
  let newlineIndex;
  while ((newlineIndex = inputBuffer.indexOf('\n')) !== -1) {
    const line = inputBuffer.slice(0, newlineIndex);
    inputBuffer = inputBuffer.slice(newlineIndex + 1);

    if (line.trim()) {
      try {
        const request = JSON.parse(line);
        handleMCPRequest(request);
      } catch (error) {
        stderr.write(`Parse error: ${error.message}\n`);
      }
    }
  }
});

// Forward MCP requests to your HTTP endpoint
async function handleMCPRequest(request) {
  try {
    const postData = JSON.stringify(request);

    const options = {
      hostname: 'docs.lanonasis.com',
      path: '/api/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Server requires both JSON and SSE accept headers; keep order explicit
        'Accept': 'application/json, text/event-stream',
        'Cache-Control': 'no-cache',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk.toString();
      });

      res.on('end', () => {
        try {
          // If status is not OK, propagate a clearer error to the client
          if (res.statusCode && res.statusCode >= 400) {
            const errorResponse = {
              jsonrpc: '2.0',
              id: request.id || null,
              error: {
                code: -32603,
                message: `Upstream error ${res.statusCode}: ${res.statusMessage || 'Unknown error'}`,
                data: responseData || undefined
              }
            };
            stdout.write(JSON.stringify(errorResponse) + '\n');
            return;
          }

          // Try SSE first
          const lines = responseData.split('\n');
          const dataLine = lines.find(line => line.startsWith('data: '));

          if (dataLine) {
            const jsonData = dataLine.substring(6); // Remove "data: "
            const response = JSON.parse(jsonData);
            stdout.write(JSON.stringify(response) + '\n');
            return;
          }

          // Fallback: try to parse the whole body as JSON (non-SSE response)
          const parsed = JSON.parse(responseData);
          stdout.write(JSON.stringify(parsed) + '\n');
        } catch (error) {
          stderr.write(`Response parse error: ${error.message}\n`);

          // Send error response
          const errorResponse = {
            jsonrpc: '2.0',
            id: request.id || null,
            error: {
              code: -32603,
              message: 'Internal error processing response'
            }
          };
          stdout.write(JSON.stringify(errorResponse) + '\n');
        }
      });
    });

    req.on('error', (error) => {
      stderr.write(`Request error: ${error.message}\n`);

      // Send error response
      const errorResponse = {
        jsonrpc: '2.0',
        id: request.id || null,
        error: {
          code: -32603,
          message: `Network error: ${error.message}`
        }
      };
      stdout.write(JSON.stringify(errorResponse) + '\n');
    });

    // Send the request
    req.write(postData);
    req.end();

  } catch (error) {
    stderr.write(`Handler error: ${error.message}\n`);

    // Send error response
    const errorResponse = {
      jsonrpc: '2.0',
      id: request.id || null,
      error: {
        code: -32603,
        message: `Handler error: ${error.message}`
      }
    };
    stdout.write(JSON.stringify(errorResponse) + '\n');
  }
}

// Handle process cleanup
process.on('SIGINT', () => {
  stderr.write('MCP bridge shutting down...\n');
  process.exit(0);
});

process.on('SIGTERM', () => {
  stderr.write('MCP bridge shutting down...\n');
  process.exit(0);
});

stderr.write('LanOnasis MCP bridge started\n');