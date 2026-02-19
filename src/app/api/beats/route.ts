import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { BeatStatus } from '@prisma/client';
import { BeatFilters, PaginationParams } from '@/types/auth';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse pagination params
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

        // Parse filters
        const genre = searchParams.get('genre')?.split(',').filter(Boolean);
        const mood = searchParams.get('mood')?.split(',').filter(Boolean);
        const minBpm = searchParams.get('minBpm');
        const maxBpm = searchParams.get('maxBpm');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const search = searchParams.get('search');
        const sellerId = searchParams.get('sellerId');
        const featured = searchParams.get('featured');

        // Build where clause
        const where: any = {};

        // Si pas de sellerId ou pas de filtre explicite, on filtre PUBLISHED par défaut
        if (!sellerId) {
            where.status = 'PUBLISHED';
        }

        // Genre filter
        if (genre && genre.length > 0) {
            where.genre = {
                hasSome: genre,
            };
        }

        // Mood filter
        if (mood && mood.length > 0) {
            where.mood = {
                hasSome: mood,
            };
        }

        // BPM filter
        if (minBpm || maxBpm) {
            where.bpm = {};
            if (minBpm) where.bpm.gte = parseInt(minBpm);
            if (maxBpm) where.bpm.lte = parseInt(maxBpm);
        }

        // Price filter (using basicPrice as reference)
        if (minPrice || maxPrice) {
            where.basicPrice = {};
            if (minPrice) where.basicPrice.gte = parseFloat(minPrice);
            if (maxPrice) where.basicPrice.lte = parseFloat(maxPrice);
        }

        // Search filter
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { hasSome: [search] } },
            ];
        }

        // Seller filter
        if (sellerId) {
            where.sellerId = sellerId;
        }

        // Featured filter
        if (featured === 'true') {
            where.featured = true;
        }

        // Calculate skip for pagination
        const skip = (page - 1) * limit;

        // Execute query
        const [beats, total] = await Promise.all([
            prisma.beat.findMany({
                where,
                include: {
                    seller: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatar: true,
                            sellerProfile: {
                                select: {
                                    artistName: true,
                                    verified: true,
                                    averageRating: true,
                                },
                            },
                        },
                    },
                    licenses: {
                        orderBy: {
                            price: 'asc',
                        },
                    },
                    _count: {
                        select: {
                            reviews: true,
                            favorites: true,
                        },
                    },
                },
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip,
                take: limit,
            }),
            prisma.beat.count({ where }),
        ]);

        // Calculate pagination meta
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return NextResponse.json({
            beats,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            },
        });

    } catch (error) {
        console.error('Get beats error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des beats' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    // Vérifier que l'utilisateur est un vendeur
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true },
    });

    if (!user || user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Seuls les vendeurs peuvent créer des beats" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validation basique
    if (!body.title || !body.genre || !body.bpm || (!body.previewUrl && !body.audioUrl)) {
      return NextResponse.json(
        { error: "Champs requis : title, genre, bpm, previewUrl" },
        { status: 400 }
      );
    }

    // Générer un slug unique
    const slug = body.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Convertir genre/mood en tableau si c'est une string
    const genres = Array.isArray(body.genre) ? body.genre : [body.genre];
    const moods = Array.isArray(body.mood) ? body.mood : body.mood ? [body.mood] : [];

    const beat = await prisma.beat.create({
      data: {
        title: body.title,
        slug: `${slug}-${Date.now()}`,
        description: body.description || "",
        genre: genres,
        mood: moods,
        bpm: parseInt(body.bpm),
        key: body.key || null,
        tags: body.tags || [],
        instruments: body.instruments || [],
        duration: body.duration || 180,
        previewUrl: body.previewUrl || body.audioUrl,   // fichier audio = preview
        mainFileUrl: body.mainFileUrl || body.audioUrl,  // fichier principal
        coverImage: body.coverImage || body.coverUrl || null,
        sellerId: decoded.userId,
        status: "PENDING" as any,
      },
      include: {
        seller: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ beat }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/beats:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
