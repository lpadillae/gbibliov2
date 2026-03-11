import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Library, Search, BarChart3, Settings, LogOut, AlertCircle } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { MobileMenu } from "@/components/dashboard/MobileMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">GBiblio</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link href="/library" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-medium">
            <Library className="w-5 h-5 text-slate-500" />
            My Library
          </Link>
          <Link href="/scanner" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-medium">
            <Search className="w-5 h-5 text-slate-500" />
            Scanner
          </Link>
          <Link href="/statistics" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-medium">
            <BarChart3 className="w-5 h-5 text-slate-500" />
            Statistics
          </Link>
          <Link href="/incidences" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-medium">
            <AlertCircle className="w-5 h-5 text-slate-500" />
            Incidences
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-medium">
            <Settings className="w-5 h-5 text-slate-500" />
            Settings
          </Link>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">GBiblio</span>
          </div>
          <MobileMenu />
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
