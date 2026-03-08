"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteIncidenceButtonProps {
    incidenceId: string;
}

export function DeleteIncidenceButton({ incidenceId }: DeleteIncidenceButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this incidence log?")) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/incidences/${incidenceId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete incidence");

            router.refresh();
        } catch (error) {
            alert("Error deleting incidence");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
            title="Delete Incidence"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    );
}
