import * as z from 'zod';

const emailSchema = z
  .string()
  .min(1, { message: "IDENTIFIER REQUIRED" })
  .email({ message: "INVALID EMAIL PROTOCOL" });

const passwordSchema = z
  .string()
  .min(8, { message: "MINIMUM 8 CHARACTERS REQUIRED" })
  .max(32, { message: "MAXIMUM 32 CHARACTERS EXCEEDED" })
  .regex(/[A-Z]/, { message: "NEED AT LEAST ONE UPPERCASE LETTER" })
  .regex(/[a-z]/, { message: "NEED AT LEAST ONE LOWERCASE LETTER" })
  .regex(/[0-9]/, { message: "NEED AT LEAST ONE NUMBER" });

const nicknameSchema = z
  .string()
  .min(3, { message: "NICKNAME TOO SHORT (MIN 3)" })
  .max(20, { message: "NICKNAME TOO LONG (MAX 20)" })
  .regex(/^[a-zA-Z0-9_]+$/, { message: "ONLY ALPHANUMERIC AND UNDERSCORES" });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "PASSWORD REQUIRED" }),
});

export const registerSchema = z.object({
  email: emailSchema,
  nickname: nicknameSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  code: z
    .string()
    .length(6, { message: "CODE MUST BE EXACTLY 6 DIGITS" })
    .regex(/^\d+$/, { message: "ONLY NUMBERS ALLOWED" }),
  newPassword: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;