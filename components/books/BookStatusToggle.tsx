"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookStatusToggleProps {
  bookId: string;
  initialStatus: string;
}

export function BookStatusToggle({ bookId, initialStatus }: BookStatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const statuses = [
    { value: "POR_LEER", label: "To Read" },
    { value: "LEYENDO", label: "Reading" },
    { value: "LEIDO", label: "Read" },
    { value: "ABANDONADO", label: "Abandoned" },
  ];

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    
    setLoading(true);
    setStatus(newStatus);
    
    try {
      const res = await fetch(`/api/books/${bookId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      
      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus(initialStatus); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={loading}
      className="bg-transparent font-semibold text-slate-900 dark:text-white outline-none cursor-pointer disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value} className="text-slate-900">
          {s.label}
        </option>
      ))}
    </select>
  );
}
