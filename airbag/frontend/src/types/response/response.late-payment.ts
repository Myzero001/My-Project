export type TypePaymentDetail = {
    payment_doc: string;
    price: number;
    payment_date: Date;
    option_payment: string;
    type_money: string;
    status: string;
  };
  
  export type TypeQuotationInfo = {
    quotation_doc: string;
    customer_name: string;
  };
  
  export type TypeRepairReceipt = {
    repair_receipt_doc: string;
    quotation_info: TypeQuotationInfo;
    total_price: number;
  };
  
  export type TypePaymentSummary = {
    total_paid: number;
    remaining_amount: number;
    payment_percentage: number;
    last_payment_date: string | null;
    total_price: number;
  };
  
  export type TypeLatePayment = {
    id: string;
    delivery_schedule_doc: string;
    delivery_location: string;
    delivery_schedule_image_url: string;
    remark: string;
    addr_alley: string;
    addr_district: string;
    addr_number: string;
    addr_postcode: string;
    addr_province: string;
    addr_street: string;
    addr_subdistrict: string;
    company_id: string;
    contact_number: string;
    created_at: string;
    created_by: string;
    customer_name: string;
    line_id: string;
    master_payment: TypeMasterPayment[];
    master_repair_receipt: TypeMasterRepairReceipt;
    master_quotation: TypeLatePaymentQuotation[];
    position: string;
    remainingBalance: number;
    repair_receipt_id: string;
    status: string;
    updated_at: string;
    updated_by: string;
  };

  export type TypeLatePaymentQuotation = {
    quotation_doc: string;
    customer_name: string;
    master_customer: TypeLatePaymentCustomer[]
  }

  export type TypeLatePaymentCustomer = {
    contact_name: string;
    customer_code: string;
  }
  
  export type TypeLatePaymentAll = {
    total_records: number;
    total_late_amount: number;
    late_payments: TypeLatePayment[];
  };
  
  export type TypeLatePaymentResponse = {
    success: boolean;
    message: string;
    responseObject: PaginatedLatePaymentResponse;
    statusCode: number;
  };
  
  export type TypeLatePaymentDetail = {
    repair_receipt_details: {
      id: string;
      repair_receipt_doc: string;
      total_price: number;
      master_quotation: {
        quotation_doc: string;
        customer_name: string;
      };
      master_delivery_schedule?: Array<{
        id: string;
        delivery_schedule_doc: string;
        status: string;
      }>;
    };
    payments: {
      id: string;
      payment_doc: string;
      price: number;
      status: string;
      option_payment: string;
      type_money?: string;
      created_at: string;
      master_delivery_schedule: {
        id: string;
        master_repair_receipt: {
          id: string;
          repair_receipt_doc: string;
          total_price: number;
        };
      };
    }[];
    delivery_schedule_status?: string;
    expected_delivery_date?: string;
    payment_summary: {
      total_paid: number;
      total_price: number;
      remaining_amount: number;
    };
    remainingBalance?: number;
  };
  
  export type TypeLatePaymentDetailResponse = {
    success: boolean;
    message: string;
    responseObject: TypeLatePaymentDetail;
    statusCode: number;
  };  

  export type TypeMasterRepairReceipt = {
    id: string;
    repair_receipt_at: string | null;
    estimated_date_repair_completion: string | null;
    expected_delivery_date: string | null;
    repair_receipt_doc: string;
    quotation_doc?: string;
    total_price?: number;
    master_quotation?: {
      customer_name: string;
      quotation_doc: string;
      quotation_id: string;
      master_customer?: {
        contact_name: string;
        customer_code: string;
      }
    };
  };

  export type TypeMasterPayment = {
    id: string;
    payment_doc?: string;
    price?: number;
    payment_date?: string;
    option_payment?: string;
    type_money?: string;
    status?: string;
  };

  export type PaginatedLatePaymentResponse = {
    data: TypeLatePayment[]; // Array ของข้อมูล
    total: number;             // จำนวนข้อมูลทั้งหมด
    page: number;              // หน้าปัจจุบัน
    pageSize: number;          // ขนาดของหน้า
  };