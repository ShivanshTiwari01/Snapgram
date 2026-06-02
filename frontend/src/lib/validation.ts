import { z } from 'zod';

// Auth Schemas
export const SignUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(2, 'Username must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Post Schemas
export const CreatePostSchema = z.object({
  caption: z
    .string()
    .min(1, 'Caption is required')
    .max(2200, 'Caption must be less than 2200 characters'),
  file: z.any().optional(),
  location: z.string().optional(),
  tags: z.string().optional(),
});

export const UpdatePostSchema = z.object({
  caption: z
    .string()
    .min(1, 'Caption is required')
    .max(2200, 'Caption must be less than 2200 characters'),
  file: z.any().optional(),
  location: z.string().optional(),
  tags: z.string().optional(),
});

// User Schemas
export const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
  file: z.any().optional(),
});

// Type exports
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type CreatePostSchemaType = z.infer<typeof CreatePostSchema>;
export type UpdatePostSchemaType = z.infer<typeof UpdatePostSchema>;
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
