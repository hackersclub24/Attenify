import { Sidebar } from '../../components/Sidebar';
import { MobileMenuToggle } from '../../components/MobileMenuToggle';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <Sidebar />
        <main className="w-full overflow-y-auto">
          <div className="flex items-center border-b border-slate-200 bg-white px-4 py-4 md:hidden">
            <MobileMenuToggle />
            <h1 className="text-lg font-semibold text-slate-900">Attenify Dashboard</h1>
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
