export type Address = {
    number: string;
    alley: string;
    street: string;
    subdistrict: string;
    district: string;
    province: string;
    postcode: string;
};

export type ClaimItem = {
    receive_for_a_claim_list_id: string;
    receive_for_a_claim_doc: string | null;
    repair_receipt_doc: string | null;
    master_repair_name: string;
    master_repair_id: string;
    repair_receipt_id: string;
    price: number;
    remark: string;
    finish: boolean;
    finish_by_receipt_doc: string | null;
    claim_date: Date | null;
};

export type SendForClaimItem = {
    send_for_a_claim_list_id: string;
    repair_receipt_doc: string | null;
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
        claim_date: Date | null;
        receive_for_a_claim_id: string;
    } | null;
};

export type TypeReceiveForAClaimPayload = {
    receive_for_a_claim_id: string;
    receive_for_a_claim_doc: string;
    send_for_a_claim_id: string;
    send_for_a_claim_doc: string;
    supplier_delivery_note_doc: string | null;
    receipt_doc: string | null;
    claim_date: Date | null;
    due_date: Date | null;
    receive_date: Date;
    contact_name: string;
    contact_number: string;
    address: Address;
    supplier_name: string;
    supplier_code: string;
    status: string;
    claim_items: ClaimItem[];
    send_for_claim_items: SendForClaimItem[];
};

export type TypeReceiveForAClaimPayloadList = TypeReceiveForAClaimPayload[];

export type ResponsePayloadItem = {
    receive_for_a_claim_doc: string;
    receive_for_a_claim_id: string;
    claim_date: string | null;
    master_supplier: {
        supplier_code: string;
        supplier_name: string;
    };
    send_for_a_claim: {
        send_for_a_claim_doc: string;
        send_for_a_claim_id: string;
        supplier_repair_receipt: {
            receipt_doc: string;
            supplier_delivery_note: {
                supplier_delivery_note_doc: string;
            };
        };
    };
};

// เพิ่ม type สำหรับ responseObject ที่มี data และ totalCount
export type ReceiveForAClaimResponseObject = {
    data: ResponsePayloadItem[];
    totalCount: number;
    totalPages: number;
};

// แก้ไข type ของ responseObject ใน ReceiveForAClaimResponse
export type ReceiveForAClaimResponse = {
    success: boolean;
    message: string;
    responseObject: ReceiveForAClaimResponseObject;
    statusCode: number;
};

export type SingleReceiveForAClaimResponse = {
    success: boolean;
    message: string;
    responseObject: TypeReceiveForAClaimPayload;
    statusCode: number;
};

export type SendForAClaimDoc = {
    send_for_a_claim_id: string;
    send_for_a_claim_doc: string;
};

export type SendForAClaimDocResponseObject = {
    data: SendForAClaimDoc[];
};

export type SendForAClaimDocResponse = {
    success: boolean;
    message: string;
    responseObject: SendForAClaimDocResponseObject;
    statusCode: number;
};

export type ReceiveForAClaimSelectItem = {
  send_for_a_claim_id: string;
  send_for_a_claim_doc: string;
};
  
export type ReceiveForAClaimSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: ReceiveForAClaimSelectItem[];
  };
  statusCode: number;
};