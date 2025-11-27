export type TypeSupplierRepairReceiptAll = {
    id: string,
    supplier_repair_receipt_id: string,
    receipt_doc?: string,
    repair_date_supplier_repair_receipt?: Date,
    supplier_delivery_note_id: string,
    supplier_id?: string,
    company_id?: string,
    master_repair_receipt_id?: string,
    supplier_delivery_note_repair_receipt_list_id?: string,
    master_repair_id?: string,
    repair_receipt_list_repair_id?: string,
    status?: string,
    remark?: string,
    created_at: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string,
    supplier_repair_receipt_lists?: {
        id: string,
        supplier_repair_receipt_id: string,
        supplier_delivery_note_id: string,
        repair_receipt_id?: string,
        master_repair_id?: string,
        supplier_delivery_note_repair_receipt_list_id?: string,
        price?: number,
        quantity?: number,
        total_price?: number,
        status?: string,
        master_repair?: {
            master_repair_id: string,
            repair_name: string,
            repair_code: string,
        },
        master_repair_receipt?: {
            id: string,
            receipt_doc: string,
        }
    }[],
    master_supplier?: {
        supplier_id: string,
        supplier_code: string,
        supplier_name: string,
        contact_name?: string,
        contact_number?: string,
        payment_terms?: string,
        payment_terms_day?: number
    },
    supplier_delivery_note?: {
        supplier_delivery_note_id: string,
        supplier_delivery_note_doc: string,
        amount: number,
        supplier_delivery_note_repair_receipt_list?: {
            supplier_delivery_note_repair_receipt_list_id: string,
            master_repair?: {
                master_repair_id: string,
                repair_name: string,
                repair_code: string
            },
            master_repair_receipt?: {
                id: string,
                receipt_doc: string
            }
        }[]
    },
    repair_items?: {
        supplier_repair_receipt_lists_id: string,
        receipt_doc: string,
        repair_receipt_doc: string,
        master_repair_name: string,
        master_repair_receipt_id: string,
    }[],
}

export type TypeSupplierRepairReceipt = {
    id: string,
    receipt_doc?: string,
    repair_date_supplier_repair_receipt?: Date,
    supplier_delivery_note_id: string,
    supplier_id?: string,
    company_id?: string,
    master_repair_receipt_id?: string,
    supplier_delivery_note_repair_receipt_list_id?: string,
    master_repair_id?: string,
    repair_receipt_list_repair_id?: string,
    status?: string,
    remark?: string,
    created_at: Date,
    created_by?: string,
    updated_at?: Date,
    updated_by?: string,
    master_supplier?: {
        supplier_id: string,
        supplier_code: string,
        supplier_name: string
    }
}

export type TypeSupplierRepairReceiptPayLoad = {
    receipt_doc?: string,
    supplier_delivery_note_doc: string,
    date_of_submission: string,
    repair_date_supplier_repair_receipt?: Date,
    supplier_name: string,
    amount: number,
}

export type SupplierRepairReceiptResponse = {
    message: string,
    responseObject: TypeSupplierRepairReceipt,
    statusCode: number
}

export type TypeMasterSupplierId = {
    supplier_id: string
}

export type SupplierRepairReceiptSelectItem = {
  id: string;
  receipt_doc: string;
};
  
export type SupplierRepairReceiptSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: SupplierRepairReceiptSelectItem[];
  };
  statusCode: number;
};