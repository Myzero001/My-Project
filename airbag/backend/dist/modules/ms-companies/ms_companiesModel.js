"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompaniesSchema = exports.CreateCompaniesSchema = exports.GetCompaniesSchema = void 0;
const zod_1 = require("zod");
exports.GetCompaniesSchema = zod_1.z.object({
    params: zod_1.z.object({
        company_id: zod_1.z.string().uuid(),
    }),
});
// export const CreateCompaniesSchema = z.object({
//     body: z.object({
//         company_name: z.string().max(50),
//         company_address: z.string().max(50),
//         company_main:z.boolean(),
//         create_at: z.date(),
//         created_by: z.string().max(50),
//         updated_at: z.date(),
//         updated_by: z.string().max(50),
//     })
// });
exports.CreateCompaniesSchema = zod_1.z.object({
    body: zod_1.z.object({
        company_name: zod_1.z.string().max(50), // ชื่อบริษัท
        company_code: zod_1.z.string().max(50),
        tax_status: zod_1.z.string().optional(),
        tel_number: zod_1.z
            .string()
            .max(10)
            .optional(),
        company_tin: zod_1.z.string().max(13).optional(),
        addr_number: zod_1.z.string().max(10),
        addr_alley: zod_1.z.string().max(50),
        addr_street: zod_1.z.string().max(100),
        addr_subdistrict: zod_1.z.string().max(50),
        addr_district: zod_1.z.string().max(50),
        addr_province: zod_1.z.string().max(50),
        addr_postcode: zod_1.z.string().max(5),
        promtpay_id: zod_1.z.string().max(13).optional(),
        //conpany_code: z.string().max(50),
        //company_main: z.boolean(),  // สถานะหลักของบริษัท
    }),
});
exports.UpdateCompaniesSchema = zod_1.z.object({
    body: zod_1.z.object({
        company_name: zod_1.z.string().max(50).optional(), // ชื่อบริษัท
        company_code: zod_1.z.string().max(50).optional(),
        tax_status: zod_1.z.string().optional(),
        tel_number: zod_1.z
            .string()
            .max(10)
            .optional(),
        company_tin: zod_1.z.string().max(13).optional(),
        addr_number: zod_1.z.string().max(10).optional(),
        addr_alley: zod_1.z.string().max(50).optional(),
        addr_street: zod_1.z.string().max(100).optional(),
        addr_subdistrict: zod_1.z.string().max(50).optional(),
        addr_district: zod_1.z.string().max(50).optional(),
        addr_province: zod_1.z.string().max(50).optional(),
        addr_postcode: zod_1.z.string().max(5).optional(),
        company_main: zod_1.z.boolean().optional(), // สถานะหลักของบริษัท
        promtpay_id: zod_1.z.string().max(13).optional(),
        //updated_by: z.string().max(50),
    }),
});
