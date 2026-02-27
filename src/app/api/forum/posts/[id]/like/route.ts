import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

/**
 * POST /api/forum/posts/[id]/like
 * Toggle like on a forum post.
 * - If the user already liked the post, decrement (unlike)
 * - Otherwise, increment (like)
 * Uses a simple set stored in metadata via a ForumLike table concept.
 * Since we don't have a pivot table, we track via a JSON field workaround:
 * We use a simple increment/decrement that trusts the frontend optimistic state.
 * The frontend already manages the liked/not-liked local state optimistically.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const { id: postId } = await params;

    // Vérifier que le post existe
    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post non trouvé" }, { status: 404 });
    }

    // Le frontend gère l'état local optimiste (liké/pas liké).
    // L'API reçoit la direction en body: { action: "like" | "unlike" }
    const body = await req.json().catch(() => ({}));
    const action = body.action === "unlike" ? "unlike" : "like";

    const updated = await prisma.forumPost.update({
      where: { id: postId },
      data: { likes: action === "like" ? { increment: 1 } : { decrement: 1 } },
      select: { likes: true },
    });

    return NextResponse.json({ likes: Math.max(0, updated.likes) });
  } catch (error) {
    console.error("Error in POST /api/forum/posts/[id]/like:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
