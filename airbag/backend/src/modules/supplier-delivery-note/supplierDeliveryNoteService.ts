import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { supplierDeliveryNoteRepository } from "@modules/supplier-delivery-note/supplierDeliveryNoteRepository";
import { TypePayloadSupplierDeliveryNote, DeliveryNoteDocItem } from "@modules/supplier-delivery-note/supplierDeliveryNoteModel";
import { supplier_delivery_note } from "@prisma/client";
import { generateSupplierDeliveryNoteDoc } from "@common/utils/generateSupplierDeliveryNoteDoc";



export const supplierDeliveryNoteService = {
    findAll: async (
        companyId: string,
        page: number = 1,
        pageSize: number = 12,
        searchText: string = ""
    ) => {
        try {
            const skip = (page - 1) * pageSize;
            const SupplierDeliveryNote = await supplierDeliveryNoteRepository.findAll(companyId, skip, pageSize, searchText);
            if (!SupplierDeliveryNote) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No Supplier Delivery Note found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const totalCount = await supplierDeliveryNoteRepository.count(companyId, searchText);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data: SupplierDeliveryNote,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error fetching Supplier Delivery Note: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching Supplier Delivery Note",
                errorMessage,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    create: async (companyId: string, userId: string, payload: TypePayloadSupplierDeliveryNote) => {
        try {

            payload.supplier_delivery_note_doc = await generateSupplierDeliveryNoteDoc(companyId);

            const newSupplierDeliveryNote = await supplierDeliveryNoteRepository.create(companyId, userId, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Create Supplier Delivery Note success",
                newSupplierDeliveryNote,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create Supplier Delivery Note: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    update: async (companyId: string, userId: string, supplier_delivery_note_id: string, payload: TypePayloadSupplierDeliveryNote) => {
        try {
            const supplierDeliveryNote = await supplierDeliveryNoteRepository.findByIdAsync(companyId, supplier_delivery_note_id);
            if (!supplierDeliveryNote) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Supplier Delivery Note not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            const updatedSupplierDeliveryNote = await supplierDeliveryNoteRepository.update(companyId, userId, supplier_delivery_note_id, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update supplier delivery note success",
                "Update supplier delivery note success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error update supplier delivery note: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    delete: async (companyId: string, supplier_delivery_note_id: string) => {
        try {
            //ใบที่จะลบมี รายการซ่อมอยู่ในใบไหม
            // const checkSDNListinSDN = await supplierDeliveryNoteRepository.checkSDNListinSDN(companyId, supplier_delivery_note_id);
            // if (checkSDNListinSDN != null) {
            //     return new ServiceResponse(
            //         ResponseStatus.Failed,
            //         "supplier delevery note list have in supplier delevery note",
            //         null,
            //         StatusCodes.BAD_REQUEST
            //     );
            // }
            //ใบที่จะลบมีอยู่ในใบรับซ่อมซับพลายเออร์ไหม
            const checkSDNinSRR = await supplierDeliveryNoteRepository.checkSDNinSRR(companyId, supplier_delivery_note_id);
            if (checkSDNinSRR != null) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "supplier delevery note  have in supplier repair receipt",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const visitcustomer = await supplierDeliveryNoteRepository.findByIdAsync(companyId, supplier_delivery_note_id);
            if (!visitcustomer) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "supplier delivery note not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            await supplierDeliveryNoteRepository.deleteSupplierDeliveryNoteList(companyId, supplier_delivery_note_id);
            await supplierDeliveryNoteRepository.delete(companyId, supplier_delivery_note_id);
            return new ServiceResponse<string>(
                ResponseStatus.Success,
                "delete supplier delivery note success",
                "delete supplier delivery note success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error delete supplier delivery note: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findOne: async (companyId: string, supplier_delivery_note_id: string) => {
        try {
            const supplierDeliveryNote = await supplierDeliveryNoteRepository.findByIdAsync(companyId, supplier_delivery_note_id);

            if (!supplierDeliveryNote) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "supplier delivery note not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get supplier delivery note success",
                supplierDeliveryNote,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error get supplier delivery note: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    getSupplierDeliveryNoteDoc: async (companyId: string) => {
        try {
            const result = await supplierDeliveryNoteRepository.getAllSupplierDeliveryNoteDoc(companyId);

            if (!result.docs || result.docs.length === 0) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No supplier delivery note docs found",
                    null,
                    StatusCodes.NOT_FOUND
                )
            }

            const formattedDocs = result.docs.map(doc => ({
                supplier_delivery_note_id: doc.supplier_delivery_note_id,
                supplier_delivery_note_doc: doc.supplier_delivery_note_doc
            }));

            return new ServiceResponse(
                ResponseStatus.Success,
                "Get supplier delivery note docs success",
                {
                    docs: formattedDocs,
                    totalCount: result.totalCount
                },
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error getting supplier delivery note docs: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findOnlyDeliveryNoteDocsByCompanyId: async (companyId: string): Promise<ServiceResponse<DeliveryNoteDocItem[]>> => { // <-- ปรับ Return Type
        try {
            // เรียก Repository function ที่ตอนนี้จะคืนค่า { id: string, supplier_delivery_note_doc: string | null }[]
            const docsResult = await supplierDeliveryNoteRepository.findOnlyDeliveryNoteDocsByCompanyId(companyId);

            if (!docsResult) {
                console.error("[Service.findOnlyDeliveryNoteDocs] Repository returned unexpected value:", docsResult);
                return new ServiceResponse(
                  ResponseStatus.Failed,
                  "Failed to retrieve delivery note documents due to an internal repository error.",
                  [], // คืนค่า Array ว่างที่ตรงกับ DeliveryNoteDocItem[]
                  StatusCodes.INTERNAL_SERVER_ERROR
                );
            }

            if (docsResult.length === 0) {
               return new ServiceResponse(
                    ResponseStatus.Success,
                    "No supplier delivery note documents found for this company.",
                    [], // คืนค่า Array ว่างที่ตรงกับ DeliveryNoteDocItem[]
                    StatusCodes.OK
                );
            }

            // docsResult เป็น DeliveryNoteDocItem[] อยู่แล้ว ไม่ต้อง map อีก
            return new ServiceResponse(
                ResponseStatus.Success,
                "Successfully fetched supplier delivery note documents.",
                docsResult, // <-- คืนค่า docsResult โดยตรง
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error fetching supplier delivery note documents: ${(error as Error).message}`;
            console.error(errorMessage);
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                [], // <-- คืนค่า Array ว่างที่ตรงกับ DeliveryNoteDocItem[]
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findResponsibleUserForDeliveryNote: async (companyId: string, supplier_delivery_note_id: string) => {
        try {
            const deliveryNoteData = await supplierDeliveryNoteRepository.findOnlyResponsibleUserForDeliveryNote(companyId, supplier_delivery_note_id);

            if (!deliveryNoteData) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Supplier delivery note not found.",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            if (!deliveryNoteData.responsible_by_user) { 
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "No responsible user assigned to this supplier delivery note.",
                    null,
                    StatusCodes.OK
                );
            }

            return new ServiceResponse(
                ResponseStatus.Success,
                "Responsible user found for supplier delivery note.",
                deliveryNoteData.responsible_by_user,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = `Error fetching responsible user for supplier delivery note: ${(ex as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    select: async (companyId: string , searchText: string = "") => {
    try {
        const data = await supplierDeliveryNoteRepository.select(companyId , searchText);
        return new ServiceResponse(
        ResponseStatus.Success,
        "Select success",
        {data},
        StatusCodes.OK
        );
        
    } catch (error) {
        return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching select",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
    },
}
