import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ScannerClient } from "@/components/scanner/ScannerClient";

export default async function ScannerPage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Barcode Scanner</h1>
        <p className="text-slate-500 dark:text-slate-400">Scan a book&apos;s ISBN barcode to instantly add it to your library.</p>
      </div>

      <ScannerClient />
    </div>
  );
}
