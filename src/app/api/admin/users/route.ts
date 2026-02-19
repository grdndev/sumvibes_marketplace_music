import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    // Vérifier que l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { displayName: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          displayName: true,
          username: true,
          avatar: true,
          role: true,
          createdAt: true,
          sellerProfile: {
            select: {
              artistName: true,
              totalSales: true,
              totalRevenue: true,
              averageRating: true,
            },
          },
          _count: {
            select: {
              purchases: true,
              beats: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
