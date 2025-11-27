import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { TypePayloadSendForAClaimList, PayloadSubmit } from "./sendForAClaimListModel";
import { sendForAClaimListRepository } from "@modules/send-for-a-claim-list/sendForAClaimListRepository";
import prisma from "@src/db";

export const sendForAClaimListService = {
    findAll: async (
        companyId: string,

    ) => {
        try {
            const claim = await sendForAClaimListRepository.findAll(companyId);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Send for a claim list not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Send for a claim list success",
                claim,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error get send for a claim list : " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    create: async (companyId: string, userId: string, payload: TypePayloadSendForAClaimList) => {
        try {
            const claim = await sendForAClaimListRepository.create(companyId, userId, payload);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Error creating send for a claim list",
                    null,
                    StatusCodes.INTERNAL_SERVER_ERROR
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Send for a claim list created successfully",
                claim,
                StatusCodes.CREATED
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error creating send for a claim list",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (companyId: string, userId: string, send_for_a_claim_list_id: string, payload: TypePayloadSendForAClaimList) => {
        try {
            const claim = await sendForAClaimListRepository.findByIdAsync(companyId, send_for_a_claim_list_id);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Send for a claim list not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            const claimUpdated = await sendForAClaimListRepository.update(companyId, userId, send_for_a_claim_list_id, payload);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Error updating send for a claim list",
                    null,
                    StatusCodes.INTERNAL_SERVER_ERROR
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Send for a claim list updated successfully",
                "Send for a claim list updated successfully",
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error updating send for a claim list",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    delete: async (companyId: string, send_for_a_claim_list_id: string) => {
        try {
            const claim = await sendForAClaimListRepository.findByIdAsync(companyId, send_for_a_claim_list_id);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Send for a claim list not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            await sendForAClaimListRepository.delete(companyId, send_for_a_claim_list_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Send for a claim list deleted successfully",
                "Send for a claim list deleted successfully",
                StatusCodes.OK
            )
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error deleting send for a claim list",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findById: async (companyId: string, send_for_a_claim_list_id: string) => {
        try {
            const claim = await sendForAClaimListRepository.findByIdAsync(companyId, send_for_a_claim_list_id);
            if (!claim) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Send for a claim list not found",
                    null,
                    StatusCodes.BAD_REQUEST
                )
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Send for a claim list success",
                claim,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error get send for a claim list : " + (ex as Error).message;
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
            const send_for_a_claim_id = payload.send_for_a_claim_id;
            const supplier_delivery_note_id = payload.supplier_delivery_note_id;
            let unableToDeleteCount: number | undefined = undefined;

            // ดึงข้อมูลก่อนหน้าจากฐานข้อมูลโดยใช้ supplier_delivery_note_id และ repair_receipt_id
            const dataBefore = await sendForAClaimListRepository.dataBefore(
                companyId, send_for_a_claim_id, supplier_delivery_note_id
            );
            // แปลงข้อมูลก่อนหน้าให้อยู่ในรูปของ Map เพื่อให้ค้นหาได้ง่ายขึ้น โดยใช้ key เป็น send_for_a_claim_id-supplier_delivery_note_id-repair_receipt_id-master_repair_id
            const previousDataMap = new Map(
                dataBefore.map((prev) => [
                    `${prev.send_for_a_claim_id}-${prev.supplier_delivery_note_id}-${prev.repair_receipt_id}-${prev.master_repair_id}`,
                    prev
                ])
                // dataBefore.map((prev) => [prev.supplier_repair_receipt_list_id, prev])
            );
            await Promise.all(payload.repairReceiptIDAndRepairIDList.map(async (Item) => {

                const key = `${send_for_a_claim_id}-${supplier_delivery_note_id}-${Item.repair_receipt_id}-${Item.master_repair_id}`;
                const existingData = previousDataMap.get(key);

                if (existingData) {
                    // ถ้ามีข้อมูลเดิม
                    if (Item.checked === false) {
                        // ถ้าสถานะเป็น false → ลบข้อมูล
                        const results = await sendForAClaimListRepository.checkClaimListinReceiveForAClaim(companyId, existingData.send_for_a_claim_list_id);
                        if (results.length > 0) {
                            if (unableToDeleteCount === undefined) {
                                unableToDeleteCount = 0;
                            }
                            unableToDeleteCount += results.length;
                        } else {
                            await sendForAClaimListRepository.delete(companyId, existingData.send_for_a_claim_list_id);
                        }
                    } else {
                        // ถ้ามี remark และ price และสถานะเป็น true → อัปเดตข้อมูล
                        await sendForAClaimListRepository.update(
                            companyId, userId, existingData.send_for_a_claim_list_id,
                            {
                                send_for_a_claim_id: send_for_a_claim_id,
                                supplier_delivery_note_id: supplier_delivery_note_id,
                                supplier_repair_receipt_list_id: Item.supplier_repair_receipt_list_id,
                                repair_receipt_id: Item.repair_receipt_id,
                                master_repair_id: Item.master_repair_id,
                                price: Item.price ?? undefined,
                                remark: Item.remark ?? undefined,
                                updated_at: new Date(),
                                updated_by: userId,
                            }
                        );
                    }
                } else {
                    if (Item.checked === true) {
                        // ถ้าไม่มีข้อมูลเดิม → สร้างใหม่
                        await sendForAClaimListRepository.create(companyId, userId, {
                            send_for_a_claim_id: send_for_a_claim_id,
                            supplier_repair_receipt_list_id: Item.supplier_repair_receipt_list_id,
                            supplier_delivery_note_id: supplier_delivery_note_id,
                            repair_receipt_id: Item.repair_receipt_id,
                            master_repair_id: Item.master_repair_id,
                            remark: Item.remark ?? undefined,
                            price: Item.price ?? undefined,
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
                "Update Send for a claim list success",
                unableToDeleteCount,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = "Error update Send for a claim list: " + (ex as Error).message;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

};
