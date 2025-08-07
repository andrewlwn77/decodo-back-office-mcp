#!/usr/bin/env node

import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testMCPServer() {
  console.log('🔍 Testing MCP Server Functionality...\n');
  
  let serverProcess;
  
  try {
    // Start the MCP server
    console.log('🚀 Starting MCP server...');
    serverProcess = spawn('node', ['dist/index.js'], {
      cwd: '/workspace/proxy-projects/decodo-back-office-mcp',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Give server time to start
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create MCP client
    const transport = new StdioClientTransport({
      reader: serverProcess.stdout,
      writer: serverProcess.stdin
    });
    
    const client = new Client({
      name: 'test-client',
      version: '1.0.0'
    }, {
      capabilities: {}
    });
    
    console.log('🔗 Connecting to MCP server...');
    await client.connect(transport);
    
    console.log('✅ MCP connection established!');
    
    // Test 1: List available tools
    console.log('\n📋 Testing tool listing...');
    const toolsResponse = await client.request({
      method: 'tools/list'
    }, {});
    
    console.log(`✅ Found ${toolsResponse.tools.length} tools:`);
    toolsResponse.tools.forEach(tool => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });
    
    // Test 2: Test a simple tool call (get sub users)
    console.log('\n🛠️  Testing tool execution (decodo_get_sub_users)...');
    const toolResponse = await client.request({
      method: 'tools/call',
      params: {
        name: 'decodo_get_sub_users',
        arguments: {}
      }
    }, {});
    
    console.log('✅ Tool execution successful!');
    console.log('Response content:', toolResponse.content[0].text);
    
    // Test 3: Test tool with parameters (create sub user - this might fail but should show validation)
    console.log('\n🛠️  Testing tool with validation (decodo_create_sub_user with invalid data)...');
    try {
      await client.request({
        method: 'tools/call',
        params: {
          name: 'decodo_create_sub_user',
          arguments: {
            // Missing required username - should trigger validation error
          }
        }
      }, {});
    } catch (error) {
      console.log('✅ Validation working correctly - caught expected error');
      console.log('Error details:', error.message);
    }
    
    console.log('\n🎉 MCP Server validation PASSED!');
    return true;
    
  } catch (error) {
    console.error('\n❌ MCP Server validation FAILED:');
    console.error(error.message);
    return false;
    
  } finally {
    if (serverProcess) {
      console.log('\n🛑 Stopping MCP server...');
      serverProcess.kill('SIGTERM');
      
      // Give it time to shut down gracefully
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!serverProcess.killed) {
        serverProcess.kill('SIGKILL');
      }
    }
  }
}

// Run the test
testMCPServer()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });