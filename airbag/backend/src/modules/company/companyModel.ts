import { commonValidations } from "@common/utils/commonValidation";
import { z } from "zod";


export type TypePayloadProduct = {
    product_name: string,
    price: number,
    category_id: string,
}

export const CreateProductSchema = z.object({
    body: z.object({
        product_name: z.string().max(50),
        price: z
            .number()
            .refine((val) => !isNaN(val) && val % 1 !== 0, {
                message: "Value must be a decimal.",
            }),
        category_id: z.string().uuid(),
    })
})
