import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { userSchema, itemSchema, invoiceSchema } from "./schema/invoiceModel";
import { createInvoiceBuffer } from "@/lib/pdfkit-invoice/createInvoice";
import { sendInvoiceEmail } from "@/lib/resend";
import { generateInvoiceEmailHtml } from "@/lib/email-templates/invoiceTemplate";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try { 
        const authHeader = req.headers.get("authorization");

        const token = authHeader?.split(" ")[1];

        if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

        const decoded = verifyToken(token);

        if (!decoded) return NextResponse.json({ error: "Token invalide" }, { status: 401 });

        const body = await req.json();
        const { shipping, items, payment } = body;

        await userSchema.validateAsync(shipping);

        for (const item of items) {
            await itemSchema.validateAsync(item);
        }

        await invoiceSchema.validateAsync(payment);

        const data = { shipping, items, payment };
        const pdfBuffer = await createInvoiceBuffer(data);
        const emailHtml = generateInvoiceEmailHtml(data);

        await sendInvoiceEmail(
            shipping.email,
            `Votre facture ${payment.invoice_nr} — SumVibes`,
            emailHtml,
            pdfBuffer,
            payment.invoice_nr
        );

        console.log("Facture créée et email envoyé pour l'utilisateur :", shipping.email);

        return NextResponse.json({
            message: "Facture créée avec succès",
            invoiceId: payment.invoice_nr
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error in POST /api/invoice:", error);
        if (error?.isJoi) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}