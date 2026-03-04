'use strict';

import { generateInvoiceNumber } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const path = require('path');

const {createInvoiceSchema} = require('./invoiceModel');
 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await createInvoiceSchema.validateAsync(body);

    const { id, buyerId, invoiceNumber, items, paymentMethod, amount, platformFee, createdAt } = body;

    const invoice = 'FACT-'+ invoiceNumber +'-'+ buyerId ;

    const fileName = invoice






    return NextResponse.json(
      { message: "Invoice validated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Validation failed" },
      { status: 400 }
    );
  }
}