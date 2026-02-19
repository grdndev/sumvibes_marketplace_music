import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (conversationId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: decoded.userId, recipientId: conversationId },
            { senderId: conversationId, recipientId: decoded.userId },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              displayName: true,
              username: true,
              avatar: true,
              sellerProfile: { select: { artistName: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      });

      await prisma.message.updateMany({
        where: { senderId: conversationId, recipientId: decoded.userId, read: false },
        data: { read: true },
      });

      return NextResponse.json({ messages });
    } else {
      // Liste des conversations via Prisma (sans raw SQL)
      const allMessages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: decoded.userId },
            { recipientId: decoded.userId },
          ],
        },
        include: {
          sender: {
            select: { id: true, displayName: true, username: true, avatar: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Collecter les IDs des autres utilisateurs
      const otherUserIds = [...new Set(
        allMessages.map(m => m.senderId === decoded.userId ? m.recipientId : m.senderId)
      )];

      // Récupérer leurs profils
      const otherUsers = await prisma.user.findMany({
        where: { id: { in: otherUserIds } },
        select: { id: true, displayName: true, username: true, avatar: true },
      });
      const usersById = new Map(otherUsers.map(u => [u.id, u]));

      // Déduire les conversations uniques
      const convMap = new Map<string, {
        userId: string;
        displayName: string | null;
        username: string;
        avatar: string | null;
        lastMessage: string;
        lastMessageAt: Date;
        unreadCount: number;
      }>();

      for (const msg of allMessages) {
        const otherId = msg.senderId === decoded.userId ? msg.recipientId : msg.senderId;
        const otherUser = usersById.get(otherId);
        if (!otherUser) continue;

        if (!convMap.has(otherId)) {
          const unreadCount = allMessages.filter(
            m => m.senderId === otherId && m.recipientId === decoded.userId && !m.read
          ).length;

          convMap.set(otherId, {
            userId: otherId,
            displayName: otherUser.displayName,
            username: otherUser.username,
            avatar: otherUser.avatar,
            lastMessage: msg.content,
            lastMessageAt: msg.createdAt,
            unreadCount,
          });
        }
      }

      const conversations = Array.from(convMap.values());
      return NextResponse.json({ conversations });
    }
  } catch (error) {
    console.error("Error in GET /api/messages:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded)
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });

    const body = await req.json();
    const { receiverId, content } = body;
    if (!receiverId || !content?.trim())
      return NextResponse.json(
        { error: "Destinataire et contenu requis" },
        { status: 400 }
      );

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });
    if (!receiver)
      return NextResponse.json(
        { error: "Destinataire introuvable" },
        { status: 404 }
      );

    const message = await prisma.message.create({
      data: {
        senderId: decoded.userId,
        recipientId: receiverId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatar: true,
            sellerProfile: { select: { artistName: true } },
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/messages:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
