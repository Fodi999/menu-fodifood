'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BlogPost, CreateBlogPostDTO } from '@/types/blog';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-a4yb.shuttle.app';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('portfolio_token');
    setIsAuthenticated(!!token);
    
    if (token) {
      loadPosts();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem('portfolio_token');
      const res = await fetch(`${API_URL}/api/blog`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to load posts');
      }

      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Ошибка загрузки статей');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту статью?')) return;

    try {
      const token = localStorage.getItem('portfolio_token');
      const res = await fetch(`${API_URL}/api/blog/id/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete post');
      }

      toast.success('Статья удалена');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Ошибка удаления');
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const token = localStorage.getItem('portfolio_token');
      const res = await fetch(`${API_URL}/api/blog/id/${post.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !post.isPublished,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update post');
      }

      toast.success(post.isPublished ? 'Снято с публикации' : 'Опубликовано');
      loadPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Ошибка обновления');
    }
  };

  const handleCreateNew = async () => {
    try {
      const token = localStorage.getItem('portfolio_token');
      const newPost: CreateBlogPostDTO = {
        title: 'Новая статья',
        excerpt: 'Краткое описание статьи...',
        content: '<p>Начните писать вашу статью здесь...</p>',
        isPublished: false,
      };

      const res = await fetch(`${API_URL}/api/blog`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) {
        throw new Error('Failed to create post');
      }

      const created = await res.json();
      toast.success('Статья создана');
      
      // Redirect to edit page
      window.location.href = `/blog/${created.slug}`;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Ошибка создания статьи');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p className="text-muted-foreground mb-6">
            Войдите в систему для управления блогом
          </p>
          <Link href="/auth/signin">
            <Button>Войти</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Управление блогом</h1>
            <p className="text-muted-foreground">
              Всего статей: {posts.length} | Опубликовано: {posts.filter(p => p.isPublished).length}
            </p>
          </div>
          <Button onClick={handleCreateNew} size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Новая статья
          </Button>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
            <p className="text-xl text-muted-foreground mb-4">Статей пока нет</p>
            <Button onClick={handleCreateNew} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Создать первую статью
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-card rounded-xl border border-border/50 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Cover Image */}
                  <div className="relative w-40 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl">📝</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1 truncate">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="ml-4">
                        {post.isPublished ? (
                          <span className="px-3 py-1 text-xs font-semibold bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                            Опубликовано
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20">
                            Черновик
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.publishedAt).toLocaleDateString('ru-RU')}
                      </div>
                      {post.readingTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readingTime} мин
                        </div>
                      )}
                      {post.viewCount !== undefined && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.viewCount} просмотров
                        </div>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-primary/10 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="w-4 h-4" />
                          Редактировать
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublish(post)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {post.isPublished ? 'Снять с публикации' : 'Опубликовать'}
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="gap-2 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
