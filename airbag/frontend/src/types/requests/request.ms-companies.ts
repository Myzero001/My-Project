import { z } from "zod";
export type PayLoadCreateMsCompanies = {
  company_id?: string | undefined;
  company_code?: string | undefined;
  company_name: string | undefined;
  company_tin?: string | undefined;
  tel_number?: string | undefined;
  tax_status?: string ;
  addr_number?: string | undefined;
  addr_alley?: string | undefined;
  addr_street?: string | undefined;
  addr_subdistrict?: string | undefined;
  addr_district?: string | undefined;
  addr_province?: string | undefined;
  addr_postcode?: string | undefined;
  promtpay_id?: string;
};
export type PayLoadeditMsCompanies = {
  company_id?: string | undefined;
  company_code?: string | undefined;
  company_name?: string | undefined;
  
  tel_number?: string | undefined;
  company_tin?: string | undefined;
  promtpay_id?: string;
  //company_main?: boolean;
  tax_status?: string;
  addr_number?: string;
  addr_alley?: string;
  addr_street?: string;
  addr_subdistrict?: string;
  addr_district?: string;
  addr_province?: string;
  addr_postcode?: string;
  
};

export const UpdateCompaniesSchema = z.object({
  company_name: z.string().max(50).optional(), // Optional แต่ควรมีค่าหรือไม่ได้กรอกก็ได้
  company_code: z.string().max(50).optional(),
 // company_address: z.string().max(50).optional(),
  tax_status: z.string().optional(),
  company_tin: z.string().max(13).optional(),
  tel_number: z.string().max(10).optional(),
  addr_number: z.string().max(10),
  addr_alley: z.string().max(50),
  addr_street: z.string().max(100),
  addr_subdistrict: z.string().max(50),
  addr_district: z.string().max(50),
  addr_province: z.string().max(50),
  addr_postcode: z.string().max(5),
  promtpay_id: z.string().max(13).optional(),
});

