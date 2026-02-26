import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import Channel from "@/models/Channel";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (conversationId) {
      // Find the channel
      let channel = await Channel.findOne({
        $or: [
          { userOneId: decoded.userId, userTwoId: conversationId },
          { userOneId: conversationId, userTwoId: decoded.userId },
        ],
      });

      if (!channel) return NextResponse.json({ messages: [] });

      const messagesQuery = await Message.find({ channelId: channel._id })
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Get users info from Prisma
      const userIds = [...new Set(messagesQuery.map(m => m.senderId).concat(messagesQuery.map(m => m.recipientId)))];
      const usersInfo = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          displayName: true,
          username: true,
          avatar: true,
          sellerProfile: { select: { artistName: true } },
        },
      });
      const usersMap = new Map(usersInfo.map(u => [u.id, u]));

      const messages = messagesQuery.map(m => ({
        id: m._id.toString(),
        content: m.content,
        senderId: m.senderId,
        recipientId: m.recipientId,
        read: m.read,
        createdAt: m.createdAt,
        sender: usersMap.get(m.senderId),
      }));

      // Mark unread as read
      await Message.updateMany(
        { channelId: channel._id, senderId: conversationId, recipientId: decoded.userId, read: false },
        { $set: { read: true } }
      );

      return NextResponse.json({ messages });
    } else {
      // List conversations
      const channels = await Channel.find({
        $or: [{ userOneId: decoded.userId }, { userTwoId: decoded.userId }],
      }).populate('lastMessage').lean();

      const otherUserIds = channels.map(c => c.userOneId === decoded.userId ? c.userTwoId : c.userOneId);

      const otherUsers = await prisma.user.findMany({
        where: { id: { in: otherUserIds } },
        select: { id: true, displayName: true, username: true, avatar: true },
      });
      const usersById = new Map(otherUsers.map(u => [u.id, u]));

      const conversations = await Promise.all(channels.map(async (c: any) => {
        const otherId = c.userOneId === decoded.userId ? c.userTwoId : c.userOneId;
        const otherUser = usersById.get(otherId);
        if (!otherUser) return null;

        const unreadCount = await Message.countDocuments({
          channelId: c._id,
          senderId: otherId,
          recipientId: decoded.userId,
          read: false,
        });

        return {
          userId: otherId,
          displayName: otherUser.displayName,
          username: otherUser.username,
          avatar: otherUser.avatar,
          lastMessage: c.lastMessage?.content || "",
          lastMessageAt: c.lastMessage?.createdAt || c.updatedAt,
          unreadCount,
        };
      }));

      // Remove nulls and sort by lastMessageAt desc
      const sortedConversations = conversations
        .filter(c => c !== null)
        .sort((a, b: any) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

      return NextResponse.json({ conversations: sortedConversations });
    }
  } catch (error) {
    console.error("Error in GET /api/messages:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

    const body = await req.json();
    const { receiverId, content } = body;
    if (!receiverId || !content?.trim())
      return NextResponse.json({ error: "Destinataire et contenu requis" }, { status: 400 });

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });
    if (!receiver) return NextResponse.json({ error: "Destinataire introuvable" }, { status: 404 });

    await dbConnect();

    // Find or create channel
    let channel = await Channel.findOne({
      $or: [
        { userOneId: decoded.userId, userTwoId: receiverId },
        { userOneId: receiverId, userTwoId: decoded.userId },
      ],
    });

    if (!channel) {
      channel = await Channel.create({
        userOneId: decoded.userId,
        userTwoId: receiverId,
      });
    }

    const message = await Message.create({
      senderId: decoded.userId,
      recipientId: receiverId,
      channelId: channel._id,
      content: content.trim(),
    });

    channel.lastMessage = message._id as mongoose.Types.ObjectId;
    await channel.save();

    // Fetch sender info for real-time populate
    const senderInfo = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        displayName: true,
        username: true,
        avatar: true,
        sellerProfile: { select: { artistName: true } },
      },
    });

    const responseMsg = {
      id: message._id.toString(),
      content: message.content,
      senderId: message.senderId,
      recipientId: message.recipientId,
      read: message.read,
      createdAt: message.createdAt,
      sender: senderInfo,
    };

    return NextResponse.json(responseMsg, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/messages:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
