"use client";

import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Calendar, User, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/EditableText";
import { EditableImage } from "@/components/EditableImage";
import { blogAPI, type BlogPost } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadPost();
    // Check if user is authenticated for edit mode
    if (typeof window !== 'undefined') {
      setIsEditMode(localStorage.getItem('portfolio_token') !== null);
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await blogAPI.getBySlug(slug);
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blog post');
      toast.error('Ошибка загрузки', {
        description: 'Не удалось загрузить статью'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePost = async (field: string, value: string) => {
    if (!post) return;
    
    try {
      const updatedPost = await blogAPI.update(post.id, { [field]: value });
      setPost(updatedPost);
      toast.success('Сохранено');
    } catch (err) {
      toast.error('Ошибка', {
        description: err instanceof Error ? err.message : 'Не удалось обновить статью'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Статья не найдена'}</p>
          <Link href="/#blog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к блогу
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/#blog">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Назад к блогу
            </Button>
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Category Badge */}
        <div className="mb-6">
          <span className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full">
            {isEditMode ? (
              <EditableText
                value={post.category}
                onSave={(value: string) => handleUpdatePost("category", value)}
                className="bg-transparent"
              />
            ) : (
              post.category
            )}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {isEditMode ? (
            <EditableText
              value={post.title}
              onSave={(value: string) => handleUpdatePost("title", value)}
              className="text-4xl md:text-5xl font-bold"
            />
          ) : (
            post.title
          )}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>
              {isEditMode ? (
                <EditableText
                  value={post.author}
                  onSave={(value: string) => handleUpdatePost("author", value)}
                  className="text-sm text-muted-foreground"
                />
              ) : (
                post.author
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {isEditMode ? (
                <EditableText
                  value={post.date}
                  onSave={(value: string) => handleUpdatePost("date", value)}
                  className="text-sm text-muted-foreground"
                />
              ) : (
                new Date(post.date).toLocaleDateString('pl-PL')
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {isEditMode ? (
                <EditableText
                  value={post.readTime}
                  onSave={(value: string) => handleUpdatePost("readTime", value)}
                  className="text-sm text-muted-foreground"
                />
              ) : (
                post.readTime
              )}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-12">
          {isEditMode ? (
            <EditableImage
              src={post.image}
              alt={post.title}
              onSave={(url: string) => handleUpdatePost("image", url)}
              className="w-full h-full object-cover"
              variant="portfolio"
            />
          ) : (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {isEditMode ? (
            <textarea
              value={post.content}
              onChange={(e) => handleUpdatePost("content", e.target.value)}
              className="w-full min-h-[500px] p-4 border rounded-lg font-mono text-sm"
              placeholder="Содержание статьи (поддерживает Markdown)..."
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: post.content
                  .split('\n')
                  .map(line => {
                    // Заголовки
                    if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
                    if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
                    if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
                    // Списки
                    if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
                    // Жирный текст
                    if (line.includes('**')) {
                      return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
                    }
                    // Обычный параграф
                    if (line.trim()) return `<p>${line}</p>`;
                    return '';
                  })
                  .join('')
              }}
            />
          )}
        </div>

        {/* Back Button */}
        <div className="mt-12 pt-8 border-t">
          <Link href="/#blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Все статьи
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
