// --- START OF FILE request.supplier-repair-receipt-list.ts ---
export interface GetSupplierRepairReceiptListRequest {
    page?: number;
    pageSize?: number;
    searchText?: string;
}

export interface CreateSupplierRepairReceiptListRequest {
    supplier_repair_receipt_id: string;
    supplier_delivery_note_id: string;
    repair_receipt_id: string;
    master_repair_id: string;
    supplier_delivery_note_repair_receipt_list_id: string; // Made mandatory
    price?: number;
    quantity?: number;
    status: string;
}

export interface UpdateSupplierRepairReceiptListRequest extends Omit<CreateSupplierRepairReceiptListRequest, 'supplier_repair_receipt_id' | 'supplier_delivery_note_id' | 'repair_receipt_id' | 'master_repair_id' | 'status'> {
    id: string;
}


export interface GetByIdRequest {
    supplier_delivery_note_repair_receipt_list_id: string;
}

export interface DeleteRequest {
    supplier_delivery_note_repair_receipt_list_id: string;
}

export interface UpdateFinishStatusRequest {
    finish: boolean;
    finish_by_receipt_doc?: string | null;
    supplier_repair_receipt_id?: string;
}

export interface UpdateRepairDateRequest {
    id: string; // supplier_repair_receipt_id
    repair_date_supplier_repair_receipt: string;
}