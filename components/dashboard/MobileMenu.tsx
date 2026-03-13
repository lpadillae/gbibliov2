"use client";

import { useState } from "react";
import { Menu, X, BookOpen, Library, Search, BarChart3, AlertCircle, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);
  const close = () => setOpen(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={toggle}
        className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay menu */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
        />
      )}

      {/* Sliding panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-transform duration-300 z-50 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">GBiblio</span>
          </div>
          <button onClick={toggle} className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          <Link href="/library" onClick={close} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-medium">
            <Library className="w-5 h-5 text-slate-500" />
            My Library
          </Link>
          <Link href="/scanner" onClick={close} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-medium">
            <Search className="w-5 h-5 text-slate-500" />
            Scanner
          </Link>
          <Link href="/statistics" onClick={close} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-medium">
            <BarChart3 className="w-5 h-5 text-slate-500" />
            Statistics
          </Link>
          <Link href="/incidences" onClick={close} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-medium">
            <AlertCircle className="w-5 h-5 text-slate-500" />
            Incidences
          </Link>
          <Link href="/settings" onClick={close} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-medium">
            <Settings className="w-5 h-5 text-slate-500" />
            Settings
          </Link>
        </nav>
      </div>
    </>
  );
}
