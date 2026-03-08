"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";

interface StatisticsChartsProps {
  books: any[];
}

export function StatisticsCharts({ books }: StatisticsChartsProps) {
  const statusData = useMemo(() => {
    const counts = {
      POR_LEER: 0,
      LEYENDO: 0,
      LEIDO: 0,
      ABANDONADO: 0,
    };
    
    books.forEach(book => {
      if (counts[book.status as keyof typeof counts] !== undefined) {
        counts[book.status as keyof typeof counts]++;
      }
    });
    
    return [
      { name: "To Read", value: counts.POR_LEER, color: "#94a3b8" },
      { name: "Reading", value: counts.LEYENDO, color: "#3b82f6" },
      { name: "Read", value: counts.LEIDO, color: "#10b981" },
      { name: "Abandoned", value: counts.ABANDONADO, color: "#ef4444" },
    ].filter(item => item.value > 0);
  }, [books]);

  const readingTrendData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    
    const months = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(now)
    });
    
    const data = months.map(month => {
      const monthStr = format(month, "yyyy-MM");
      const readBooks = books.filter(b => b.status === "LEIDO" && b.readAt && format(new Date(b.readAt), "yyyy-MM") === monthStr);
      
      return {
        name: format(month, "MMM"),
        books: readBooks.length,
        pages: readBooks.reduce((sum, b) => sum + (b.pageCount || 0), 0)
      };
    });
    
    return data;
  }, [books]);

  const totalPagesRead = useMemo(() => {
    return books
      .filter(b => b.status === "LEIDO")
      .reduce((sum, b) => sum + (b.pageCount || 0), 0);
  }, [books]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Books</h3>
          <p className="text-4xl font-bold text-slate-900 dark:text-white">{books.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Books Read</h3>
          <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
            {books.filter(b => b.status === "LEIDO").length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Pages Read</h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalPagesRead.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Library by Status</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1e293b' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Books Read (Last 6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readingTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="books" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
