'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { staffLogin } from '@/api/api/authenticationController';
import { useAuth } from '@/contexts/auth-context';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Địa chỉ email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentProps<"form">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await staffLogin({
        email: data.email,
        password: data.password
      });
      
      if (response.token) {
        if (response.role !== 'ADMIN' && response.role !== 'DOCTOR') {
          setError('You do not have permission to access this application.');
          return;
        }

        // Create user data from API response
        const userData = {
          id: response.email || data.email, // Use email as ID since backend doesn't provide user ID
          email: response.email || data.email,
          role: response.role,
          fullName: response.fullName,
        };

        authLogin(response.token, userData);

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Invalid email or password'
        : 'An error occurred during login';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-4 w-full", className)} onSubmit={form.handleSubmit(onSubmit)} {...props}>
      <div className="flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5 w-full">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm text-[#71717A] hover:underline"
            >
              Quên mật khẩu
            </a>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Login Button */}
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </Button>
      </div>
    </form>
  )
}
