import {
  SubUserSchema,
  SubUserUpdateSchema,
  WhitelistIPSchema,
  TrafficQuerySchema,
  TargetInfoSchema,
  EndpointGenerationSchema,
} from '../types.js';

describe('Type Validation Schemas', () => {
  describe('SubUserSchema', () => {
    test('should accept valid sub-user data', () => {
      const validSubUser = {
        username: 'testuser',
        password: 'testpass',
        email: 'test@example.com',
        traffic_limit: 1000000,
        expires_at: '2024-12-31T23:59:59Z',
      };

      const result = SubUserSchema.parse(validSubUser);
      expect(result).toEqual(validSubUser);
    });

    test('should require username', () => {
      const invalidSubUser = {
        password: 'testpass',
      };

      expect(() => SubUserSchema.parse(invalidSubUser)).toThrow();
    });

    test('should validate email format', () => {
      const invalidEmailSubUser = {
        username: 'testuser',
        email: 'not-an-email',
      };

      expect(() => SubUserSchema.parse(invalidEmailSubUser)).toThrow();
    });

    test('should accept minimal valid data', () => {
      const minimalSubUser = {
        username: 'testuser',
      };

      const result = SubUserSchema.parse(minimalSubUser);
      expect(result.username).toBe('testuser');
    });
  });

  describe('SubUserUpdateSchema', () => {
    test('should accept partial updates', () => {
      const partialUpdate = {
        username: 'newusername',
        traffic_limit: 2000000,
      };

      const result = SubUserUpdateSchema.parse(partialUpdate);
      expect(result).toEqual(partialUpdate);
    });

    test('should accept empty updates', () => {
      const emptyUpdate = {};

      const result = SubUserUpdateSchema.parse(emptyUpdate);
      expect(result).toEqual({});
    });

    test('should validate email format in updates', () => {
      const invalidEmailUpdate = {
        email: 'not-an-email',
      };

      expect(() => SubUserUpdateSchema.parse(invalidEmailUpdate)).toThrow();
    });
  });

  describe('WhitelistIPSchema', () => {
    test('should accept valid IPv4 address', () => {
      const validIP = {
        ip: '192.168.1.1',
        description: 'Test server',
      };

      const result = WhitelistIPSchema.parse(validIP);
      expect(result).toEqual(validIP);
    });

    test('should accept valid IPv6 address', () => {
      const validIPv6 = {
        ip: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        description: 'IPv6 server',
      };

      const result = WhitelistIPSchema.parse(validIPv6);
      expect(result).toEqual(validIPv6);
    });

    test('should require IP address', () => {
      const noIP = {
        description: 'No IP provided',
      };

      expect(() => WhitelistIPSchema.parse(noIP)).toThrow();
    });

    test('should reject invalid IP format', () => {
      const invalidIP = {
        ip: 'not-an-ip',
      };

      expect(() => WhitelistIPSchema.parse(invalidIP)).toThrow();
    });

    test('should accept IP without description', () => {
      const ipOnly = {
        ip: '10.0.0.1',
      };

      const result = WhitelistIPSchema.parse(ipOnly);
      expect(result.ip).toBe('10.0.0.1');
    });
  });

  describe('TrafficQuerySchema', () => {
    test('should accept valid traffic query', () => {
      const validQuery = {
        start_date: '2024-01-01T00:00:00Z',
        end_date: '2024-01-31T23:59:59Z',
        sub_user_id: 'user123',
      };

      const result = TrafficQuerySchema.parse(validQuery);
      expect(result).toEqual(validQuery);
    });

    test('should accept empty query', () => {
      const emptyQuery = {};

      const result = TrafficQuerySchema.parse(emptyQuery);
      expect(result).toEqual({});
    });

    test('should accept partial query parameters', () => {
      const partialQuery = {
        start_date: '2024-01-01T00:00:00Z',
      };

      const result = TrafficQuerySchema.parse(partialQuery);
      expect(result).toEqual(partialQuery);
    });
  });

  describe('TargetInfoSchema', () => {
    test('should accept valid URL', () => {
      const validTarget = {
        url: 'https://example.com/api/endpoint',
      };

      const result = TargetInfoSchema.parse(validTarget);
      expect(result).toEqual(validTarget);
    });

    test('should accept HTTP URLs', () => {
      const httpTarget = {
        url: 'http://example.com',
      };

      const result = TargetInfoSchema.parse(httpTarget);
      expect(result).toEqual(httpTarget);
    });

    test('should require URL', () => {
      const noURL = {};

      expect(() => TargetInfoSchema.parse(noURL)).toThrow();
    });

    test('should reject invalid URL format', () => {
      const invalidURL = {
        url: 'not-a-url',
      };

      expect(() => TargetInfoSchema.parse(invalidURL)).toThrow();
    });
  });

  describe('EndpointGenerationSchema', () => {
    test('should accept valid endpoint config', () => {
      const validConfig = {
        protocol: 'https' as const,
        format: 'json' as const,
        custom_params: {
          timeout: '30',
          retries: '3',
        },
      };

      const result = EndpointGenerationSchema.parse(validConfig);
      expect(result).toEqual(validConfig);
    });

    test('should accept empty config', () => {
      const emptyConfig = {};

      const result = EndpointGenerationSchema.parse(emptyConfig);
      expect(result).toEqual({});
    });

    test('should validate protocol enum', () => {
      const invalidProtocol = {
        protocol: 'ftp',
      };

      expect(() => EndpointGenerationSchema.parse(invalidProtocol)).toThrow();
    });

    test('should validate format enum', () => {
      const invalidFormat = {
        format: 'yaml',
      };

      expect(() => EndpointGenerationSchema.parse(invalidFormat)).toThrow();
    });

    test('should accept valid protocols and formats', () => {
      const httpJson = {
        protocol: 'http' as const,
        format: 'xml' as const,
      };

      const result = EndpointGenerationSchema.parse(httpJson);
      expect(result.protocol).toBe('http');
      expect(result.format).toBe('xml');
    });
  });
});