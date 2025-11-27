export type MS_CUSTOMER_ALL = {
  
  customer_id: string;
  customer_code: string; // ฟิลด์ที่จำเป็นต้องมี
  customer_prefix?: string; // ฟิลด์ที่อาจไม่มี
  customer_name: string;
  customer_position: string;
  contact_name?: string;
  contact_number?: string;
  line_id?: string;
  addr_map?: string;
  addr_number?: string;
  addr_alley?: string;
  addr_street?: string;
  addr_subdistrict?: string;
  image_url: string | null;
  addr_district?: string;
  addr_province?: string;
  addr_postcode?: string;
  payment_terms?: string;
  payment_terms_day?: number;
  tax?: number;
  comment_customer?: string;
  comment_sale?: string;
  competitor?: string;
  created_by: string; // จำเป็นต้องมีฟิลด์นี้
  updated_by: string; // จำเป็นต้องมีฟิลด์นี้
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null; // ฟิลด์อาจเป็น null หรือ undefined
  deleted_by?: string | null; // ฟิลด์อาจเป็น null หรือ undefined
  customer_tin?: string
};

export type TypeCustomerAllresponse = {
  customer_id: string;
  customer_code: string;
  customer_name: string;
  contact_name?: string;
  created_at?: string;
  contact_number?: string;
};

export type typeCustomerResponse = {
    responseObject:{
        totalCount: number;
        data: TypeCustomerAllresponse[]
    };
    success: boolean
};

export type CustomerResponse = {
    success: boolean;
    message: string;
    responseObject: {
      totalCount: number;
      data: TypeCustomerAllresponse[]; // Array
    };
    statusCode: number;
  };

export type CustomerSelectItem = {
  customer_id: string;
  customer_code: string;
};
  
export type CustomerSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: CustomerSelectItem[];
  };
  statusCode: number;
};

export type CreateCustomerSuccessResponse = {
  success: boolean;
  message: string;
  responseObject: MS_CUSTOMER_ALL;
  statusCode: number;
};