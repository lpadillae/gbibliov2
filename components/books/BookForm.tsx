"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen } from "lucide-react";

interface BookFormProps {
  initialIsbn?: string;
  incidenceId?: string;
  initialData?: {
    id: string;
    title: string;
    author: string;
    isbn: string | null;
    coverUrl: string | null;
    description: string | null;
    pageCount: number | null;
  };
}

export function BookForm({ initialIsbn, incidenceId, initialData }: BookFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    author: initialData?.author || "",
    isbn: initialData?.isbn || initialIsbn || "",
    coverUrl: initialData?.coverUrl || "",
    description: initialData?.description || "",
    pageCount: initialData?.pageCount?.toString() || "",
  });
  const [fetching, setFetching] = useState(false);

  const fetchMetadata = async (isbn: string) => {
    if (!isbn || isbn.length < 10) return;
    setFetching(true);
    setError(null);
    try {
      const res = await fetch(`/api/metadata?isbn=${isbn}`);
      if (!res.ok) throw new Error("Could not find book metadata");
      const data = await res.json();
      setFormData({
        ...formData,
        title: data.title || formData.title,
        author: data.author || formData.author,
        isbn: data.isbn || formData.isbn,
        coverUrl: data.coverUrl || formData.coverUrl,
        description: data.description || formData.description,
        pageCount: data.pageCount?.toString() || formData.pageCount,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  // Auto-fetch if initialIsbn is provided
  useState(() => {
    if (initialIsbn) {
      fetchMetadata(initialIsbn);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = initialData ? `/api/books/${initialData.id}` : "/api/books";
      const method = initialData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pageCount: formData.pageCount ? parseInt(formData.pageCount, 10) : null,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save book");
      }

      const book = await res.json();

      // If this was from an incidence, mark it as resolved
      if (incidenceId) {
        await fetch(`/api/incidences/${incidenceId}/resolve`, {
          method: "PATCH",
        });
      }

      router.push(`/library/${book.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="The Great Gatsby"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Author *</label>
          <input
            type="text"
            required
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="F. Scott Fitzgerald"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">ISBN</label>
          <div className="relative group">
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12"
              placeholder="9780743273565"
            />
            <button
              type="button"
              onClick={() => fetchMetadata(formData.isbn)}
              disabled={fetching || !formData.isbn}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-30"
              title="Fetch metadata"
            >
              {fetching ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Page Count</label>
          <input
            type="number"
            value={formData.pageCount}
            onChange={(e) => setFormData({ ...formData, pageCount: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="180"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cover Image URL</label>
        <input
          type="url"
          value={formData.coverUrl}
          onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="https://example.com/cover.jpg"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
          placeholder="A brief summary of the book..."
        />
      </div>

      <div className="pt-4 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-blue-600/20"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {initialData ? "Update Book" : "Save Book"}
        </button>
      </div>
    </form>
  );
}
