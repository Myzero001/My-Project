export type ClaimItem = {
    receive_for_a_claim_list_id: string;
    receive_for_a_claim_doc: string;
    repair_receipt_doc: string;
    master_repair_name: string;
    master_repair_id: string;
    repair_receipt_id: string;
    price: number;
    remark: string;
    finish: boolean;
    finish_by_receipt_doc: string | null;
    claim_date: string | null;
};

export type SendForClaimItem = {
    send_for_a_claim_list_id: string;
    repair_receipt_doc: string;
    master_repair_name: string;
    master_repair_id: string;
    repair_receipt_id: string;
    price: number;
    remark: string;
    receive_for_a_claim_list: {
        receive_for_a_claim_list_id: string;
        price: number;
        remark: string;
        finish: boolean;
        finish_by_receipt_doc: string | null;
        claim_date: string | null;
        receive_for_a_claim_id: string;
    };
};

export type TypeReceiveForAClaimPayload = {
    receive_for_a_claim_id: string;
    receive_for_a_claim_doc: string;
    send_for_a_claim_id: string;
    send_for_a_claim_doc: string;
    supplier_delivery_note_doc: string;
    receive_for_a_claim_list_doc: string;
    receipt_doc: string;
    claim_date: string; // แก้จาก Date เป็น string ตามข้อมูลที่ได้
    due_date: string | null; // แก้จาก Date เป็น string เนื่องจากข้อมูลที่ได้มาเป็น null
    receive_date: string; // แก้จาก Date เป็น string ตามข้อมูลที่ได้
    contact_name: string;
    contact_number: string;
    supplier_name: string;
    supplier_code: string;
    status: string;
    claim_items: ClaimItem[];
    send_for_claim_items: SendForClaimItem[];
};

export type TypeReceiveForAClaimPayloadList = TypeReceiveForAClaimPayload[];

export type ReceiveForAClaimResponse = {
    success: boolean; // เพิ่ม success ตามข้อมูลที่ได้
    message: string;
    responseObject: TypeReceiveForAClaimPayloadList;
    statusCode: number;
};

export type SingleReceiveForAClaimResponse = {
    success: boolean; // เพิ่ม success ตามข้อมูลที่ได้
    message: string;
    responseObject: TypeReceiveForAClaimPayload;
    statusCode: number;
};