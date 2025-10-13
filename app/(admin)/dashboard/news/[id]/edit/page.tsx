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
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { QuillEditor } from '@/components/quill-editor';
import { getNewsById } from '@/api/api/newsManagementController/getNewsById';
import { updateNews } from '@/api/api/newsManagementController/updateNews';
import { UpdateNewsRequest } from '@/api/types/UpdateNewsRequest';
import { toast } from 'sonner';
import { NEWS_CATEGORY_OPTIONS, NEWS_STATUS_OPTIONS } from '@/constants/news';

type NewsFormData = {
  title: string;
  slug: string;
  content: string;
  summary: string;
  thumbnailUrl: string;
  status: string;
  category: string;
  isPinned: boolean;
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

  const title = watch('title');
  const status = watch('status');
  const category = watch('category');
  const isPinned = watch('isPinned');

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
        setValue('slug', data.slug || '');
        setValue('summary', data.summary || '');
        setValue('thumbnailUrl', data.thumbnailUrl || '');
        setValue('status', data.status || 'DRAFT');
        setValue('category', data.category || 'GENERAL');
        setValue('isPinned', data.isPinned || false);
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

  const generateSlug = () => {
    if (!title) {
      toast.error('Please enter a title first');
      return;
    }

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    setValue('slug', slug);
  };

  const onSubmit = async (data: NewsFormData) => {
    if (!content || content === '<p><br></p>') {
      toast.error('Content is required');
      return;
    }

    try {
      setSubmitting(true);

      const requestData: UpdateNewsRequest = {
        title: data.title,
        slug: data.slug,
        content: content,
        summary: data.summary || undefined,
        thumbnailUrl: data.thumbnailUrl || undefined,
        status: data.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
        category: data.category || undefined,
        isPinned: data.isPinned || undefined,
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

                {/* Slug */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="slug">
                      {t('slug')} <span className="text-red-500">*</span>
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSlug}
                      className="flex items-center gap-2"
                    >
                      <Wand2 className="w-4 h-4" />
                      {t('autoGenerateSlug')}
                    </Button>
                  </div>
                  <Input
                    id="slug"
                    {...register('slug', { required: 'Slug is required' })}
                    placeholder={t('slugPlaceholder')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t('slugInfo')}</p>
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
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

                {/* Pin Status */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPinned"
                    checked={isPinned}
                    onCheckedChange={(checked) => setValue('isPinned', checked as boolean)}
                  />
                  <Label htmlFor="isPinned" className="cursor-pointer">
                    {t('pinNews')}
                  </Label>
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
                <QuillEditor
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
