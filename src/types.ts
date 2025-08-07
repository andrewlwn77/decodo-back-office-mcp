import { z } from 'zod';

// Sub User schemas
export const SubUserSchema = z.object({
  id: z.string().optional(),
  username: z.string(),
  password: z.string().optional(),
  email: z.string().email().optional(),
  traffic_limit: z.number().optional(),
  expires_at: z.string().optional(),
});

export const SubUserUpdateSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  email: z.string().email().optional(),
  traffic_limit: z.number().optional(),
  expires_at: z.string().optional(),
});

// Whitelist IP schemas
export const WhitelistIPSchema = z.object({
  ip: z.string().ip(),
  description: z.string().optional(),
});

// Traffic schemas
export const TrafficQuerySchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  sub_user_id: z.string().optional(),
});

// Target info schemas
export const TargetInfoSchema = z.object({
  url: z.string().url(),
});

// Endpoint generation schemas
export const EndpointGenerationSchema = z.object({
  protocol: z.enum(['http', 'https']).optional(),
  format: z.enum(['json', 'xml']).optional(),
  custom_params: z.record(z.string()).optional(),
});

// Export types
export type SubUser = z.infer<typeof SubUserSchema>;
export type SubUserUpdate = z.infer<typeof SubUserUpdateSchema>;
export type WhitelistIP = z.infer<typeof WhitelistIPSchema>;
export type TrafficQuery = z.infer<typeof TrafficQuerySchema>;
export type TargetInfo = z.infer<typeof TargetInfoSchema>;
export type EndpointGeneration = z.infer<typeof EndpointGenerationSchema>;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}