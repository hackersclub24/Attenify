'use client';

import { AuthProvider } from '../context/AuthContext';
import { MobileMenuProvider } from '../context/MobileMenuContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MobileMenuProvider>
        {children}
      </MobileMenuProvider>
    </AuthProvider>
  );
}
