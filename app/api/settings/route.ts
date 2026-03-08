import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function PATCH(req: Request) {
  const session = await getAuthSession();
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, username, isPublic, primarySource } = body;

    if (!username) {
      return new Response("Username is required", { status: 400 });
    }

    // Check if username is taken by someone else
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        id: { not: session.user.id }
      }
    });

    if (existingUser) {
      return new Response("Username is already taken", { status: 409 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        username,
        isPublic,
        primarySource,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
