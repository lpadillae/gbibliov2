"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { Book, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function ScannerClient() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookData, setBookData] = useState<any | null>(null);

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: { width: 250, height: 150 },
        fps: 10,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        rememberLastUsedCamera: true,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        setIsScanning(false);
        scanner.clear();
        fetchBookData(decodedText);
      },
      (error) => {
        // Ignore continuous scanning errors
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [isScanning]);

  const fetchBookData = async (isbn: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/metadata?isbn=${isbn}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch book data");
      }
      
      setBookData(data);
    } catch (err: any) {
      setError(err.message);
      // Log incidence
      await fetch("/api/incidences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn, errorLog: err.message }),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = async () => {
    if (!bookData) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      
      if (!res.ok) throw new Error("Failed to save book");
      
      const savedBook = await res.json();
      router.push(`/library/${savedBook.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setBookData(null);
    setError(null);
    setIsScanning(true);
  };

  return (
    <div className="space-y-6">
      {isScanning && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div id="reader" className="w-full max-w-lg mx-auto overflow-hidden rounded-xl [&>div]:border-none [&>div>video]:rounded-xl"></div>
        </div>
      )}

      {scanResult && !isScanning && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              Scanned ISBN: {scanResult}
            </h2>
            <button
              onClick={resetScanner}
              className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
            >
              Scan Again
            </button>
          </div>

          {loading && !bookData && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 dark:text-slate-400">Fetching metadata from multiple sources...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-900/50 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Book Not Found</h3>
              <p className="text-red-600 dark:text-red-300 text-sm mb-6">{error}</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={resetScanner}
                  className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                  Try Another Barcode
                </button>
                <button
                  onClick={() => router.push(`/library/new?isbn=${scanResult}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Enter Manually
                </button>
              </div>
            </div>
          )}

          {bookData && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-32 md:w-48 shrink-0 relative aspect-[2/3] rounded-lg shadow-md overflow-hidden">
                {bookData.coverUrl ? (
                  <img src={bookData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <Book className="w-12 h-12 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{bookData.title}</h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">{bookData.author}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="block text-slate-500 dark:text-slate-400 mb-1">ISBN</span>
                    <span className="font-medium text-slate-900 dark:text-white">{bookData.isbn}</span>
                  </div>
                  {bookData.pageCount && (
                    <div>
                      <span className="block text-slate-500 dark:text-slate-400 mb-1">Pages</span>
                      <span className="font-medium text-slate-900 dark:text-white">{bookData.pageCount}</span>
                    </div>
                  )}
                </div>

                {bookData.description && (
                  <div className="mb-6">
                    <span className="block text-slate-500 dark:text-slate-400 mb-1 text-sm">Description</span>
                    <p className="text-slate-700 dark:text-slate-300 text-sm line-clamp-4">{bookData.description}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleSaveBook}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Add to Library
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
