import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { BeatStatus } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convertit une valeur FormData en tableau de strings propre */
function toArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

/** Parse un float, retourne null si invalide */
function toFloat(value: unknown): number | null {
  const n = parseFloat(String(value ?? ''));
  return isNaN(n) ? null : n;
}

/** Parse un int, retourne null si invalide */
function toInt(value: unknown): number | null {
  const n = parseInt(String(value ?? ''));
  return isNaN(n) ? null : n;
}

// ─── GET /api/beats ───────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page      = Math.max(1, parseInt(searchParams.get('page')  || '1'));
    const limit     = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const sortBy    = searchParams.get('sortBy')    || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Filters
    const genre     = searchParams.get('genre')?.split(',').filter(Boolean);
    const mood      = searchParams.get('mood')?.split(',').filter(Boolean);
    const minBpm    = searchParams.get('minBpm');
    const maxBpm    = searchParams.get('maxBpm');
    const minPrice  = searchParams.get('minPrice');
    const maxPrice  = searchParams.get('maxPrice');
    const search    = searchParams.get('search');
    const sellerId  = searchParams.get('sellerId');
    const featured  = searchParams.get('featured');

    // Build where clause
    const where: Prisma.BeatWhereInput = {};

    // Par défaut, on ne retourne que les beats publiés (sauf si on filtre par vendeur)
    if (!sellerId) {
      where.status = 'PUBLISHED';
    }

    if (genre?.length)  where.genre = { hasSome: genre };
    if (mood?.length)   where.mood  = { hasSome: mood };

    if (minBpm || maxBpm) {
      where.bpm = {};
      if (minBpm) where.bpm.gte = parseInt(minBpm);
      if (maxBpm) where.bpm.lte = parseInt(maxBpm);
    }

    if (minPrice || maxPrice) {
      where.basicPrice = {};
      if (minPrice) where.basicPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.basicPrice.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { title:       { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags:        { hasSome: [search] } },
      ];
    }

    if (sellerId)        where.sellerId = sellerId;
    if (featured === 'true') where.featured = true;

    const skip = (page - 1) * limit;

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
          licenses: { orderBy: { price: 'asc' } },
          _count: { select: { reviews: true, favorites: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.beat.count({ where }),
    ]);

    const totalPages      = Math.ceil(total / limit);
    const hasNextPage     = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      beats,
      pagination: { page, limit, total, totalPages, hasNextPage, hasPreviousPage },
    });

  } catch (error) {
    console.error('GET /api/beats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des beats' },
      { status: 500 },
    );
  }
}

// ─── POST /api/beats ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Auth
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    // Vérifier le rôle SELLER
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true },
    });

    if (!user || user.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Seuls les vendeurs peuvent créer des beats' },
        { status: 403 },
      );
    }

    // Parse FormData → objet brut
    const formData = await req.formData();
    const raw: Record<string, unknown> = {};

    for (const [key, value] of formData.entries()) {
      // Les champs multi-valeurs (genres, moods, instruments) s'accumulent
      if (raw[key] !== undefined) {
        raw[key] = [...(Array.isArray(raw[key]) ? raw[key] as string[] : [raw[key] as string]), String(value)];
      } else {
        raw[key] = value instanceof File ? value : String(value);
      }
    }

    // ── Extraction & cast des champs ──────────────────────────────────────────

    const title      = String(raw.title      ?? '').trim();
    const previewUrl = String(raw.previewUrl ?? '').trim();
    const bpm        = toInt(raw.bpm);

    // Fix 1 : le formulaire envoie "genres" (pluriel), pas "genre"
    const genres      = toArray(raw.genres      ?? raw.genre);
    const moods       = toArray(raw.moods       ?? raw.mood);
    // Fix 2 : instruments reçu comme tableau ou string CSV
    const instruments = toArray(raw.instruments);
    // Fix 3 : tags reçu comme string CSV "trap, chill, piano"
    const tags        = toArray(raw.tags);

    // Fix 4 : duration parsé en int
    const duration    = toInt(raw.duration) ?? 180;

    // Fix 5 : prix parsés en float (ignorés si absents/invalides)
    const basicPrice     = toFloat(raw.basicPrice);
    const premiumPrice   = toFloat(raw.premiumPrice);
    const exclusivePrice = toFloat(raw.exclusivePrice);

    const description  = String(raw.description  ?? '').trim();
    const key          = String(raw.key          ?? '').trim() || null;
    const coverImage   = String(raw.coverImage   ?? raw.coverUrl ?? '').trim() || null;

    // Fix 6 : utiliser le slug envoyé par le form, ou le générer depuis le titre
    const rawSlug = String(raw.slug ?? '').trim();
    const baseSlug = rawSlug ||
      title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now()}`;

    // ── Validation ────────────────────────────────────────────────────────────
    // Fix 7 : validation cohérente avec les vrais noms de champs
    const missing: string[] = [];
    if (!title)      missing.push('title');
    if (!previewUrl) missing.push('previewUrl');
    if (!genres.length) missing.push('genres');
    if (bpm === null)   missing.push('bpm');

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Champs requis manquants : ${missing.join(', ')}` },
        { status: 400 },
      );
    }

    // ── Création en base ──────────────────────────────────────────────────────
    const beat = await prisma.beat.create({
      data: {
        title,
        slug,
        description,
        genre:       genres,
        mood:        moods,
        instruments,
        tags,
        bpm:         bpm!,
        key,
        duration,
        previewUrl,
        mainFileUrl: String(raw.mainFileUrl ?? raw.previewUrl ?? '').trim(),
        coverImage,
        // Fix 6 : prix stockés
        basicPrice,
        premiumPrice,
        exclusivePrice,
        sellerId: decoded.userId,
        // Fix 8 : statut PENDING par défaut (en attente de validation)
        status: BeatStatus.PENDING,
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
    console.error('POST /api/beats error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}