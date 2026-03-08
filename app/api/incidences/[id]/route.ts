import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

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
        const incidence = await prisma.incidence.findUnique({
            where: { id, userId: session.user.id },
        });

        if (!incidence) {
            return new Response("Not found", { status: 404 });
        }

        await prisma.incidence.delete({
            where: { id },
        });

        return new Response(null, { status: 204 });
    } catch (error: any) {
        console.error("Error deleting incidence:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
