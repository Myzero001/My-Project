
export interface SupplierRepairReceiptListResponse {
    success: boolean;
    message: string;
    responseObject: SupplierRepairReceiptList | null;
    statusCode: number;
}

export interface SupplierRepairReceiptListsResponse {
    success: boolean;
    message: string;
    responseObject: {
        data: SupplierRepairReceiptList[];
        totalCount: number;
        totalPages: number;
    } | null;
    statusCode: number;
}

export interface SupplierRepairReceiptList {
    id: string; // This is supplier_repair_receipt_lists_id
    supplier_repair_receipt_id: string;
    supplier_delivery_note_id: string;
    repair_receipt_id?: string;
    master_repair_id?: string;
    supplier_delivery_note_repair_receipt_list_id?: string;
    price?: number;
    quantity?: number;
    total_price?: number;
    status?: string;
    finish?: boolean;
    finish_by_receipt_doc?: string | null; // Added null possibility
    company_id?: string;
    created_at: Date;
    created_by?: string;
    updated_at?: Date;
    updated_by?: string;
    supplier_repair_receipt?: {
        id: string;
        receipt_doc?: string;
        repair_date_supplier_repair_receipt?: Date;
        status?: string;
    };
    master_repair?: {
        master_repair_name?: string;
        master_group_repair_id?: string;
    };
    master_repair_receipt?: {
        repair_receipt_doc?: string;
    };
    supplier_delivery_note?: {
        supplier_delivery_note_doc?: string;
        date_of_submission?: Date;
    };
}

export interface PayloadListsResponse {
    success: boolean;
    message: string;
    responseObject: PayloadListResponse[] | null;
    statusCode: number;
}

export interface PayloadListResponse {
    id: string; // This is supplier_repair_receipt_id
    receipt_doc?: string;
    supplier_delivery_note_doc?: string;
    date_of_submission?: Date | string; // Support both Date and string formats
    repair_date_supplier_repair_receipt?: Date | string | null; // Support null values
    supplier_name?: string;
    supplier_code?: string;
    status?: string;
    repair_items: RepairItem[]; // Items currently ON this specific repair receipt
    delivery_note_repair_items: DeliveryNoteRepairItem[]; // ALL items from the original delivery note
}

export interface RepairItem {
    supplier_repair_receipt_lists_id: string;
    receipt_doc?: string; // supplier_repair_receipt.receipt_doc
    repair_receipt_doc?: string; // master_repair_receipt.repair_receipt_doc
    master_repair_name?: string;
    master_repair_receipt_id?: string;
    master_repair_id?: string;
    price?: number;
    quantity?: number;
    total_price?: number;
    finish?: boolean;
    finish_by_receipt_doc?: string | null; // Added null possibility
}

export interface DeliveryNoteRepairItem {
    supplier_delivery_note_repair_receipt_list_id: string; // ID of the item on the delivery note
    repair_receipt_doc?: string;
    master_repair_name?: string;
    master_repair_receipt_id?: string;
    master_repair_id?: string;
    price?: number; // Original price/quantity from delivery note might differ
    quantity?: number;
    total_price?: number;
    status?: string; // Status on delivery note
    supplier_repair_receipt_list: { // Details if it HAS been added to a repair receipt
        id: string; // This is the supplier_repair_receipt_lists_id
        price?: number; // Price used on the repair receipt
        quantity?: number;
        total_price?: number;
        finish?: boolean;
        finish_by_receipt_doc?: string | null;
        supplier_repair_receipt_id: string; // ID of the receipt it's linked to
    } | null; // Is null if not yet added to ANY supplier repair receipt
}