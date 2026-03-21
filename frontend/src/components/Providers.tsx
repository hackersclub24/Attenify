'use client';

import { AuthProvider } from '../context/AuthContext';
import { MobileMenuProvider } from '../context/MobileMenuContext';
import { ThemeProvider } from '../context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MobileMenuProvider>
          {children}
        </MobileMenuProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
