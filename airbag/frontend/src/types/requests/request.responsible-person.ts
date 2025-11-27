export enum ResponsiblePersonType {
    QUOTATION = "QUOTATION",
    REPAIR = "REPAIR",
    SUBMIT_SUB = "SUBMIT_SUB", // Supplier Delivery Note
    RECEIVE_SUB = "RECEIVE_SUB", // Supplier Repair Receipt
    SUBMIT_CLAIM = "SUBMIT_CLAIM", // Send For a Claim
    RECEIVE_CLAIM = "RECEIVE_CLAIM", // Receive For a Claim
  }

  export type PayLoadCreateResponsiblePerson = {
    type: ResponsiblePersonType;
    docno: string; // เลขที่เอกสารต้นทาง (เช่น QTNo, RPNo)
    change_date: Date;
    before_by_id: string;
    after_by_id: string;
    quotation_id?: string;
    master_repair_receipt_id?: string;
    supplier_delivery_note_id?: string;
    supplier_repair_receipt_id?: string;
    send_for_a_claim_id?: string;
    receive_for_a_claim_id?: string;
  };

  export interface PayLoadUpdateResponsiblePerson {
    log_id: string;
    docno?: string; // optional: ถ้าต้องการแก้เลขที่ log
    before_by_id?: string; // optional: ถ้าต้องการแก้
    after_by_id?: string;
  }

export interface RequestUpdateRepairReceipt {
    id: string;
    responsible_by: string;
  }