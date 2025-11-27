export type TypeSupplierDeliveryNoteListAll = {
    supplier_delivery_note_id: string,
    supplier_delivery_note_doc: string,
    date_of_submission?: Date,
    due_date?: Date,
    amount?: number,
    status?: string,
    addr_number?: string,
    addr_alley?: string,
    addr_street?: string,
    addr_subdistrict?: string,
    addr_district?: string,
    addr_province?: string,
    addr_postcode?: string,
    contact_name?: string,
    contact_number?: string,
    payment_terms?: string,
    payment_terms_day?: number,
    remark?: string,
    master_supplier?: {
        supplier_id: string,
        supplier_code: string,
        supplier_name: string,
    },
    repair_receipts?: {
        repair_receipt_id: string,
        repair_receipt_doc: string,
        repair_receipts?: {
            supplier_delivery_note_repair_receipt_list_id: string,
            repair_receipt_id: string,
            master_repair_id: string,
            master_repair_name: string,
            price: number,
            quantity: number,
            total_price: number,
            status: string,
            created_at: string,
            created_by: string,
            updated_at: string,
            updated_by: string,
            company_id: string,
        }[]
    }[]
};


export type TypeSupplierDeliveryNoteList = {
    supplier_delivery_note_id: string,
    supplier_delivery_note_doc: string,
    date_of_submission?: Date,
    due_date?: Date,
    amount?: number,
    status?: string,
    addr_number?: string,
    addr_alley?: string,
    addr_street?: string,
    addr_subdistrict?: string,
    addr_district?: string,
    addr_province?: string,
    addr_postcode?: string,
    contact_name?: string,
    contact_number?: string,
    payment_terms?: string,
    payment_terms_day?: number,
    remark?: string,
    master_supplier?: {
        supplier_id: string,
        supplier_code: string,
        supplier_name: string,
    },
    repair_receipts: {
        repair_receipt_id: string,
        repair_receipt_doc: string,
        repair_receipts: {
            supplier_delivery_note_repair_receipt_list_id: string,
            repair_receipt_id: string,
            master_repair_id: string,
            master_repair_name: string,
            price: number,
            quantity: number,
            total_price: number,
            status: string,
            created_at: string,
            created_by: string,
            updated_at: string,
            updated_by: string,
            company_id: string,
        }[]
    }[]
};


export type SDNListResponse = {
    message: string,
    responseObject: TypeSupplierDeliveryNoteList,
    statusCode: number;
}

export type TypeSDNandRRidSelectAll = {
    supplier_delivery_note_repair_receipt_list_id: string
    supplier_delivery_note_id: string
    repair_receipt_id: string
    master_repair_id: string
    price: number
    quantity: number
    total_price: number
    status: string
    master_repair?: {
        master_repair_id: string
        master_repair_name: string,
    }
}
export type TypeSDNandRRidSelect = {
    supplier_delivery_note_repair_receipt_list_id: string
    supplier_delivery_note_id: string
    repair_receipt_id: string
    master_repair_id: string
    price: number
    quantity: number
    total_price: number
    status: string
    disabled: boolean
    master_repair?: {
        master_repair_id: string
        master_repair_name: string,
    }
}
export type SDNandRRidSelectResponse = {
    message: string,
    responseObject: TypeSDNandRRidSelect,
    statusCode: number;
}
