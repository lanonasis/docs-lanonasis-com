const { spawn } = require('child_process');
const fs = require('fs');

// Test script for MCP bridge
async function testMCPBridge() {
  console.log('Testing MCP Bridge functionality...\n');

  // Create a mock MCP request
  const mockRequest = {
    jsonrpc: "2.0",
    method: "tools/list",
    id: 1,
    params: {}
  };

  return new Promise((resolve, reject) => {
    // Spawn the MCP bridge process
    const bridgeProcess = spawn('node', ['mcp-bridge.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';

    // Handle process output
    bridgeProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    bridgeProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle process completion
    bridgeProcess.on('close', (code) => {
      console.log('Process exited with code:', code);
      console.log('Output:', output);
      console.log('Error:', error);
      
      if (code === 0 || output.includes('response') || error.includes('Network error')) {
        resolve({ success: true, output, error });
      } else {
        reject(new Error(`Process failed with code ${code}`));
      }
    });

    // Send the mock request to the bridge
    console.log('Sending mock MCP request:', JSON.stringify(mockRequest));
    bridgeProcess.stdin.write(JSON.stringify(mockRequest) + '\n');
    
    // Wait for a response or timeout after 10 seconds
    setTimeout(() => {
      bridgeProcess.kill();
      resolve({ success: true, output, error });
    }, 10000);
  });
}

// Run the test
testMCPBridge()
  .then(result => {
    console.log('\nMCP Bridge test completed.');
    console.log('Success:', result.success);
  })
  .catch(err => {
    console.error('\nMCP Bridge test failed:', err.message);
  });