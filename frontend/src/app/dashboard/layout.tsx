import { Sidebar } from '../../components/Sidebar';
import { MobileMenuToggle } from '../../components/MobileMenuToggle';
import ProtectedRoute from '../../components/ProtectedRoute';
import { ThemeToggle } from '../../components/ThemeToggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
        <Sidebar />
        <main className="w-full overflow-y-auto">
          <div className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200 bg-white bg-opacity-95 px-4 py-4 shadow-sm backdrop-blur md:hidden dark:border-slate-700 dark:bg-slate-950/95">
            <MobileMenuToggle />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">Attenify Dashboard</h1>
              <ThemeToggle />
            </div>
          </div>
          <div className="responsive-padding">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
