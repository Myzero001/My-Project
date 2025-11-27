import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { supplierDeliveryNoteRRListRepository } from "@modules/sdn-repair-receipt-list/sdnRepairReceiptListRepository";
import { PayloadSubmit, TypePayloadSupplierDeliveryNoteRRList } from "@modules/sdn-repair-receipt-list/sdnRepairReceiptListModel";
import { supplier_delivery_note } from "@prisma/client";

export const supplierDeliveryRRListNoteService = {
    findAll: async (
        companyId: string,
        page: number = 1,
        pageSize: number = 12,
        searchText: string = "",
        supplier_delivery_note_id: string
    ) => {
        try {
            const skip = (page - 1) * pageSize;
            const SupplierDeliveryNoteRepairReceiptList = await supplierDeliveryNoteRRListRepository.findAll(companyId, skip, pageSize, searchText, supplier_delivery_note_id);
            if (!SupplierDeliveryNoteRepairReceiptList) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No Supplier Delivery Note Repair Receipt List found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const totalCount = await supplierDeliveryNoteRRListRepository.count(companyId, searchText, supplier_delivery_note_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data: SupplierDeliveryNoteRepairReceiptList,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error fetching Supplier Delivery Note Repair Receipt List : " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching Supplier Delivery Note Repair Receipt List ",
                errorMessage,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    create: async (companyId: string, userId: string, payload: TypePayloadSupplierDeliveryNoteRRList) => {
        try {

            const newSupplierDeliveryNoteRepairReceiptList = await supplierDeliveryNoteRRListRepository.create(companyId, userId, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Create Supplier Delivery Note Repair Receipt List  success",
                "Create Supplier Delivery Note Repair Receipt List  success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error create Supplier Delivery Note Repair Receipt List : " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    update: async (companyId: string, userId: string, supplier_delivery_note_repair_receipt_list_id: string, payload: TypePayloadSupplierDeliveryNoteRRList) => {
        try {
            const SupplierDeliveryNoteRepairReceiptList = await supplierDeliveryNoteRRListRepository.findByIdAsync(companyId, supplier_delivery_note_repair_receipt_list_id);
            if (!SupplierDeliveryNoteRepairReceiptList) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Supplier Delivery Note  Repair Receipt List not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            const updatedSupplierDeliveryNoteRepairReceiptList = await supplierDeliveryNoteRRListRepository.update(companyId, userId, supplier_delivery_note_repair_receipt_list_id, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update supplier delivery note  Repair Receipt List success",
                "Update supplier delivery note  Repair Receipt List success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error update supplier delivery note Repair Receipt List : " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    delete: async (companyId: string, supplier_delivery_note_repair_receipt_list_id: string) => {
        try {
            const SupplierDeliveryNoteRepairReceiptList = await supplierDeliveryNoteRRListRepository.findByIdAsync(companyId, supplier_delivery_note_repair_receipt_list_id);
            if (!SupplierDeliveryNoteRepairReceiptList) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "supplier delivery note  Repair Receipt List not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            await supplierDeliveryNoteRRListRepository.delete(companyId, supplier_delivery_note_repair_receipt_list_id);
            return new ServiceResponse<string>(
                ResponseStatus.Success,
                "delete supplier delivery note  Repair Receipt List success",
                "delete supplier delivery note  Repair Receipt List success",
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error delete supplier delivery note Repair Receipt List : " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findOne: async (companyId: string, supplier_delivery_note_repair_receipt_list_id: string) => {
        try {
            const supplierDeliveryNote = await supplierDeliveryNoteRRListRepository.findByIdAsync(companyId, supplier_delivery_note_repair_receipt_list_id);

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

    findByRRId: async (companyId: string, repair_receipt_id: string) => {
        try {
            const SupplierDeliveryNoteRepairReceiptList = await supplierDeliveryNoteRRListRepository.findByRRIdAsync2(companyId, repair_receipt_id);
            if (!SupplierDeliveryNoteRepairReceiptList) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Supplier Delivery Note Repair Receipt List not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get Supplier Delivery Note Repair Receipt List success",
                SupplierDeliveryNoteRepairReceiptList,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error get Supplier Delivery Note Repair Receipt List: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    updateData: async (companyId: string, userId: string, payload: PayloadSubmit) => {
        try {
            const supplier_delivery_note_id = payload.supplier_delivery_note_id;
            const repair_receipt_id = payload.repair_receipt_id;
            let unableToDeleteCount: number | undefined = undefined;
            // ดึงข้อมูลก่อนหน้าจากฐานข้อมูล
            const dataBefore = await supplierDeliveryNoteRRListRepository.findByRRIdAsync(
                companyId, supplier_delivery_note_id, repair_receipt_id
            );

            // แปลงข้อมูลก่อนหน้าให้อยู่ในรูปของ Map เพื่อให้ค้นหาได้ง่ายขึ้น
            const previousDataMap = new Map(
                dataBefore.map((prev) => [prev.master_repair_id, prev])
            );

            // ใช้ Promise.all เพื่อรอผลลัพธ์จากการสร้างแต่ละ item ใน repairList
            await Promise.all(payload.repairList.map(async (item) => {
                const existingData = previousDataMap.get(item.id_repair_list);
                // สร้าง data สำหรับแต่ละ item

                if (existingData) {
                    // ถ้ามีข้อมูลเดิม
                    if (item.status === false) {
                        // ถ้าสถานะเป็น false → ลบข้อมูล
                        const results = await supplierDeliveryNoteRRListRepository.checkSDNListinSupplierRepairReceipt(companyId, existingData.supplier_delivery_note_repair_receipt_list_id);
                        if (results.length > 0) {
                            if (unableToDeleteCount === undefined) {
                                unableToDeleteCount = 0;
                            }
                            unableToDeleteCount += results.length;
                        } else {
                            await supplierDeliveryNoteRRListRepository.delete(companyId, existingData.supplier_delivery_note_repair_receipt_list_id);
                        }
                    } else {
                        await supplierDeliveryNoteRRListRepository.update(
                            companyId, userId, existingData.supplier_delivery_note_repair_receipt_list_id,
                            {
                                supplier_delivery_note_id: existingData.supplier_delivery_note_id,
                                repair_receipt_id: existingData.repair_receipt_id,
                                master_repair_id: existingData.master_repair_id,
                                price: item.price,
                                quantity: item.qty,
                                total_price: item.total,
                                updated_at: new Date(),
                                updated_by: userId,
                            }
                        );
                    }
                } else {
                    if (item.status === true) {
                        // ถ้าไม่มีข้อมูลเดิม → สร้างใหม่
                        await supplierDeliveryNoteRRListRepository.create(companyId, userId, {
                            supplier_delivery_note_id: supplier_delivery_note_id,
                            repair_receipt_id: repair_receipt_id,
                            master_repair_id: item.id_repair_list,
                            price: item.price,
                            quantity: item.qty,
                            total_price: item.total,
                            status: "pending",
                            created_at: new Date(),
                            created_by: userId,
                            updated_at: new Date(),
                            updated_by: userId,
                        });
                    }
                }

            }));

            // เมื่อทุกอย่างเสร็จสิ้นแล้ว ส่ง response สำเร็จ
            return new ServiceResponse(
                ResponseStatus.Success,
                "Create Supplier Delivery Note Repair Receipt List success",
                unableToDeleteCount,
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
}