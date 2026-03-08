import Link from "next/link";
import { BookOpen, Library, Search, BarChart3 } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();
  
  if (session) {
    redirect("/library");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">GBiblio</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl mb-6">
          Your personal <span className="text-blue-600">library</span>, beautifully organized.
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-10">
          Scan ISBNs, track your reading progress, and build your digital bookshelf with a premium, lightning-fast experience.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
            Start Your Library
          </Link>
          <Link href="/login" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-medium text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Sign In
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full text-left">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <Search className="text-blue-600 dark:text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Scanner</h3>
            <p className="text-slate-500 dark:text-slate-400">Scan barcodes with your camera to instantly fetch book metadata from multiple sources.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-4">
              <Library className="text-teal-600 dark:text-teal-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-slate-500 dark:text-slate-400">Organize books by status: To Read, Reading, Read, or Abandoned. Keep your collection tidy.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="text-purple-600 dark:text-purple-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reading Insights</h3>
            <p className="text-slate-500 dark:text-slate-400">Visualize your reading habits with beautiful charts and statistics over time.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
