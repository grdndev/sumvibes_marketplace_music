import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const beat = await prisma.beat.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
      },
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
                totalSales: true,
              },
            },
          },
        },
        licenses: {
          orderBy: { price: 'asc' },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, displayName: true, username: true, avatar: true },
            },
          },
        },
        _count: {
          select: { reviews: true, favorites: true },
        },
      },
    });

    if (!beat) {
      return NextResponse.json({ error: 'Beat introuvable' }, { status: 404 });
    }

    // Increment plays
    await prisma.beat.update({
      where: { id: beat.id },
      data: { plays: { increment: 1 } },
    });

    return NextResponse.json({ beat });
  } catch (error) {
    console.error('Get beat by slug error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Token invalide' }, { status: 401 });

    const beat = await prisma.beat.findFirst({ where: { slug } });
    if (!beat) return NextResponse.json({ error: 'Beat introuvable' }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { role: true } });
    if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

    if (beat.sellerId !== decoded.userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const body = await request.json();
    const updated = await prisma.beat.update({
      where: { id: beat.id },
      data: {
        title: body.title,
        description: body.description,
        genre: body.genre,
        mood: body.mood,
        bpm: body.bpm,
        key: body.key,
        tags: body.tags,
        coverImage: body.coverImage,
        previewUrl: body.previewUrl,
        mainFileUrl: body.mainFileUrl,
        status: body.status,
      },
    });

    return NextResponse.json({ beat: updated });
  } catch (error) {
    console.error('Update beat error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Token invalide' }, { status: 401 });

    const beat = await prisma.beat.findFirst({ where: { slug } });
    if (!beat) return NextResponse.json({ error: 'Beat introuvable' }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { role: true } });
    if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

    if (beat.sellerId !== decoded.userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    await prisma.beat.update({ where: { id: beat.id }, data: { status: 'DELETED' as any } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete beat error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
