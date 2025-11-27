import { PrismaClient } from "@prisma/client";
import { TypePayloadSendForAClaim } from "@modules/send-for-a-claim/sendForAClaimModel";
import { generateSendForAClaimDoc } from "@common/utils/generateSendForAClaimDoc";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { send } from "process";
import { record } from "zod";
import { TypePayloadSendForAClaimList } from "./sendForAClaimListModel";
dayjs.extend(utc);
dayjs.extend(timezone);

const keys = [
    "send_for_a_claim_list_id",
    "send_for_a_claim_id",
    "supplier_delivery_note_id",
    "repair_receipt_id",
    "master_repair_id",
    "remark",
    "price",
];
const prisma = new PrismaClient();

export const sendForAClaimListRepository = {
    findAll: async (companyId: string) => {
        return await prisma.send_for_a_claim_list.findMany({
            where: {
                company_id: companyId,
            },
            select: {
                send_for_a_claim_list_id: true,
                send_for_a_claim_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                remark: true,
                price: true,
                send_for_a_claim: {
                    select: {
                        send_for_a_claim_id: true,
                        send_for_a_claim_doc: true,
                        due_date: true,
                        claim_date: true,
                    },
                },
                repair_receipt: {
                    select: {
                        id: true,
                        repair_receipt_doc: true,
                    },
                },
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    },
                },
            },
            orderBy: { created_at: "asc" },
        });
    },

    count: async (companyId: string, searchText: string, send_for_a_claim_id: string) => {
        return await prisma.send_for_a_claim_list.count({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
                ...(searchText && {
                    OR: [
                        { remark: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
        });
    },

    create: async (
        companyId: string,
        userId: string,
        payload: TypePayloadSendForAClaimList
    ) => {
        if (!payload.send_for_a_claim_id) {
            throw new Error("supplier_repair_receipt_id is required");
        }
        if (!payload.supplier_delivery_note_id) {
            throw new Error("supplier_delivery_note_id is required");
        }
        if (!payload.repair_receipt_id) {
            throw new Error("repair_receipt_id is required");
        }
        if (!payload.master_repair_id) {
            throw new Error("master_repair_id is required");
        }
        const sendForAClaimData = await prisma.send_for_a_claim.findUnique({
            where: { send_for_a_claim_id: payload.send_for_a_claim_id },
            // select: {

            // },
        });
        const setPayload = {
            company_id: companyId,
            send_for_a_claim_id: payload.send_for_a_claim_id,
            supplier_delivery_note_id: payload.supplier_delivery_note_id,
            supplier_repair_receipt_list_id: payload.supplier_repair_receipt_list_id,
            repair_receipt_id: payload.repair_receipt_id,
            master_repair_id: payload.master_repair_id,
            remark: payload.remark,
            price: payload.price,
            created_at: payload.created_at ?? new Date().toISOString(),
            created_by: userId,
            updated_at: payload.updated_at,
            updated_by: userId,
        };
        return await prisma.send_for_a_claim_list.create({
            data: setPayload,
            select: {
                send_for_a_claim_list_id: true,
                send_for_a_claim_id: true,
                supplier_delivery_note_id: true,
                supplier_repair_receipt_list_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                remark: true,
                price: true
            }
        });

    },
    findByIdAsync: async (companyId: string, send_for_a_claim_list_id: string) => {
        const claim = await prisma.send_for_a_claim_list.findFirst({
            where: {
                company_id: companyId,
                send_for_a_claim_list_id: send_for_a_claim_list_id, // เพิ่มเงื่อนไขในการหาข้อมูลตาม ID
            },
            select: {
                send_for_a_claim_list_id: true,
                send_for_a_claim_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                remark: true,
                price: true
            }
        });

        if (!claim) {
            return null;
        }
        return claim;
    },

    update: async (
        companyId: string,
        userId: string,
        send_for_a_claim_list_id: string,
        payload: TypePayloadSendForAClaimList
    ) => {
        const setPayload = {
            ...payload,
            updated_at: new Date(),
            updated_by: userId,
        };

        // อัพเดต supplier_delivery_note ด้วย status ใหม่
        await prisma.send_for_a_claim_list.update({
            where: {
                company_id: companyId,
                send_for_a_claim_list_id: send_for_a_claim_list_id,
            },
            data: setPayload,
        });
    },

    delete: async (companyId: string, send_for_a_claim_list_id: string) => {
        return await prisma.send_for_a_claim_list.delete({
            where: {
                company_id: companyId,
                send_for_a_claim_list_id: send_for_a_claim_list_id
            },
        });
    },

    dataBefore: async (companyId: string, send_for_a_claim_id: string, supplier_delivery_note_id: string) => {
        return await prisma.send_for_a_claim_list.findMany({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
                supplier_delivery_note_id: supplier_delivery_note_id,
                // repair_receipt_id: repair_receipt_id,
                // master_repair_id: master_repair_id
            },
            select: {
                supplier_repair_receipt_list_id: true,
                send_for_a_claim_list_id: true,
                send_for_a_claim_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                remark: true,
                price: true
            }
        });
    },

    checkClaimListinReceiveForAClaim: async (companyId: string, send_for_a_claim_list_id: string) => {
        const results = await prisma.receive_for_a_claim_list.findMany({
            where: {
                company_id: companyId,
                send_for_a_claim_list_id: send_for_a_claim_list_id,
                finish: true
            }
        });
        return results;
    },

}