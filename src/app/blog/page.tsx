import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | FodiFood',
  description: 'Статьи о кулинарии, рецепты, советы по ресторанному бизнесу и гастрономические новости',
  openGraph: {
    title: 'Blog | FodiFood',
    description: 'Статьи о кулинарии, рецепты, советы по ресторанному бизнесу и гастрономические новости',
    type: 'website',
  },
};

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-a4yb.shuttle.app';
    const res = await fetch(`${apiUrl}/api/blog`, {
      cache: 'no-store', // Always fetch fresh data for blog
    });
    
    if (!res.ok) {
      console.error('Failed to fetch blog posts:', res.status);
      return [];
    }
    
    const data = await res.json();
    
    // Map backend fields to frontend BlogPost interface
    return data.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.image, // map image -> coverImage
      authorName: post.author, // map author -> authorName
      authorImage: post.author_image,
      publishedAt: post.date || post.created_at, // map date -> publishedAt
      updatedAt: post.updated_at,
      tags: post.tags || [],
      metaTitle: post.meta_title,
      metaDescription: post.meta_description,
      metaKeywords: post.meta_keywords,
      isPublished: post.is_published !== undefined ? post.is_published : true,
      viewCount: post.view_count || 0,
      readingTime: post.reading_time || parseInt(post.read_time) || 5, // map read_time -> readingTime
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Блог FodiFood
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Вдохновляющие статьи о кулинарии, рецепты от шеф-поваров и секреты успешного ресторанного бизнеса
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">Статьи скоро появятся...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="h-full bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50">
                    {/* Cover Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-muted">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="text-4xl">📝</span>
                        </div>
                      )}
                      
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                          {post.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-xs font-semibold bg-background/95 backdrop-blur-sm rounded-full border border-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                        
                        {post.readingTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readingTime} мин</span>
                          </div>
                        )}
                      </div>

                      {/* Author */}
                      {post.authorName && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                          {post.authorImage ? (
                            <Image
                              src={post.authorImage}
                              alt={post.authorName}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                              {post.authorName[0]}
                            </div>
                          )}
                          <span className="text-sm font-medium">{post.authorName}</span>
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
