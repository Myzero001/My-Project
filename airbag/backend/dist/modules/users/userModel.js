"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserSchema = exports.UpdateUserSchema = exports.LoginUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
// const Role = z.enum(["Admin", "User", "User-Box", "Owner", "Manager", "Technician", "Sale"]);
exports.CreateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(4).max(50),
        password: zod_1.z
            .string()
            .min(4)
            .max(255)
            .optional(),
        role_id: zod_1.z.string().uuid().optional(),
        company_id: zod_1.z
            .string()
            //.uuid()
            .optional()
            .transform((val) => (val === null || val === undefined ? "" : val)),
        email: zod_1.z.string().max(50).email("กรุณาระบุอีเมล").optional(),
        first_name: zod_1.z.string().max(20).optional(),
        employee_code: zod_1.z.string().max(20).optional(),
        last_name: zod_1.z.string().max(20).optional(),
        birthday: zod_1.z
            .string()
            .refine(val => val === '' || val === null || /^\d{4}-\d{2}-\d{2}$/.test(val), { message: "Invalid date format" })
            .transform(val => val === '' || val === null ? undefined : val)
            .optional(),
        phone_number: zod_1.z
            .string()
            .refine(val => val === '' || val === null ||
            (val.length === 10 && /^\d+$/.test(val)), { message: "Phone number must be exactly 10 digits" })
            .transform(val => val === '' || val === null ? undefined : val)
            .optional(),
        line_id: zod_1.z.string().max(20).optional(),
        right: zod_1.z.string().max(20).optional(),
        job_title: zod_1.z.string().max(50).optional(),
        addr_number: zod_1.z.string().max(10).optional(),
        addr_alley: zod_1.z.string().max(50).optional(),
        addr_street: zod_1.z.string().max(100).optional(),
        addr_subdistrict: zod_1.z.string().max(50).optional(),
        addr_district: zod_1.z.string().max(50).optional(),
        addr_province: zod_1.z.string().max(50).optional(),
        addr_postcode: zod_1.z.string().min(0).max(5).optional(),
        image_url: zod_1.z.string().optional(),
        position: zod_1.z.string().max(20).optional(),
        remark: zod_1.z.string().max(255).optional(),
    }),
});
exports.LoginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(4).max(50),
        password: zod_1.z.string().min(4).max(50),
    }),
});
exports.UpdateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        employee_id: zod_1.z.string().uuid(),
    }),
});
exports.GetUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        employee_id: zod_1.z.string().uuid(),
    }),
});
