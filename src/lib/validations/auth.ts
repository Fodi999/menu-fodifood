// 🔐 Auth validation schemas using Zod

import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
  password: z
    .string()
    .min(6, 'Пароль должен быть минимум 6 символов'),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно быть минимум 2 символа')
    .max(50, 'Имя должно быть максимум 50 символов'),
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный email'),
  password: z
    .string()
    .min(6, 'Пароль должен быть минимум 6 символов')
    .max(100, 'Пароль слишком длинный'),
  confirmPassword: z
    .string()
    .min(1, 'Подтвердите пароль'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
