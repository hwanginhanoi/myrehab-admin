'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Pin, Calendar } from 'lucide-react';
import { getNewsById } from '@/api/api/newsManagementController/getNewsById';
import { NewsResponse } from '@/api/types/NewsResponse';
import { toast } from 'sonner';
import { NEWS_CATEGORY_OPTIONS } from '@/constants/news';
import Image from 'next/image';

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const t = useTranslations('news');
  const tCommon = useTranslations('common');
  const [news, setNews] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsId, setNewsId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await Promise.resolve(params);
      setNewsId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!newsId) return;

    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getNewsById(parseInt(newsId));
        setNews(data);
      } catch {
        toast.error('Failed to load news');
        router.push('/dashboard/news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId, router]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p>{tCommon('loading')}</p>
      </div>
    );
  }

  if (!news) {
    return null;
  }

  const categoryOption = NEWS_CATEGORY_OPTIONS.find(opt => opt.value === news.category);
  const categoryLabel = categoryOption ? t(categoryOption.labelKey) : news.category;

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;

    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      DRAFT: 'secondary',
      PUBLISHED: 'default',
      ARCHIVED: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {t(`statuses.${status.toLowerCase()}`)}
      </Badge>
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {tCommon('back')}
          </Button>
          <Button
            className="bg-[#6DBAD6] text-white flex items-center gap-2"
            onClick={() => router.push(`/dashboard/news/${newsId}/edit`)}
          >
            <Edit className="w-4 h-4" />
            {t('editNews')}
          </Button>
        </div>

        {/* News Content */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {news.isPinned && (
                    <Pin className="w-5 h-5 text-orange-500" />
                  )}
                  {getStatusBadge(news.status)}
                  <Badge variant="outline">{categoryLabel}</Badge>
                </div>
                <CardTitle className="text-3xl mb-4">{news.title}</CardTitle>
                {news.summary && (
                  <p className="text-lg text-muted-foreground">{news.summary}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Thumbnail */}
            {news.thumbnailUrl && (
              <div className="mb-6">
                <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={news.thumbnailUrl}
                    alt={news.title || 'News thumbnail'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: news.content || '' }}
            />

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('slug')}</p>
                <p className="font-mono text-sm">{news.slug}</p>
              </div>
              {news.createdAt && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('createdAt')}</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <p>{new Date(news.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              )}
              {news.publishedAt && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('publishedAt')}</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <p>{new Date(news.publishedAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              )}
              {news.updatedAt && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('updatedAt')}</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <p>{new Date(news.updatedAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
