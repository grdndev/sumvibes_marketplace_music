import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { BeatFilters, PaginationParams } from '@/types/auth';

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
        const where: any = {
            status: 'PUBLISHED',
        };

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
