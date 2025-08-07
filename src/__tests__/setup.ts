import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment defaults
process.env.DECODO_API_KEY = process.env.DECODO_API_KEY || 'test-api-key';
process.env.DECODO_BASE_URL = process.env.DECODO_BASE_URL || 'https://api.test.decodo.com';
process.env.LOG_LEVEL = 'error'; // Reduce noise in tests

// Mock console methods to reduce test output noise
const originalConsole = { ...console };

beforeEach(() => {
  // Reset console mocks before each test
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  console.error = originalConsole.error; // Keep errors visible
});

afterEach(() => {
  // Restore console after each test
  Object.assign(console, originalConsole);
});

// Global test timeout
jest.setTimeout(10000);