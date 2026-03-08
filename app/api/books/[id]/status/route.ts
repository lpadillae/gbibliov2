import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  const resolvedParams = await params;

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return new Response("Status is required", { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!book || book.userId !== session.user.id) {
      return new Response("Not found", { status: 404 });
    }

    const updateData: any = { status };

    // Set readAt timestamp if status is changed to LEIDO
    if (status === "LEIDO" && book.status !== "LEIDO") {
      updateData.readAt = new Date();
    } else if (status !== "LEIDO") {
      updateData.readAt = null; // Clear readAt if status is not LEIDO
    }

    const updatedBook = await prisma.book.update({
      where: { id: resolvedParams.id },
      data: updateData
    });

    return NextResponse.json(updatedBook);
  } catch (error: any) {
    console.error("Error updating book status:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
