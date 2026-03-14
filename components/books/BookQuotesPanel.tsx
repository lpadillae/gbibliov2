import { fetchBookCommonQuotes } from "@/lib/quotes";
import { Quote } from "lucide-react";

interface NoteLike {
  id: string;
  content: string;
  pageRef: number | null;
  isQuote: boolean;
}

interface BookQuotesPanelProps {
  isbn?: string | null;
  notes: NoteLike[];
}

export async function BookQuotesPanel({ isbn, notes }: BookQuotesPanelProps) {
  const userQuotes = notes.filter((note) => note.isQuote);
  const commonQuotes = isbn ? await fetchBookCommonQuotes(isbn) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your quotes</h3>
          <span className="text-xs text-slate-400 uppercase tracking-wider">Local</span>
        </div>
        {userQuotes.length > 0 ? (
          <div className="space-y-3">
            {userQuotes.map((quote) => (
              <div key={quote.id} className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-2">
                  <Quote className="w-4 h-4 text-amber-500 mt-1" />
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{quote.content}</p>
                    {quote.pageRef !== null && (
                      <span className="inline-block mt-2 text-xs font-medium text-slate-500 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                        Page {quote.pageRef}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-slate-500 dark:text-slate-400">No quotes added yet.</p>
          </div>
        )}
      </div>

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Common quotes</h3>
          <span className="text-xs text-slate-400 uppercase tracking-wider">Open Library</span>
        </div>
        {commonQuotes.length > 0 ? (
          <div className="space-y-3">
            {commonQuotes.map((quote, index) => (
              <div key={`${index}-${quote.text.slice(0, 20)}`} className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-2">
                  <Quote className="w-4 h-4 text-blue-500 mt-1" />
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{quote.text}</p>
                    {quote.source && (
                      <span className="block mt-2 text-xs text-slate-500 dark:text-slate-400">{quote.source}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-slate-500 dark:text-slate-400">No common quotes available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
