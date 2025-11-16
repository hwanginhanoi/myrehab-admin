'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Wand2, Save } from 'lucide-react';
import { QuillEditor } from '@/components/quill-editor';
import { createNews } from '@/api/api/newsManagementController/createNews';
import { CreateNewsRequest } from '@/api/types/CreateNewsRequest';
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
};

export default function CreateNewsPage() {
  const router = useRouter();
  const t = useTranslations('news');
  const tCommon = useTranslations('common');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewsFormData>({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      summary: '',
      thumbnailUrl: '',
      status: 'DRAFT',
      category: 'GENERAL',
    },
  });

  const title = watch('title');
  const status = watch('status');
  const category = watch('category');

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

      const requestData: CreateNewsRequest = {
        title: data.title,
        slug: data.slug,
        content: content,
        summary: data.summary || undefined,
        thumbnailUrl: data.thumbnailUrl || undefined,
        status: data.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
        category: data.category || undefined,
      };

      const response = await createNews(requestData);
      toast.success(tCommon('createSuccess'));
      router.push(`/dashboard/news/${response.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create news';
      toast.error(tCommon('error'), {
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Back Button */}
      <div className="m-9 mt-9 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
          className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          {tCommon('back')}
        </Button>
      </div>

      {/* Main Content */}
      <div className="m-9 mt-0 mb-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#EF7F26] mb-2">{t('createNews')}</h1>
              <p className="text-base text-[#71717A]">{t('createNewsDescription')}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  {t('articleTitle')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  placeholder={t('titlePlaceholder')}
                  disabled={submitting}
                  className="w-full"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    {t('slug')} <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSlug}
                    disabled={submitting}
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
                  disabled={submitting}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{t('slugInfo')}</p>
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor="summary" className="text-sm font-medium">{t('summary')}</Label>
                <Textarea
                  id="summary"
                  {...register('summary')}
                  placeholder={t('summaryPlaceholder')}
                  disabled={submitting}
                  rows={3}
                  className="w-full"
                />
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl" className="text-sm font-medium">{t('thumbnail')}</Label>
                <Input
                  id="thumbnailUrl"
                  {...register('thumbnailUrl')}
                  placeholder={t('thumbnailPlaceholder')}
                  type="url"
                  disabled={submitting}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">{t('category')}</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => setValue('category', value)}
                    disabled={submitting}
                  >
                    <SelectTrigger className="w-full">
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
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    {t('status')} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(value) => setValue('status', value)}
                    disabled={submitting}
                  >
                    <SelectTrigger className="w-full">
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
              </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t('content')} <span className="text-red-500">*</span>
              </Label>
              <QuillEditor
                value={content}
                onChange={setContent}
                placeholder={t('contentPlaceholder')}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#6DBAD6] text-white px-4 py-2 rounded-md flex items-center gap-2 shadow-sm hover:bg-[#6DBAD6]/90 w-28"
              >
                <Save className="w-5 h-5" />
                {submitting ? tCommon('creating') : tCommon('create')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
                className="border-[#6DBAD6] text-[#6DBAD6] hover:bg-[#6DBAD6] hover:text-white px-4 py-2 rounded-md"
              >
                {tCommon('cancel')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
