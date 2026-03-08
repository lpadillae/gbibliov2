import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { DeleteIncidenceButton } from "@/components/incidences/DeleteIncidenceButton";

export default async function IncidencesPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  const incidences = await prisma.incidence.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Incidences Log</h1>
        <p className="text-slate-500 dark:text-slate-400">Track failed ISBN scans and resolve them manually.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {incidences.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {incidences.map((incidence) => (
              <div key={incidence.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${incidence.resolved
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    }`}>
                    {incidence.resolved ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      ISBN: {incidence.isbn}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {incidence.errorLog || "Unknown error occurred during scan."}
                    </p>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      {format(new Date(incidence.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!incidence.resolved && (
                    <Link
                      href={`/library/new?isbn=${incidence.isbn}&incidenceId=${incidence.id}`}
                      className="shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      Resolve Manually
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  <DeleteIncidenceButton incidenceId={incidence.id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">All clear!</h3>
            <p className="text-slate-500 dark:text-slate-400">No failed scans recorded. Your metadata engine is working perfectly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
