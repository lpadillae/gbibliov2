import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { BookForm } from "@/components/books/BookForm";

export default async function EditBookPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getAuthSession();
    const { id } = await params;

    if (!session) {
        redirect("/login");
    }

    const book = await prisma.book.findUnique({
        where: {
            id,
            userId: session.user.id,
        },
    });

    if (!book) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Edit Book</h1>
                <p className="text-slate-500 dark:text-slate-400">Update the details of your book.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
                <BookForm initialData={book} />
            </div>
        </div>
    );
}
