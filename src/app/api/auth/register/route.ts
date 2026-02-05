import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { RegisterData } from '@/types/auth';

export async function POST(request: NextRequest) {
    try {
        const body: RegisterData = await request.json();

        // Validation
        if (!body.email || !body.username || !body.password) {
            return NextResponse.json(
                { error: 'Email, username et mot de passe requis' },
                { status: 400 }
            );
        }

        if (!body.gdprConsent) {
            return NextResponse.json(
                { error: 'Vous devez accepter la politique de confidentialité' },
                { status: 400 }
            );
        }

        if (body.password.length < 8) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 8 caractères' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: body.email },
                    { username: body.username },
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Cet email ou nom d\'utilisateur existe déjà' },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(body.password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: body.email,
                username: body.username,
                passwordHash,
                role: body.role,
                firstName: body.firstName,
                lastName: body.lastName,
                displayName: body.displayName || body.username,
                gdprConsent: body.gdprConsent,
                marketingConsent: body.marketingConsent || false,
            },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                displayName: true,
                avatar: true,
                createdAt: true,
            },
        });

        // If seller, create seller profile
        if (body.role === 'SELLER') {
            await prisma.sellerProfile.create({
                data: {
                    userId: user.id,
                    artistName: body.displayName || body.username,
                    description: '',
                    genres: [],
                },
            });
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return NextResponse.json(
            {
                message: 'Inscription réussie',
                user,
                token,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'inscription' },
            { status: 500 }
        );
    }
}
