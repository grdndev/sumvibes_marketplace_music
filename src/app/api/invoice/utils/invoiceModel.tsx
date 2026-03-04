const joi = require("joi");

export const createInvoiceSchema = joi.object({
    id: joi.string().require(),             // id invoice
    buyerId: joi.string().require(),        // id buyer  
    invoicenNumber: joi.number().require(), // item number
    items: joi.array(),                      // item
    paymentMethod: joi.string().require(),  // payment method
    amount: joi.number().require().require(),  // amount
    platformFee :joi.string(),               // platforme 
    createdAt: joi.date().require()         // date
});