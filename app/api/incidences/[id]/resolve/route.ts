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
    const incidence = await prisma.incidence.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!incidence || incidence.userId !== session.user.id) {
      return new Response("Not found", { status: 404 });
    }

    const updatedIncidence = await prisma.incidence.update({
      where: { id: resolvedParams.id },
      data: { resolved: true }
    });

    return NextResponse.json(updatedIncidence);
  } catch (error: any) {
    console.error("Error resolving incidence:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
