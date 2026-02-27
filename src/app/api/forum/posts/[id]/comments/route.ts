import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const [comments, total] = await Promise.all([
      prisma.forumComment.findMany({
        where: { postId },
        include: {
          author: {
            select: {
              id: true,
              displayName: true,
              username: true,
              avatar: true,
              role: true,
              sellerProfile: { select: { artistName: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.forumComment.count({ where: { postId } }),
    ]);

    return NextResponse.json({
      comments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error in GET /api/forum/posts/[id]/comments:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

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
    const body = await req.json();
    const { content } = body;

    // Validation
    if (!content || content.trim().length < 3) {
      return NextResponse.json(
        { error: "Le commentaire doit contenir au moins 3 caractères" },
        { status: 400 }
      );
    }

    if (content.trim().length > 2000) {
      return NextResponse.json(
        { error: "Le commentaire ne peut pas dépasser 2 000 caractères" },
        { status: 400 }
      );
    }

    // Vérifier que le post existe
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post non trouvé" }, { status: 404 });
    }

    // Créer le commentaire
    const comment = await prisma.forumComment.create({
      data: {
        postId,
        authorId: decoded.userId,
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatar: true,
            role: true,
            sellerProfile: { select: { artistName: true } },
          },
        },
      },
    });

    // TODO: Notifier l'auteur du post qu'il y a un nouveau commentaire

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/forum/posts/[id]/comments:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
