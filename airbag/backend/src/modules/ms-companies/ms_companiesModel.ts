import { z } from "zod";

export interface TypePayloadMastercompanies {
  company_name: string;
  company_code?: string;
  tax_status?: string;
  tel_number?: string;
  created_by?: string;
  updated_by?: string;
  company_tin?: string;
  addr_number?: string;
  addr_alley?: string;
  addr_street?: string;
  addr_subdistrict?: string;
  addr_district?: string;
  addr_province?: string;
  addr_postcode?: string;
  promtpay_id?: string;
}

export const GetCompaniesSchema = z.object({
  params: z.object({
    company_id: z.string().uuid(),
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

export const CreateCompaniesSchema = z.object({
  body: z.object({
    company_name: z.string().max(50), // ชื่อบริษัท
    company_code: z.string().max(50),
    tax_status: z.string().optional(),
    tel_number: z
      .string()
      .max(10)
      .optional(),
    company_tin: z.string().max(13).optional(),
    addr_number: z.string().max(10),
    addr_alley: z.string().max(50),
    addr_street: z.string().max(100),
    addr_subdistrict: z.string().max(50),
    addr_district: z.string().max(50),
    addr_province: z.string().max(50),
    addr_postcode: z.string().max(5),
    promtpay_id: z.string().max(13).optional(),
    //conpany_code: z.string().max(50),
    //company_main: z.boolean(),  // สถานะหลักของบริษัท
  }),
});

export const UpdateCompaniesSchema = z.object({
  body: z.object({
    company_name: z.string().max(50).optional(), // ชื่อบริษัท
    company_code: z.string().max(50).optional(),
    tax_status: z.string().optional(),
    tel_number: z
      .string()
      .max(10)
      .optional(),
    company_tin: z.string().max(13).optional(),

    
    addr_number: z.string().max(10).optional(),
    addr_alley: z.string().max(50).optional(),
    addr_street: z.string().max(100).optional(),
    addr_subdistrict: z.string().max(50).optional(),
    addr_district: z.string().max(50).optional(),
    addr_province: z.string().max(50).optional(),
    addr_postcode: z.string().max(5).optional(),
    company_main: z.boolean().optional(),  // สถานะหลักของบริษัท
    promtpay_id: z.string().max(13).optional(),
    //updated_by: z.string().max(50),
  }),
});
