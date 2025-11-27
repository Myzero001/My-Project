export interface Type_MS_CompaniesL_All {
  company_id?: string;
  company_name: string;
  company_code: string;
  company_tin?: string;
  company_address?: string;
  company_main?: boolean;
  tax_status?:string;
  tel_number?: string;
  addr_number?: string;
  addr_alley?: string;
  addr_street?: string;
  addr_subdistrict?: string;
  addr_district?: string;
  addr_province?: string;
  addr_postcode?: string;
  promtpay_id?: string;
}

export type Type_MS_Companies = {
  company_id?: string;
  company_code?: string;
  company_tin?: string;
  company_name?: string;
  company_address?: string;
  company_main?: boolean;
  tax_status: string;
  tel_number?: string;
  created_by?: string;
  updated_by?: string;
  totalCount?: number;
  addr_number?: string;
  addr_alley?: string;
  addr_street?: string;
  addr_subdistrict?: string;
  addr_district?: string;
  addr_province?: string;
  addr_postcode?: string;
  promtpay_id?: string;
};

export type Type_MS_Companies_Response = {
  company_id: string;
  company_code: string;
  company_name: string;
  //company_address: string;
  tel_number: string;
  company_main: boolean;
  tax_status: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  totalCount: number;
  success: boolean;
  message: string;
  responseObject: Type_MS_Companies;
  statusCode: number;
  company_tin?: string;
  
  addr_number?: string;
  addr_alley?: string;
  addr_street?: string;
  addr_subdistrict?: string;
  addr_district?: string;
  addr_province?: string;
  addr_postcode?: string;
  promtpay_id?: string;
};
