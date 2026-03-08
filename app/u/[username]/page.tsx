import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/books/BookCard";
import { BookOpen, User } from "lucide-react";
import Image from "next/image";

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      books: {
        where: { isPublic: true },
        orderBy: { updatedAt: "desc" }
      }
    }
  });

  if (!user || !user.isPublic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-12 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-slate-800 shadow-md relative overflow-hidden">
            {user.image ? (
              <Image src={user.image} alt={user.name || user.username!} fill className="object-cover" />
            ) : (
              <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {user.name || user.username}&apos;s Library
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {user.books.length} public books
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {user.books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {user.books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No public books</h3>
            <p className="text-slate-500 dark:text-slate-400">This user hasn&apos;t made any books public yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
