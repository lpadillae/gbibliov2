import { NextResponse } from "next/server";
import { fetchBookMetadata } from "@/lib/metadata";
import { getAuthSession } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getAuthSession();
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const isbn = searchParams.get("isbn");

  if (!isbn) {
    return new Response("ISBN is required", { status: 400 });
  }

  try {
    const bookData = await fetchBookMetadata(isbn);
    
    if (!bookData) {
      return NextResponse.json({ error: "Book not found in any source" }, { status: 404 });
    }

    return NextResponse.json(bookData);
  } catch (error: any) {
    console.error("Metadata fetch error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch metadata" }, { status: 500 });
  }
}
