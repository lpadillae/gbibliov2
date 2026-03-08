import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Book as BookIcon, Calendar, Clock, Edit, Star, Trash2 } from "lucide-react";
import { BookStatusToggle } from "@/components/books/BookStatusToggle";
import { format } from "date-fns";

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  const resolvedParams = await params;

  if (!session) {
    redirect("/login");
  }

  const book = await prisma.book.findUnique({
    where: {
      id: resolvedParams.id,
      userId: session.user.id,
    },
    include: {
      notes: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!book) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/library" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Cover */}
          <div className="w-48 md:w-64 shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] w-full bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookIcon className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                  {book.title}
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300">
                  {book.author}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Status</span>
                <BookStatusToggle bookId={book.id} initialStatus={book.status} />
              </div>
              {book.isbn && (
                <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">ISBN</span>
                  <span className="font-medium text-slate-900 dark:text-white">{book.isbn}</span>
                </div>
              )}
              {book.pageCount && (
                <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Pages</span>
                  <span className="font-medium text-slate-900 dark:text-white">{book.pageCount}</span>
                </div>
              )}
            </div>

            {book.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">About this book</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Added on {format(new Date(book.createdAt), 'MMM d, yyyy')}
              </div>
              {book.readAt && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Clock className="w-4 h-4" />
                  Finished on {format(new Date(book.readAt), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notes & Quotes Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notes & Quotes</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors text-sm shadow-sm shadow-blue-600/20">
            Add Note
          </button>
        </div>

        {book.notes.length > 0 ? (
          <div className="space-y-4">
            {book.notes.map((note) => (
              <div key={note.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                {note.isQuote && <Star className="w-4 h-4 text-amber-500 mb-2" />}
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{note.content}</p>
                {note.pageRef && (
                  <span className="inline-block mt-3 text-xs font-medium text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                    Page {note.pageRef}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <p className="text-slate-500 dark:text-slate-400">No notes or quotes added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
