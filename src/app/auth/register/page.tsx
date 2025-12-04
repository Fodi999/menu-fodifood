'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, tokenStorage, userStorage } from '@/lib/backend-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль повинен бути мінімум 6 символів');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(
        formData.email,
        formData.username,
        formData.password
      );

      // Save token and user
      tokenStorage.set(response.token);
      userStorage.set(response.user);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Створити акаунт</CardTitle>
          <CardDescription>
            Почніть будувати своє професійне резюме
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="chef@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="chefmario"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                minLength={3}
              />
              <p className="text-xs text-gray-500">
                Буде використовуватись у URL: /@{formData.username || 'username'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Підтвердити пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Реєстрація...' : 'Зареєструватись'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Вже маєте акаунт?{' '}
              <Link href="/auth/login" className="text-orange-600 hover:underline">
                Увійти
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
