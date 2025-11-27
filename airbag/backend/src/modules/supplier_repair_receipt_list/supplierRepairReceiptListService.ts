import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { supplierRepairReceiptListRepository } from "./supplierRepairReceiptListRepository";
import { TypePayloadSupplierRepairReceiptList } from "./supplierRepairReceiptListModel";
import { Prisma } from "@prisma/client";

export const supplierRepairReceiptListService = {
    findAll: async (
        companyId: string,
        page: number = 1,
        pageSize: number = 12,
        searchText: string = ""
    ) => {
        try {
            const skip = (page - 1) * pageSize;
            const receiptLists = await supplierRepairReceiptListRepository.findAll(companyId, skip, pageSize, searchText);
            if (!receiptLists) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No repair receipt lists found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const totalCount = await supplierRepairReceiptListRepository.count(companyId, searchText);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data: receiptLists,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching repair receipt lists",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    create: async (companyId: string, userId: string, payload: TypePayloadSupplierRepairReceiptList) => {
        try {
            // 1. ตรวจสอบ Input ที่จำเป็น
            if (!payload.supplier_repair_receipt_id) {
                 return new ServiceResponse(
                    ResponseStatus.Failed,
                    "supplier_repair_receipt_id is required to create a list item",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            // อาจจะตรวจสอบ field อื่นๆ ที่จำเป็น เช่น master_repair_id, repair_receipt_id
    
            // 2. เรียก Repository เพื่อสร้างรายการใหม่ *เท่านั้น*
            // *** ไม่ควรมีการตรวจสอบ findFirst แบบเดิมที่อาจคืนค่าเก่า ***
            const newReceiptList = await supplierRepairReceiptListRepository.create(companyId, userId, payload);
    
            return new ServiceResponse(
                ResponseStatus.Success,
                "Create repair receipt list item success", // แก้ไขข้อความ
                newReceiptList,
                StatusCodes.CREATED // ใช้ CREATED สำหรับการสร้างใหม่
            );
        } catch (ex) {
             // ตรวจสอบว่าเป็น Error จาก Unique Constraint หรือไม่ (ถ้ามี)
             if (ex instanceof Prisma.PrismaClientKnownRequestError && ex.code === 'P2002') {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Duplicate entry: This repair item might already exist for this receipt.", // ข้อความแจ้งเตือนผู้ใช้
                    null, // ไม่ส่ง error message เต็มๆ กลับไป
                    StatusCodes.CONFLICT // ใช้ CONFLICT สำหรับ duplicate
                );
            }
            console.error("Error creating repair receipt list item:", ex); // แก้ไขข้อความ
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error creating repair receipt list item", // แก้ไขข้อความ
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },   

    update: async (companyId: string, userId: string, id: string, payload: TypePayloadSupplierRepairReceiptList) => {
        try {
            const receiptList = await supplierRepairReceiptListRepository.findByIdAsync(companyId, id);
            if (!receiptList) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Repair receipt list not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            const updatedReceiptList = await supplierRepairReceiptListRepository.update(companyId, userId, id, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update repair receipt list success",
                updatedReceiptList,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error updating repair receipt list",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    delete: async (companyId: string, id: string) => {
        try {
            // 1. Find the record first
            const receiptList = await supplierRepairReceiptListRepository.findByIdAsync(companyId, id);
            if (!receiptList) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Repair receipt list not found",
                    null,
                    StatusCodes.NOT_FOUND // Changed to NOT_FOUND as it's more appropriate
                );
            }

            // 2. NEW CHECK: Check if referenced in send_for_a_claim_list
            const isReferenced = await supplierRepairReceiptListRepository.checkIfReferencedInSendForClaim(companyId, id);
            if (isReferenced) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Cannot delete: Record is referenced in 'Send For Claim List'.", // Specific error message
                    null,
                    StatusCodes.BAD_REQUEST // Use BAD_REQUEST as the request is invalid due to dependencies
                );
            }

            // 4. If all checks pass, perform deletion
            await supplierRepairReceiptListRepository.delete(companyId, id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete repair receipt list success",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            // Log the actual error for debugging
            console.error("Error deleting repair receipt list:", ex);
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error deleting repair receipt list",
                (ex instanceof Error) ? ex.message : "An unexpected error occurred", // More robust error handling
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findOne: async (companyId: string, id: string) => {
        try {
            const receiptList = await supplierRepairReceiptListRepository.findByIdAsync(companyId, id);
            if (!receiptList) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Repair receipt list not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get repair receipt list success",
                receiptList,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error getting repair receipt list",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    
    updateFinishStatus: async (
        companyId: string,
        userId: string,
        supplierDeliveryNoteRepairReceiptListId: string,
        finish: boolean,
        finishByReceiptDoc: string,
        supplier_repair_receipt_id: string // เพิ่มพารามิเตอร์นี้
    ) => {
        try {
            const updatedList = await supplierRepairReceiptListRepository.updateFinishStatus(
                companyId,
                userId,
                supplierDeliveryNoteRepairReceiptListId,
                finish,
                finishByReceiptDoc,
                supplier_repair_receipt_id // ส่งค่าไป Repository
            );
    
            if (!updatedList || updatedList.length === 0) {
                return {
                    success: false,
                    message: "Repair receipt list not found",
                    responseObject: null,
                    statusCode: 404
                };
            }
    
            return {
                success: true,
                message: "Update finish status success",
                responseObject: updatedList,
                statusCode: 200
            };
        } catch (ex) {
            return {
                success: false,
                message: "Error updating finish status",
                responseObject: (ex as Error).message,
                statusCode: 500
            };
        }
    },

    findPayloadList: async (
        companyId: string, 
        supplier_repair_receipt_id: string,
        supplier_delivery_note_id: string
    ) => {
        try {
            const receipts = await supplierRepairReceiptListRepository.findPayloadListById(
                companyId, 
                supplier_repair_receipt_id,
                supplier_delivery_note_id
            );
            
            if (!receipts) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    `No repair receipts found for the specified IDs`,
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
    
            const formattedReceipts = receipts.map(receipt => {
                // นำข้อมูลจาก supplier_delivery_note_repair_receipt_list มาก่อน
                const deliveryNoteRepairItems = receipt.supplier_delivery_note?.supplier_delivery_note_repair_receipt_list.map(item => {
                    // แก้ไขตรงนี้ - ตรวจสอบว่า supplier_repair_receipt_list เป็น array และมีข้อมูล
                    const relatedSupplierRepairReceiptList = item.supplier_repair_receipt_list && 
                                                            Array.isArray(item.supplier_repair_receipt_list) && 
                                                            item.supplier_repair_receipt_list.length > 0 
                                                            ? item.supplier_repair_receipt_list[0] : null;
                
                    return {
                        supplier_delivery_note_repair_receipt_list_id: item.supplier_delivery_note_repair_receipt_list_id,
                        repair_receipt_doc: item.master_repair_receipt?.repair_receipt_doc || null,
                        master_repair_name: item.master_repair?.master_repair_name || "",
                        master_repair_receipt_id: item.master_repair_receipt?.id || "",
                        master_repair_id: item.master_repair?.master_repair_id || "",
                        price: item.price || 0,
                        quantity: item.quantity || 1,
                        total_price: item.total_price || 0,
                        status: item.status || "pending",
                        supplier_repair_receipt_list: relatedSupplierRepairReceiptList ? {
                            id: relatedSupplierRepairReceiptList.id,
                            price: relatedSupplierRepairReceiptList.price,
                            quantity: relatedSupplierRepairReceiptList.quantity,
                            total_price: relatedSupplierRepairReceiptList.total_price,
                            finish: relatedSupplierRepairReceiptList.finish,
                            finish_by_receipt_doc: relatedSupplierRepairReceiptList.finish_by_receipt_doc,
                            supplier_repair_receipt_id: relatedSupplierRepairReceiptList.supplier_repair_receipt_id
                        } : null
                    };
                }) || [];
    
                // ใช้ Map เพื่อจัดการข้อมูลจากทั้งสองแหล่ง
                const repairItemsMap = new Map();
                
                // เพิ่มข้อมูลจาก supplier_repair_receipt_lists ก่อน
                receipt.supplier_repair_receipt_lists.forEach(item => {
                    const key = `${item.master_repair?.master_repair_id || ""}_${item.master_repair_receipt?.id || ""}`;
                    
                    repairItemsMap.set(key, {
                        supplier_repair_receipt_lists_id: item.id,
                        receipt_doc: receipt.receipt_doc,
                        repair_receipt_doc: item.master_repair_receipt?.repair_receipt_doc || null,
                        master_repair_name: item.master_repair?.master_repair_name || "",
                        master_repair_receipt_id: item.master_repair_receipt?.id || "",
                        master_repair_id: item.master_repair?.master_repair_id || "",
                        price: item.price || 0,
                        quantity: item.quantity || 1,
                        total_price: item.total_price || 0,
                        finish: item.finish,
                        finish_by_receipt_doc: item.finish_by_receipt_doc || null,
                    });
                });
                
                // เพิ่มหรืออัปเดตจาก delivery_note_repair_items
                deliveryNoteRepairItems.forEach(item => {
                    const key = `${item.master_repair_id}_${item.master_repair_receipt_id}`;
                    
                    // ถ้าไม่มีข้อมูลในแมป ให้เพิ่มเข้าไป
                    if (!repairItemsMap.has(key) && item.supplier_repair_receipt_list) {
                        repairItemsMap.set(key, {
                            supplier_repair_receipt_lists_id: item.supplier_repair_receipt_list.id,
                            receipt_doc: receipt.receipt_doc || null,
                            repair_receipt_doc: item.repair_receipt_doc,
                            master_repair_name: item.master_repair_name,
                            master_repair_receipt_id: item.master_repair_receipt_id,
                            master_repair_id: item.master_repair_id,
                            price: item.price,
                            quantity: item.quantity,
                            total_price: item.total_price,
                            finish: item.supplier_repair_receipt_list?.finish || false,
                            finish_by_receipt_doc: item.supplier_repair_receipt_list?.finish_by_receipt_doc || null,
                        });
                    }
                });
                
                // แปลงแมปกลับเป็นอาร์เรย์
                const allRepairItems = Array.from(repairItemsMap.values());
    
                return {
                    supplier_repair_receipt_id: receipt.id,
                    receipt_doc: receipt.receipt_doc,
                    supplier_delivery_note_id: receipt.supplier_delivery_note_id,
                    supplier_delivery_note_doc: receipt.supplier_delivery_note?.supplier_delivery_note_doc,
                    date_of_submission: receipt.supplier_delivery_note?.date_of_submission,
                    due_date: receipt.supplier_delivery_note?.due_date,
                    amount: receipt.supplier_delivery_note?.amount,
                    delivery_note_status: receipt.supplier_delivery_note?.status,
                    contact_name: receipt.supplier_delivery_note?.contact_name,
                    contact_number: receipt.supplier_delivery_note?.contact_number,
                    payment_terms: receipt.supplier_delivery_note?.payment_terms,
                    payment_terms_day: receipt.supplier_delivery_note?.payment_terms_day,
                    remark: receipt.supplier_delivery_note?.remark,
                    repair_date_supplier_repair_receipt: receipt.repair_date_supplier_repair_receipt,
                    supplier_name: receipt.master_supplier?.supplier_name,
                    supplier_code: receipt.master_supplier?.supplier_code,
                    status: receipt.status,
                    repair_items: allRepairItems,
                    delivery_note_repair_items: deliveryNoteRepairItems
                };
            });
    
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get repair receipt list payload success",
                formattedReceipts,
                StatusCodes.OK
            );
        } catch (ex) {
            console.error('Error in findPayloadList:', ex);
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error getting repair receipt list payload",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },    

    updateSupplierRepairReceiptId: async (
        companyId: string, 
        userId: string, 
        id: string, 
        supplier_repair_receipt_id: string
    ) => {
        try {
            const receiptList = await supplierRepairReceiptListRepository.findByIdAsync(companyId, id);
            if (!receiptList) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Repair receipt list not found",
                    null,
                    StatusCodes.BAD_REQUEST
                );
            }
            
            const updatedReceiptList = await supplierRepairReceiptListRepository.updateSupplierRepairReceiptId(
                companyId, 
                userId, 
                id, 
                supplier_repair_receipt_id
            );
            
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update supplier repair receipt ID success",
                updatedReceiptList,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error updating supplier repair receipt ID",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
};