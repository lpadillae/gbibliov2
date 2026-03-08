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
    const { isbn, errorLog } = body;

    if (!isbn) {
      return new Response("ISBN is required", { status: 400 });
    }

    const incidence = await prisma.incidence.create({
      data: {
        userId: session.user.id,
        isbn,
        errorLog,
      }
    });

    return NextResponse.json(incidence, { status: 201 });
  } catch (error: any) {
    console.error("Error logging incidence:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
