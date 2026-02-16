import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  nickname: z
    .string()
    .min(3, 'Nickname must be at least 3 characters')
    .max(30, 'Nickname is too long'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const otpSchema = z.object({
  identifier: z.string().min(1, 'Please enter email or phone number'),
  code: z.string().length(6, 'Code must be exactly 6 digits'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;