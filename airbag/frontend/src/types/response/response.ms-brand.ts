export type Type_MS_BRAND_All = {
  brand_name: string;
  master_brand_id: string;
};

export type Type_MS_BRAND = {
  master_brand_id: string;
  company_id: string;
  brand_name: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
};

export type MS_BRAND_Response = {
  success: boolean;
  message: string;
  responseObject: Type_MS_BRAND;
  statusCode: number;
};

export type BrandSelectItem = {
  master_brand_id: string;
  brand_name: string;
};
  
export type BrandSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: BrandSelectItem[];
  };
  statusCode: number;
};