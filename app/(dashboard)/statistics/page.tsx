import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { StatisticsCharts } from "@/components/charts/StatisticsCharts";

export default async function StatisticsPage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/login");
  }

  const books = await prisma.book.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      status: true,
      readAt: true,
      pageCount: true,
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reading Statistics</h1>
        <p className="text-slate-500 dark:text-slate-400">Insights and trends from your personal library.</p>
      </div>

      <StatisticsCharts books={books} />
    </div>
  );
}
