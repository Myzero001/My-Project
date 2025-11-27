import {
  CREATE_RESPONSIBLE_PERSON,
  GET_RESPONSIBLE_PERSONS,
  UPDATE_RESPONSIBLE_PERSON,
  GET_RESPONSIBLE_PERSON_BY_ID,
  GET_RESPONSIBLE_PERSON_TYPE,
  GET_REPAIR_RECEIPT_DOCS_AND_IDS,
  GET_SUPPLIER_DELIVERY_NOTE_DOCS_AND_IDS,
  GET_SUPPLIER_REPAIR_RECEIPT_DOCS_AND_IDS,
  GET_SEND_CLAIM_DOCS_AND_IDS,        
  GET_RECEIVE_CLAIM_DOCS_AND_IDS,    
  GET_REPAIR_RECEIPT_RESPONSIBLE_USER,
  GET_SUPPLIER_DELIVERY_NOTE_RESPONSIBLE_USER,
  GET_SUPPLIER_REPAIR_RECEIPT_RESPONSIBLE_USER,
  GET_SEND_FOR_A_CLAIM_RESPONSIBLE_USER,
  GET_RECEIVE_FOR_A_CLAIM_RESPONSIBLE_USER,
  UPDATE_REPAIR_RECEIPT_RESPONSIBLE_ENDPOINT,
  UPDATE_REPAIR_RECEIVE,
  UPDATE_SUPPLIER_DELIVERY_NOTE,
  UPDATE_SUPPLIER_REPAIR_RECEIPT,
  UPDATE_SEND_FOR_A_CLAIM,
  UPDATE_RECEIVE_FOR_A_CLAIM,
  UPDATE_MASTER_REPAIR_RECEIPT_RESPONSIBLE,
} from "@/apis/endpoint.api";
import { RequestUpdateRepairReceipt } from "@/types/requests/request.responsible-person";
import { PayLoadUpdateSupplierDeliveryNote } from "@/types/requests/request.supplier-delivery-note";
import { PayLoadUpdateSupplierRepairReceiptForResponsiblePerson } from "@/types/requests/request.supplier-repair-receipt";
import { PayLoadUpdateSendForAClaim } from "@/types/requests/request.send-for-a-claim";
import { PayLoadUpdateReceiveForAClaimResponsible } from "@/types/requests/request.receive_for_a_claim";
import mainApi from "@/apis/main.api";
import {
  PayLoadCreateResponsiblePerson,
  PayLoadUpdateResponsiblePerson,
} from "@/types/requests/request.responsible-person";
import {
  ResponsiblePersonsApiResponse,
  SingleResponsiblePersonApiResponse,
  ResponsiblePersonTypesApiResponse,
  DocumentIdDocItem,
  ApiDocsResponse,
  ResponsibleUser,
  ApiResponsibleUserResponse,
  TypeResponsiblePersonAll, // Import TypeResponsiblePersonAll
} from "@/types/response/response.responsible-person";

interface ResponsiblePersonsServiceResponse {
  data: TypeResponsiblePersonAll[];
  totalCount: number;
  totalPages: number;
}

export const getResponsiblePersons = async (
  page: number = 1,
  pageSize: number = 1000
): Promise<ResponsiblePersonsServiceResponse> => {
  try {
    const { data: response } = await mainApi.get<ResponsiblePersonsApiResponse>(
      `${GET_RESPONSIBLE_PERSONS}?page=${page}&pageSize=${pageSize}`
    );

    if (!response?.success || !response?.responseObject?.data) {
      console.error(
        "SERVICE: Invalid response format from getResponsiblePersons API:",
        response
      );
      throw new Error("Invalid response format for getResponsiblePersons");
    }
    return {
      data: response.responseObject.data.map(log => ({
        ...log,
        change_date: new Date(log.change_date) // Ensure change_date is a Date object
      })),
      totalCount: response.responseObject.totalCount || 0,
      totalPages: response.responseObject.totalPages || 1,
    };
  } catch (error) {
    console.error("SERVICE: Error fetching responsible persons:", error);
    throw error;
  }
};

export const getResponsiblePersonsTypes = async (
  page: number,
  pageSize: number
): Promise<string[]> => {
  try {
    const { data: response } = await mainApi.get<ResponsiblePersonTypesApiResponse>(
      `${GET_RESPONSIBLE_PERSON_TYPE}?page=${page}&pageSize=${pageSize}` // อาจจะต้องใส่ companyId ถ้า API ต้องการ
    );
    if (response.success && Array.isArray(response.responseObject)) {
      const allStrings = response.responseObject.every(
        (item: any) => typeof item === "string"
      );
      if (allStrings) {
        return response.responseObject as string[];
      } else {
        console.error(
          "SERVICE: responseObject items are not all strings:",
          response.responseObject
        );
        return [];
      }
    } else {
      console.error(
        "SERVICE: Failed to fetch types or invalid format. Success:",
        response?.success,
        "IsArray:",
        Array.isArray(response?.responseObject)
      );
      return [];
    }
  } catch (error) {
    console.error("SERVICE: Error fetching responsible persons type:", error);
    return [];
  }
};

export const getResponsiblePersonById = async (
  logId: string, // companyId อาจจะไม่จำเป็นถ้า logId unique ทั่วโลก
  companyId?: string // ทำให้เป็น optional หรือเอาออกถ้าไม่ใช้
): Promise<TypeResponsiblePersonAll | null> => {
  try {
    const { data: response } = await mainApi.get<SingleResponsiblePersonApiResponse>(
      `${GET_RESPONSIBLE_PERSON_BY_ID}/${logId}` // API endpoint อาจจะเป็น /get/:log_id
    );
    if (response.success && response.responseObject) {
        return {
            ...response.responseObject,
            change_date: new Date(response.responseObject.change_date) // Ensure date object
        };
    } else {
      console.error(
        "SERVICE: Failed to fetch responsible person by ID or no data:",
        response.message
      );
      return null; // คืน null ถ้าไม่เจอหรือ error
    }
  } catch (error) {
    console.error("SERVICE: Error fetching responsible person by ID:", error);
    throw error;
  }
};

export const createResponsiblePerson = async (
  payload: PayLoadCreateResponsiblePerson
): Promise<any> => { // ควรมี Type สำหรับ response object จาก create
  try {
    // ตรวจสอบว่า change_date เป็น Date object ก่อนแปลง
    const changeDate = typeof payload.change_date === 'string'
        ? new Date(payload.change_date)
        : payload.change_date;

    const formattedPayload = {
      ...payload,
      change_date: changeDate.toISOString(), // Ensure date is ISO string
    };

    const response = await mainApi.post(
      CREATE_RESPONSIBLE_PERSON,
      formattedPayload
    );

    if (response.data.success) {
      return response.data.responseObject;
    } else {
      throw new Error(response.data.message || "Create responsible person log failed");
    }
  } catch (error: any) {
    console.error("SERVICE: Error creating responsible person log:", {
      message: error.message,
      response: error.response?.data,
      payload: payload,
    });
    throw error;
  }
};

export const updateResponsiblePerson = async (
  payload: PayLoadUpdateResponsiblePerson
): Promise<any> => {
  try {
    // Payload สำหรับ update log ควรมีเฉพาะ log_id และ fields ที่จะแก้
    // Backend จะจัดการเรื่อง change_date และ num
    const payloadToSend: Partial<PayLoadUpdateResponsiblePerson> = { log_id: payload.log_id };
    if (payload.docno) payloadToSend.docno = payload.docno;
    if (payload.before_by_id) payloadToSend.before_by_id = payload.before_by_id;
    if (payload.after_by_id) payloadToSend.after_by_id = payload.after_by_id;


    const response = await mainApi.patch( // หรือ PUT แล้วแต่ API design
      UPDATE_RESPONSIBLE_PERSON, // Endpoint นี้ควรรับ log_id ใน path หรือ body
      payloadToSend
    );
    if (response.data.success) {
      return response.data.responseObject;
    } else {
      throw new Error(response.data.message || "Update responsible person log failed");
    }
  } catch (error: any) {
    console.error("SERVICE: Error updating responsible person log:", {
      message: error.message,
      response: error.response?.data,
      payloadSent: payload,
    });
    throw error;
  }
};

// Helper function to transform API response for document lists
const transformToDocumentIdDocItems = (
  response: ApiDocsResponse,
  idFieldName: string, // ชื่อ key field สำหรับ ID ใน response object จาก API
  docFieldName: string // ชื่อ key field สำหรับ Document Number ใน response object จาก API
): DocumentIdDocItem[] => {
  if (response.success && Array.isArray(response.responseObject)) {
    return response.responseObject.map((item) => ({
      id: item[idFieldName] as string, // ใช้ idFieldName ที่ถูกต้อง
      doc: item[docFieldName] as string,
    })).filter(item => item.id !== undefined && item.doc !== undefined); // เพิ่ม filter กัน undefined
  }
  console.warn(`SERVICE: transformToDocumentIdDocItems received non-successful response or non-array responseObject for ${idFieldName}/${docFieldName}`, response);
  return [];
};

// Repair Receipt - ถูกต้องแล้ว (API ส่ง "id")
export const getRepairReceiptDocuments = async (): Promise<DocumentIdDocItem[]> => {
  try {
    const { data: response } = await mainApi.get<ApiDocsResponse>(GET_REPAIR_RECEIPT_DOCS_AND_IDS);
    return transformToDocumentIdDocItems(response, "id", "repair_receipt_doc");
  } catch (error) {
    console.error("Error fetching repair receipt documents:", error);
    throw error;
  }
};

// Supplier Delivery Note (Submit Sub) - แก้ไข idFieldName
export const getSupplierDeliveryNoteDocuments = async (): Promise<DocumentIdDocItem[]> => {
  try {
    const { data: response } = await mainApi.get<ApiDocsResponse>(GET_SUPPLIER_DELIVERY_NOTE_DOCS_AND_IDS);
    // API ส่ง "id" สำหรับ ID, และ "supplier_delivery_note_doc" สำหรับเลขที่เอกสาร
    return transformToDocumentIdDocItems(response, "id", "supplier_delivery_note_doc");
  } catch (error) {
    console.error("Error fetching supplier delivery note documents:", error);
    throw error;
  }
};

// Supplier Repair Receipt (Receive Sub) - ถูกต้องแล้ว (API ส่ง "id")
export const getSupplierRepairReceiptDocuments = async (): Promise<DocumentIdDocItem[]> => {
  try {
    const { data: response } = await mainApi.get<ApiDocsResponse>(GET_SUPPLIER_REPAIR_RECEIPT_DOCS_AND_IDS);
    return transformToDocumentIdDocItems(response, "id", "receipt_doc");
  } catch (error) {
    console.error("Error fetching supplier repair receipt documents:", error);
    throw error;
  }
};

// Send For a Claim (Submit Claim) - แก้ไข idFieldName
export const getSendForClaimDocuments = async (): Promise<DocumentIdDocItem[]> => {
  try {
    const { data: response } = await mainApi.get<ApiDocsResponse>(GET_SEND_CLAIM_DOCS_AND_IDS);
    // API ส่ง "id" สำหรับ ID, และ "send_for_a_claim_doc" สำหรับเลขที่เอกสาร
    return transformToDocumentIdDocItems(response, "id", "send_for_a_claim_doc");
  } catch (error) {
    console.error("Error fetching send for claim documents:", error);
    throw error;
  }
};

// Receive For a Claim (Receive Claim) - แก้ไข idFieldName
export const getReceiveForClaimDocuments = async (): Promise<DocumentIdDocItem[]> => {
  try {
    const { data: response } = await mainApi.get<ApiDocsResponse>(GET_RECEIVE_CLAIM_DOCS_AND_IDS);
    // API ส่ง "id" สำหรับ ID, และ "receive_for_a_claim_doc" สำหรับเลขที่เอกสาร
    return transformToDocumentIdDocItems(response, "id", "receive_for_a_claim_doc");
  } catch (error) {
    console.error("Error fetching receive for claim documents:", error);
    throw error;
  }
};


// Helper for fetching responsible user
const getResponsibleUserByDocId = async (
  endpointBase: string, // Endpoint ที่รับ :id ต่อท้าย
  docId: string,
  docTypeName: string
): Promise<ResponsibleUser | null> => {
  if (!docId) {
    console.warn(
      `SERVICE: ${docTypeName} - Document ID is undefined or null. Cannot fetch responsible user.`
    );
    return null;
  }
  try {
    const { data: response } = await mainApi.get<ApiResponsibleUserResponse>(
      `${endpointBase}/${docId}` // Endpoint ควรมี /:id
    );

    if (response.success && response.responseObject) {
      return response.responseObject;
    } else {
      if (response.success && !response.responseObject) {
        console.warn(
          `SERVICE: ${docTypeName} - No responsible user found for document ID: ${docId}. Message: ${response.message}`
        );
      } else {
        console.error(
          `SERVICE: ${docTypeName} - Failed to fetch responsible user for document ID: ${docId}. Message: ${response.message}`
        );
      }
      return null;
    }
  } catch (error) {
    console.error(
      `SERVICE: ${docTypeName} - Error fetching responsible user for document ID ${docId}:`,
      error
    );
    return null; // คืน null เมื่อเกิด error
  }
};


export const getRepairReceiptResponsibleUser = async (
  repairReceiptId: string
): Promise<ResponsibleUser | null> => {
  return getResponsibleUserByDocId(
    GET_REPAIR_RECEIPT_RESPONSIBLE_USER, // Endpoint base e.g., "/api/repair-receipts/responsible"
    repairReceiptId,
    "Repair Receipt"
  );
};

export const getSupplierDeliveryNoteResponsibleUser = async (
  supplierDeliveryNoteId: string
): Promise<ResponsibleUser | null> => {
  return getResponsibleUserByDocId(
    GET_SUPPLIER_DELIVERY_NOTE_RESPONSIBLE_USER,
    supplierDeliveryNoteId,
    "Supplier Delivery Note"
  );
};

export const getSupplierRepairReceiptResponsibleUser = async (
  supplierRepairReceiptId: string
): Promise<ResponsibleUser | null> => {
  return getResponsibleUserByDocId(
    GET_SUPPLIER_REPAIR_RECEIPT_RESPONSIBLE_USER,
    supplierRepairReceiptId,
    "Supplier Repair Receipt"
  );
};

export const getSendForClaimResponsibleUser = async (
  sendForClaimId: string
): Promise<ResponsibleUser | null> => {
  return getResponsibleUserByDocId(
    GET_SEND_FOR_A_CLAIM_RESPONSIBLE_USER,
    sendForClaimId,
    "Send For A Claim"
  );
};

export const getReceiveForClaimResponsibleUser = async (
  receiveForClaimId: string
): Promise<ResponsibleUser | null> => {
  return getResponsibleUserByDocId(
    GET_RECEIVE_FOR_A_CLAIM_RESPONSIBLE_USER,
    receiveForClaimId,
    "Receive For A Claim"
  );
};

const updateSourceDocumentResponsiblePerson = async (
    endpointBase: string, 
    documentId: string,
    newResponsibleById: string,
    docTypeName: string
): Promise<any> => {
    try {
        const response = await mainApi.patch(
            `${endpointBase}/${documentId}`, 
            { responsible_by: newResponsibleById }
        );
        if (response.data.success) {
            return response.data.responseObject;
        } else {
            console.error(`SERVICE: Failed to update responsible person for ${docTypeName} ${documentId}: ${response.data.message}`);
            throw new Error(response.data.message || `Failed to update ${docTypeName} responsible person`);
        }
    } catch (error: any) {
        console.error(`SERVICE: Error updating ${docTypeName} (ID: ${documentId}) responsible person:`, {
            message: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

export const updateRepairReceiptResponsiblePerson = async (
  documentId: string,
  newResponsibleById: string
) => {
  return updateSourceDocumentResponsiblePerson(
    UPDATE_REPAIR_RECEIPT_RESPONSIBLE_ENDPOINT,
    documentId,
    newResponsibleById,
    "Repair Receipt"
  );
};

const updateSourceDocumentResponsiblePersonWithPathId = async (
    endpointBase: string,
    documentId: string,
    newResponsibleById: string,
    docTypeName: string
): Promise<any> => {
    try {
        const response = await mainApi.patch(
            `${endpointBase}/${documentId}`, 
            { responsible_by: newResponsibleById }
        );
        if (response.data.success) {
            return response.data.responseObject;
        } else {
            console.error(`SERVICE: Failed to update responsible person for ${docTypeName} ${documentId}: ${response.data.message}`);
            throw new Error(response.data.message || `Failed to update ${docTypeName} responsible person`);
        }
    } catch (error: any) {
        console.error(`SERVICE: Error updating ${docTypeName} (ID: ${documentId}) responsible person:`, {
            message: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

const updateSourceDocumentResponsiblePersonWithBodyPayload = async (
    endpoint: string,
    payload: Record<string, any>, 
    docTypeName: string
): Promise<any> => {
    try {
        const { data: response } = await mainApi.patch(endpoint, payload);
        if (response.success) {
            return response.responseObject;
        } else {
            console.error(`SERVICE: Failed to update responsible person for ${docTypeName}: ${response.message}`);
            throw new Error(response.message || `Failed to update ${docTypeName} responsible person`);
        }
    } catch (error: any) {
        console.error(`SERVICE: Error updating ${docTypeName} responsible person:`, {
            message: error.message,
            response: error.response?.data,
            payload: payload
        });
        throw error;
    }
};


export const updateMasterRepairReceiptResponsiblePerson = async (
  documentId: string,
  newResponsibleById: string
) => {
  return updateSourceDocumentResponsiblePersonWithPathId(
    UPDATE_MASTER_REPAIR_RECEIPT_RESPONSIBLE,
    documentId,
    newResponsibleById,
    "Master Repair Receipt"
  );
};



// 2. Supplier Delivery Note
export const updateSupplierDeliveryNoteResponsiblePerson = async (
  documentId: string,
  newResponsibleById: string
) => {
  const payload: PayLoadUpdateSupplierDeliveryNote = {
    supplier_delivery_note_id: documentId,
    responsible_by: newResponsibleById,
  };
  return updateSourceDocumentResponsiblePersonWithBodyPayload(
    UPDATE_SUPPLIER_DELIVERY_NOTE, 
    payload,
    "Supplier Delivery Note"
  );
};

// 3. Supplier Repair Receipt
export const updateSupplierRepairReceiptResponsiblePerson = async (
  documentId: string, 
  newResponsibleById: string
) => {
  const payload: PayLoadUpdateSupplierRepairReceiptForResponsiblePerson = {
    id: documentId,
    responsible_by: newResponsibleById,
  };
  return updateSourceDocumentResponsiblePersonWithBodyPayload(
    UPDATE_SUPPLIER_REPAIR_RECEIPT, 
    payload,
    "Supplier Repair Receipt"
  );
};

// 4. Send For A Claim
export const updateSendForClaimResponsiblePerson = async (
  documentId: string,
  newResponsibleById: string
) => {
  const payload: PayLoadUpdateSendForAClaim = {
    send_for_a_claim_id: documentId,
    responsible_by: newResponsibleById,
  };
  return updateSourceDocumentResponsiblePersonWithBodyPayload(
    UPDATE_SEND_FOR_A_CLAIM, 
    payload,
    "Send For a Claim"
  );
};

export const updateReceiveForClaimResponsiblePerson = async (
  documentId: string, 
  newResponsibleById: string
) => {
  return updateSourceDocumentResponsiblePersonWithPathId(
    UPDATE_RECEIVE_FOR_A_CLAIM,
    documentId,
    newResponsibleById,
    "Receive For a Claim"
  );
};