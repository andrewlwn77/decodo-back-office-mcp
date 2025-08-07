#!/usr/bin/env node

import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config();

async function testDecodoAPIConnectivity() {
  console.log('🔍 Testing Decodo API Connectivity...\n');
  
  const apiKey = process.env.DECODO_API_KEY;
  const baseURL = process.env.DECODO_BASE_URL || 'https://api.decodo.com';
  
  if (!apiKey) {
    console.error('❌ DECODO_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  console.log('📋 Configuration:');
  console.log(`   Base URL: ${baseURL}`);
  console.log(`   API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log('');
  
  const client = axios.create({
    baseURL,
    headers: {
      'Authorization': apiKey,  // Decodo uses direct API key, not Bearer token
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });
  
  // Test basic connectivity with sub-users endpoint (from documentation)
  try {
    console.log('🌐 Testing basic connectivity...');
    const response = await client.get('/sub-users');
    
    console.log('✅ API Connection Successful!');
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
    
    return true;
  } catch (error) {
    console.log('❌ API Connection Failed:');
    
    if (error.response) {
      console.log(`   HTTP Status: ${error.response.status}`);
      console.log(`   Error Data: ${JSON.stringify(error.response.data, null, 2)}`);
      
      if (error.response.status === 401) {
        console.log('\n💡 Suggestion: Check if your API key is valid and has proper permissions');
      } else if (error.response.status === 404) {
        console.log('\n💡 Suggestion: The /api/subscriptions endpoint might not exist. This could be expected.');
        console.log('   Let\'s try a different endpoint...');
        
        // Try a different endpoint
        try {
          console.log('\n🌐 Testing alternative endpoint...');
          const altResponse = await client.get('/subscriptions');
          console.log('✅ Alternative endpoint successful!');
          console.log(`   Status: ${altResponse.status} ${altResponse.statusText}`);
          return true;
        } catch (altError) {
          console.log('❌ Alternative endpoint also failed');
          if (altError.response) {
            console.log(`   Status: ${altError.response.status}`);
            console.log(`   Data: ${JSON.stringify(altError.response.data, null, 2)}`);
          }
        }
      }
    } else if (error.request) {
      console.log('   Network Error: No response received');
      console.log('   Check internet connection and API URL');
    } else {
      console.log(`   Request Error: ${error.message}`);
    }
    
    return false;
  }
}

// Run the test
testDecodoAPIConnectivity()
  .then((success) => {
    if (success) {
      console.log('\n🎉 API connectivity validation PASSED');
      process.exit(0);
    } else {
      console.log('\n❌ API connectivity validation FAILED');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });