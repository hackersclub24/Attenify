import Link from "next/link";
import { LogIn, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 font-sans text-slate-900">
      <main className="flex w-full flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 flex items-center justify-center rounded-full bg-blue-100 p-6 text-blue-600">
          <GraduationCap size={64} />
        </div>
        
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Welcome to <span className="text-blue-600">Attenify</span>
        </h1>
        
        <p className="mb-10 max-w-lg text-lg text-slate-600 sm:text-xl">
          The seamless, modern academic attendance management system for admins, teachers, and students.
        </p>
        
        <Link 
          href="/login" 
          className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <LogIn size={20} />
          Go to Login
        </Link>
      </main>
    </div>
  );
}
