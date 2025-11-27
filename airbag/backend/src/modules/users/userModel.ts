import { z } from "zod";

export type TypePayloadUser = {
  employee_id: string;
  employee_code: string;
  company_id?: string;
  company?: string;
  username: string;
  password: string;
  is_active: boolean;
  role?: string;
  role_id?: string;
  job_title?: string;
  right?: string;
  email: string;
  first_name: string;
  last_name?: string;
  birthday?: string;
  phone_number?: string;
  line_id?: string;
  addr_number?: string;
  addr_alley?: string;
  addr_street?: string;
  addr_subdistrict?: string;
  addr_district?: string;
  addr_province?: string;
  addr_postcode?: string;
  position?: string;
  remark?: string;
  employee_image?: string;
  created_by?: string; // จำเป็นต้องมีฟิลด์นี้
  updated_by?: string; // จำเป็นต้องมีฟิลด์นี้
  created_at: Date;
  updated_at?: Date;
  //deleted_at?: Date
  //created_at       :stri
  //created_by       :string
  //updated_at       DateTime?
  //updated_by       :string
};

// const Role = z.enum(["Admin", "User", "User-Box", "Owner", "Manager", "Technician", "Sale"]);

export const CreateUserSchema = z.object({
  body: z.object({
    username: z.string().min(4).max(50),
    password: z
      .string()
      .min(4)
      .max(255)
      .optional(),

      role_id: z.string().uuid().optional(),

    
    
      company_id: z
      .string()
      //.uuid()
      .optional()
      .transform((val) => (val === null || val === undefined ? "" : val)),

    email: z.string().max(50).email("กรุณาระบุอีเมล").optional(),
    first_name: z.string().max(20).optional(),
    employee_code: z.string().max(20).optional(),
    last_name: z.string().max(20).optional(),


      birthday: z
  .string()
  .refine(val => 
    val === '' || val === null || /^\d{4}-\d{2}-\d{2}$/.test(val), 
    { message: "Invalid date format" }
  )
  .transform(val => val === '' || val === null ? undefined : val)
  .optional(),


  phone_number: z
  .string()
  .refine(val => 
    val === '' || val === null || 
    (val.length === 10 && /^\d+$/.test(val)), 
    { message: "Phone number must be exactly 10 digits" }
  )
  .transform(val => val === '' || val === null ? undefined : val)
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
    image_url: z.string().optional(),

    position: z.string().max(20).optional(),
    remark: z.string().max(255).optional(),
  
  }),
});

export const LoginUserSchema = z.object({
  body: z.object({
    username: z.string().min(4).max(50),
    password: z.string().min(4).max(50),
  }),
});


export const UpdateUserSchema = z.object({
  params: z.object({
    employee_id: z.string().uuid(),
  }),
});

export const GetUserSchema = z.object({
  params: z.object({
    employee_id: z.string().uuid(),
  }),
});
