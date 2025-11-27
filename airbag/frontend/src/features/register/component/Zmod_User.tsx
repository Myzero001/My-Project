import { z, ZodType } from "zod";
import { PayLoadRegister } from "@/types/requests/request.user";

export const CreateUserSchema = z.object({
  username: z
    .string({ required_error: "กรุณาระบุชื่อผู้ใช้งาน" })
    .nonempty("กรุณาระบุชื่อผู้ใช้")
    .max(255),

  password: z
    .string({ required_error: "กรุณาระบุรหัสผ่าน" })
    .nonempty("กรุณาระบุรหัสผ่าน")
    .max(255),

  email: z
    .string({ required_error: "กรุณาระบุอีเมลล์" })
    .nonempty("กรุณาระบุEmail")
    .max(255),

  role_id: z
    .string({ required_error: "กรุณาระบุสิทธ์ผู้ใช้" })
    .nonempty("กรุณาระบุสิทธ์ผู้ใช้")
    .max(255),

  company_id: z
    .string()
    .uuid()
    .optional()
    .transform((val) => (val === null || val === undefined ? "" : val)),

  first_name: z.string().max(20).optional(),

  employee_code: z
    .string({ required_error: "กรุณาระบุรหัสพนักงาน" })
    .nonempty("กรุณาระบุ Employee Code")
    .max(20),

  last_name: z.string().max(20).optional(),

  birthday: z
    .string()
    .refine(
      (val) => val === "" || val === null || /^\d{4}-\d{2}-\d{2}$/.test(val),
      { message: "Invalid date format" }
    )
    .transform((val) => (val === "" || val === null ? undefined : val))
    .optional(),

  phone_number: z
    .string()
    .refine(
      (val) =>
        val === "" || val === null || (val.length === 10 && /^\d+$/.test(val)),
      { message: "Phone number must be exactly 10 digits" }
    )
    .transform((val) => (val === "" || val === null ? undefined : val))
    .optional(),

  line_id: z.string().max(20).optional(),
  right: z.string().max(20).optional(),
  job_title: z.string().max(50).optional(),
  addr_number: z.string().max(10).optional(),
  addr_alley: z.string().max(50).optional(),
  addr_street: z.string().max(100).optional(),
  addr_subdistrict: z.string().max(50).optional(),
  addr_district: z.string().max(50).optional(),
  addr_province: z.string().max(50).optional(),
  addr_postcode: z.string().min(0).max(5).optional(),
  employee_image: z.array(z.any().optional()),
  position: z.string().max(20).optional(),
  remark: z.string().max(255).optional(),
});

export const UpdateUserSchema = z.object({
  username: z.string().min(4).max(50),

  password: z.string().max(255).optional(),

  email: z.string().max(50).email("กรุณาระบุอีเมล"),

  role_id: z.string().uuid().optional(),
  company_id: z
    .string()
    .uuid()
    .optional()
    .transform((val) => (val === null || val === undefined ? "" : val)),

  first_name: z.string().max(20).optional(),
  employee_code: z.string().max(20).optional(),
  last_name: z.string().max(20).optional(),

  birthday: z
    .string()
    .refine(
      (val) => val === "" || val === null || /^\d{4}-\d{2}-\d{2}$/.test(val),
      { message: "Invalid date format" }
    )
    .transform((val) => (val === "" || val === null ? undefined : val))
    .optional(),

  phone_number: z
    .string()
    .refine(
      (val) =>
        val === "" || val === null || (val.length === 10 && /^\d+$/.test(val)),
      { message: "Phone number must be exactly 10 digits" }
    )
    .transform((val) => (val === "" || val === null ? undefined : val))
    .optional(),

  line_id: z.string().max(20).optional(),
  right: z.string().max(20).optional(),
  job_title: z.string().max(50).optional(),
  addr_number: z.string().max(10).optional(),
  addr_alley: z.string().max(50).optional(),
  addr_street: z.string().max(100).optional(),
  addr_subdistrict: z.string().max(50).optional(),
  addr_district: z.string().max(50).optional(),
  addr_province: z.string().max(50).optional(),
  addr_postcode: z.string().min(0).max(5).optional(),
  employee_image: z.array(z.any().optional()),
  position: z.string().max(20).optional(),
  remark: z.string().max(255).optional(),
});
