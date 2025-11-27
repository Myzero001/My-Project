import {z} from "zod";





export const searchRegisterSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().optional(),
        pageSize: z.coerce.number().int().positive().optional(),
        search: z.string().optional()
    })
});