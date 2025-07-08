'use client';

import React from "react";
import { ThemeProvider } from 'next-themes';
import { I18nProvider } from '@/lib/i18n/i18n-context';
import { AuthProvider } from '@/contexts/auth-context';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};
