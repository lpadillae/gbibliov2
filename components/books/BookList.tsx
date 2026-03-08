"use client";

import { useState } from "react";
import { Book } from "@prisma/client";
import { Search } from "lucide-react";
import { BookCard } from "./BookCard";

interface BookListProps {
  initialBooks: Book[];
}

export function BookList({ initialBooks }: BookListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");

  const filteredBooks = initialBooks.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(search.toLowerCase()) || 
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      (book.isbn && book.isbn.includes(search));
      
    const matchesFilter = filter === "ALL" || book.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {["ALL", "POR_LEER", "LEYENDO", "LEIDO", "ABANDONADO"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                filter === status 
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {status === "ALL" ? "All Books" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No books found</h3>
          <p className="text-slate-500 dark:text-slate-400">
            {search || filter !== "ALL" ? "Try adjusting your search or filters." : "Your library is empty. Scan a book to get started!"}
          </p>
        </div>
      )}
    </div>
  );
}
