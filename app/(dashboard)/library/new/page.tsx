import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookForm } from "@/components/books/BookForm";

export default async function NewBookPage({
  searchParams,
}: {
  searchParams: Promise<{ isbn?: string; incidenceId?: string }>;
}) {
  const session = await getAuthSession();
  const resolvedParams = await searchParams;

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Add Book Manually</h1>
        <p className="text-slate-500 dark:text-slate-400">Enter the details of the book to add it to your library.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
        <BookForm initialIsbn={resolvedParams.isbn} incidenceId={resolvedParams.incidenceId} />
      </div>
    </div>
  );
}
