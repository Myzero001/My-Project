export type Type_MS_REPAIR_RECEIPT_LIST_REPAIR_All = {
    quotation_id: string;
    master_repair_id: string;
    master_repair_receipt_id: string;
    price: number;
    status: string;
    sending_status?: string;
    barcode?: string;
    created_at?: Date;
    updated_at?: Date;
    status_date?: string;
    status_by?: string;
  };
  
  export type Type_MS_REPAIR_RECEIPT_LIST_REPAIR = {
    id: string;
    quotation_id: string;
    master_repair_id: string;
    master_repair_receipt_id: string;
    price: number;
    status: string;
    sending_status?: string;
    barcode?: string;
    created_at: string;
    updated_at: string;
    status_date?: string;
    status_by?: string;
  };
  
  export type MS_REPAIR_RECEIPT_LIST_REPAIR_Response = {
    success: boolean;
    message: string;
    responseObject: Type_MS_REPAIR_RECEIPT_LIST_REPAIR;
    statusCode: number;
  };
  
  export type MS_REPAIR_RECEIPT_LIST_REPAIR_All_Response = {
    success: boolean;
    message: string;
    responseObjects: Type_MS_REPAIR_RECEIPT_LIST_REPAIR_All[];
    statusCode: number;
  };  