import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const service = await prisma.service.findUnique({
            where: {
                id,
            },
            include: {
                seller: {
                    include: {
                        sellerProfile: true
                    }
                }
            }
        });

        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        return NextResponse.json(service);
    } catch (error) {
        console.error("Error fetching service:", error);
        return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
    }
}
