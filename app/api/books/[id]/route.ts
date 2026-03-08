import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAuthSession();
    const { id } = await params;

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, author, isbn, coverUrl, description, pageCount, status } = body;

        const book = await prisma.book.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!book) {
            return new Response("Not found", { status: 404 });
        }

        const updatedBook = await prisma.book.update({
            where: { id },
            data: {
                title: title ?? undefined,
                author: author ?? undefined,
                isbn: isbn ?? undefined,
                coverUrl: coverUrl ?? undefined,
                description: description ?? undefined,
                pageCount: pageCount ? parseInt(pageCount, 10) : undefined,
                status: status ?? undefined,
            },
        });

        return NextResponse.json(updatedBook);
    } catch (error: any) {
        console.error("Error updating book:", error);
        return new Response("Internal server error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getAuthSession();
    const { id } = await params;

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const book = await prisma.book.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!book) {
            return new Response("Not found", { status: 404 });
        }

        await prisma.book.delete({
            where: { id },
        });

        return new Response(null, { status: 204 });
    } catch (error: any) {
        console.error("Error deleting book:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
