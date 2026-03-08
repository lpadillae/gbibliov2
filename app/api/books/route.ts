import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getAuthSession();
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, author, isbn, coverUrl, description, pageCount } = body;

    if (!title || !author) {
      return new Response("Title and Author are required", { status: 400 });
    }

    // Check if book already exists for this user
    if (isbn) {
      const existingBook = await prisma.book.findFirst({
        where: {
          userId: session.user.id,
          isbn: isbn,
        }
      });

      if (existingBook) {
        return new Response("Book already exists in your library", { status: 409 });
      }
    }

    const book = await prisma.book.create({
      data: {
        userId: session.user.id,
        title,
        author,
        isbn,
        coverUrl,
        description,
        pageCount: pageCount ? parseInt(pageCount, 10) : null,
      }
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    console.error("Error saving book:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
