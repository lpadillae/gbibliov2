import { Star } from "lucide-react";
import { fetchBookOpinions } from "@/lib/opinions";

interface BookOpinionsProps {
  isbn?: string | null;
}

function formatRating(value?: number) {
  if (!value || Number.isNaN(value)) return null;
  return value.toFixed(1);
}

export async function BookOpinions({ isbn }: BookOpinionsProps) {
  if (!isbn) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Community opinions</h2>
        <p className="text-slate-500 dark:text-slate-400">No ISBN found for this book.</p>
      </div>
    );
  }

  const opinions = await fetchBookOpinions(isbn);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Community opinions</h2>
        <span className="text-xs text-slate-400 uppercase tracking-wider">Read-only</span>
      </div>

      {!opinions ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400">No external opinions available right now.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {opinions.sources.map((source) => {
            const rating = formatRating(source.averageRating);
            return (
              <div key={source.source} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {source.source === "openlibrary" ? "Open Library" : "Google Books"}
                  </span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">External</span>
                </div>

                {(rating || source.ratingsCount) && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{rating ?? "—"}</span>
                    </div>
                    {source.ratingsCount && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {source.ratingsCount.toLocaleString()} ratings
                      </span>
                    )}
                  </div>
                )}

                {source.shelfCounts && source.shelfCounts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {source.shelfCounts.map((shelf) => (
                      <span
                        key={shelf.name}
                        className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        {shelf.name}: {shelf.count.toLocaleString()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
