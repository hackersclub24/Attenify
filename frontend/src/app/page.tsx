import Link from "next/link";
import { LogIn, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 font-sans text-slate-900 sm:px-6 lg:px-8">
      <main className="flex w-full flex-col items-center justify-center text-center">
        <div className="mb-6 flex items-center justify-center rounded-full bg-blue-100 p-4 text-blue-600 sm:mb-8 sm:p-6">
          <GraduationCap size={48} className="sm:h-16 sm:w-16" />
        </div>
        
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Welcome to <span className="text-blue-600">Attenify</span>
        </h1>
        
        <p className="mb-8 max-w-2xl text-base text-slate-600 sm:mb-10 sm:text-lg md:text-xl">
          The seamless, modern academic attendance management system for admins, teachers, and students.
        </p>
        
        <Link 
          href="/login" 
          className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 sm:px-8 sm:py-4 sm:text-lg"
        >
          <LogIn size={20} />
          Go to Login
        </Link>
      </main>
    </div>
  );
}
