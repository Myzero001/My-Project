"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductSchema = void 0;
const zod_1 = require("zod");
exports.CreateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        product_name: zod_1.z.string().max(50),
        price: zod_1.z
            .number()
            .refine((val) => !isNaN(val) && val % 1 !== 0, {
            message: "Value must be a decimal.",
        }),
        category_id: zod_1.z.string().uuid(),
    })
});
