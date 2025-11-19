'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { TiptapEditor } from '@/components/tiptap-editor';
import { getNewsById } from '@/api/api/newsManagementController/getNewsById';
import { updateNews } from '@/api/api/newsManagementController/updateNews';
import { UpdateNewsRequest } from '@/api/types/UpdateNewsRequest';
import { toast } from 'sonner';
import { NEWS_CATEGORY_OPTIONS, NEWS_STATUS_OPTIONS } from '@/constants/news';

type NewsFormData = {
  title: string;
  content: string;
  summary: string;
  thumbnailUrl: string;
  status: string;
  category: string;
};

export default function EditNewsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const t = useTranslations('news');
  const tCommon = useTranslations('common');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newsId, setNewsId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewsFormData>();

  const status = watch('status');
  const category = watch('category');

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

        setValue('title', data.title || '');
        setValue('summary', data.summary || '');
        setValue('thumbnailUrl', data.thumbnailUrl || '');
        setValue('status', data.status || 'DRAFT');
        setValue('category', data.category || 'GENERAL');
        setContent(data.content || '');
      } catch {
        toast.error('Failed to load news');
        router.push('/dashboard/news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId, router, setValue]);

  const onSubmit = async (data: NewsFormData) => {
    if (!content || content === '<p><br></p>') {
      toast.error('Content is required');
      return;
    }

    try {
      setSubmitting(true);

      const requestData: UpdateNewsRequest = {
        title: data.title,
        content: content,
        summary: data.summary || undefined,
        thumbnailUrl: data.thumbnailUrl || undefined,
        status: data.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
        category: data.category || undefined,
      };

      await updateNews(parseInt(newsId!), requestData);

      toast.success(tCommon('updateSuccess'));
      router.push(`/dashboard/news/${newsId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update news';
      toast.error(tCommon('error'), {
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p>{tCommon('loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="m-9 mt-9 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              {tCommon('back')}
            </Button>
            <h1 className="text-4xl font-bold text-[#EF7F26]">{t('editNews')}</h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('basicInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="title">
                    {t('articleTitle')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    placeholder={t('titlePlaceholder')}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Summary */}
                <div>
                  <Label htmlFor="summary">{t('summary')}</Label>
                  <Textarea
                    id="summary"
                    {...register('summary')}
                    placeholder={t('summaryPlaceholder')}
                    rows={3}
                  />
                </div>

                {/* Thumbnail URL */}
                <div>
                  <Label htmlFor="thumbnailUrl">{t('thumbnail')}</Label>
                  <Input
                    id="thumbnailUrl"
                    {...register('thumbnailUrl')}
                    placeholder={t('thumbnailPlaceholder')}
                    type="url"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">{t('category')}</Label>
                  <Select value={category} onValueChange={(value) => setValue('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NEWS_CATEGORY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div>
                  <Label htmlFor="status">
                    {t('status')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={status} onValueChange={(value) => setValue('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NEWS_STATUS_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t('content')} <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TiptapEditor
                  value={content}
                  onChange={setContent}
                  placeholder={t('contentPlaceholder')}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                {tCommon('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#6DBAD6] text-white hover:bg-[#6DBAD6]/90"
              >
                {submitting ? 'Saving...' : tCommon('save')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
