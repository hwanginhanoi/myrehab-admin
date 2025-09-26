'use client';

import React from "react";
import { I18nProvider } from '@/lib/i18n/i18n-context';
import { AuthProvider } from '@/contexts/auth-context';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <I18nProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </I18nProvider>
  );
};
