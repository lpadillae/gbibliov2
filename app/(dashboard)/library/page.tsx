import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { BookList } from "@/components/books/BookList";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function LibraryPage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/login");
  }

  const books = await prisma.book.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Library</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your collection of {books.length} books.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/scanner" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm shadow-blue-600/20">
            <Plus className="w-5 h-5" />
            Add Book
          </Link>
        </div>
      </div>

      <BookList initialBooks={books} />
    </div>
  );
}
