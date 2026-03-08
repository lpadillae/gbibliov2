import { Book } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Book as BookIcon } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const statusColors: Record<string, string> = {
    POR_LEER: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    LEYENDO: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    LEIDO: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    ABANDONADO: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Link href={`/library/${book.id}`} className="group flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="relative aspect-[2/3] w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <BookIcon className="w-12 h-12 text-slate-300 dark:text-slate-700" />
        )}
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${statusColors[book.status] || statusColors.POR_LEER}`}>
            {book.status.replace("_", " ")}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 mb-1 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-auto">
          {book.author}
        </p>
      </div>
    </Link>
  );
}
