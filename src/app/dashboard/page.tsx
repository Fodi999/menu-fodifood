'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { portfolioAPI, tokenStorage, userStorage, type Portfolio, type User } from '@/lib/backend-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, LogOut, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.get();
    const savedUser = userStorage.get();

    if (!token || !savedUser) {
      router.push('/auth/login');
      return;
    }

    setUser(savedUser);
    loadPortfolios(token);
  }, [router]);

  const loadPortfolios = async (token: string) => {
    try {
      const data = await portfolioAPI.getUserPortfolios(token);
      setPortfolios(data);
    } catch (error) {
      console.error('Failed to load portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    tokenStorage.remove();
    userStorage.remove();
    router.push('/');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені? Це видалить портфоліо назавжди.')) return;

    const token = tokenStorage.get();
    if (!token) return;

    try {
      await portfolioAPI.delete(token, id);
      setPortfolios(portfolios.filter(p => p.id !== id));
    } catch (error: any) {
      alert(error.message || 'Не вдалося видалити портфоліо');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Вітаємо, {user?.username}! ({user?.plan})
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Вийти
          </Button>
        </div>

        {/* Create New Portfolio */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard/create">
                <Plus className="w-4 h-4 mr-2" />
                Створити нове портфоліо
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Portfolios List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center py-12">
                <p className="text-gray-500 mb-4">
                  У вас поки немає портфоліо
                </p>
                <Button asChild>
                  <Link href="/dashboard/create">
                    Створити перше портфоліо
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            portfolios.map((portfolio) => (
              <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">@{portfolio.slug}</span>
                    {portfolio.is_public && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Публічне
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Тема: {portfolio.theme}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/@${portfolio.slug}`} target="_blank">
                        <Eye className="w-4 h-4 mr-2" />
                        Переглянути
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/dashboard/edit/${portfolio.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Редагувати
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(portfolio.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Створено: {portfolio.created_at ? new Date(portfolio.created_at).toLocaleDateString('uk-UA') : 'Невідомо'}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
