import { PrismaClient } from "@prisma/client";
import { TypePayloadSendForAClaim, SendClaimDocItem } from "@modules/send-for-a-claim/sendForAClaimModel";
import { generateSendForAClaimDoc } from "@common/utils/generateSendForAClaimDoc";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { send } from "process";
dayjs.extend(utc);
dayjs.extend(timezone);

const keys = [
    "send_for_a_claim_id",
    "send_for_a_claim_doc",
    "claim_date",
    "due_date",
    "supplier_id",
    "addr_number",
    "addr_alley",
    "addr_street",
    "addr_subdistrict",
    "addr_district",
    "addr_province",
    "addr_postcode",
    "contact_name",
    "contact_number",
    "remark",
];
const prisma = new PrismaClient();

export const sendForAClaimRepository = {
    findAll: async (companyId: string, skip: number, take: number, searchText: string) => {
        return await prisma.send_for_a_claim.findMany({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        { send_for_a_claim_doc: { contains: searchText, mode: "insensitive" } },
                        { master_supplier: { supplier_code: { contains: searchText, mode: "insensitive" } } },
                        { supplier_repair_receipt: { receipt_doc: { contains: searchText, mode: "insensitive" } } },
                        { supplier_repair_receipt: { supplier_delivery_note: { supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } } } },
                        { due_date: { contains: searchText, mode: "insensitive" } },
                        { claim_date: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
            select: {
                send_for_a_claim_id: true,
                send_for_a_claim_doc: true,
                supplier_repair_receipt_id: true,
                claim_date: true,
                due_date: true,
                supplier_id: true,
                addr_number: true,
                addr_alley: true,
                addr_street: true,
                addr_subdistrict: true,
                addr_district: true,
                addr_province: true,
                addr_postcode: true,
                contact_name: true,
                contact_number: true,
                remark: true,
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_code: true,
                        supplier_name: true,
                    },
                },
                supplier_repair_receipt: {
                    select: {
                        receipt_doc: true,
                        supplier_delivery_note: {
                            select: {
                                supplier_delivery_note_id: true,
                                supplier_delivery_note_doc: true,
                            },
                        },
                    },
                },
            },
            skip,
            take,
            orderBy: [
                { created_at: "asc" },
            ],
        });
    },

    count: async (companyId: string, searchText: string) => {
        return await prisma.send_for_a_claim.count({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        { send_for_a_claim_doc: { contains: searchText, mode: "insensitive" } },
                        { master_supplier: { supplier_code: { contains: searchText, mode: "insensitive" } } },
                        { supplier_repair_receipt: { receipt_doc: { contains: searchText, mode: "insensitive" } } },
                        { supplier_repair_receipt: { supplier_delivery_note: { supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } } } },
                        { due_date: { contains: searchText, mode: "insensitive" } },
                        { claim_date: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
        });
    },

    create: async (
        companyId: string,
        userId: string,
        payload: TypePayloadSendForAClaim
    ) => {
        if (!payload.supplier_repair_receipt_id) {
            throw new Error("supplier_repair_receipt_id is required");
        }
        const supplierRepairReceiptData = await prisma.supplier_repair_receipt.findUnique({
            where: { id: payload.supplier_repair_receipt_id },
            select: {
                receipt_doc: true,
                supplier_delivery_note: {
                    select: {
                        supplier_delivery_note_id: true,
                        supplier_delivery_note_doc: true
                    }
                },
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_code: true,
                        supplier_name: true,
                        contact_name: true,
                        contact_number: true,
                        line_id: true,
                        addr_number: true,
                        addr_alley: true,
                        addr_street: true,
                        addr_subdistrict: true,
                        addr_district: true,
                        addr_province: true,
                        addr_postcode: true,
                        payment_terms: true,
                        payment_terms_day: true,
                        remark: true,
                        business_type: true,
                    }
                }
            },
        });
        if (!supplierRepairReceiptData) {
            throw new Error(`Supplier not found for supplier_repair_receipt_id: ${payload.supplier_repair_receipt_id}`);
        }
        const setPayload = {
            company_id: companyId,
            send_for_a_claim_doc: payload.send_for_a_claim_doc,
            due_date: payload.due_date,
            supplier_repair_receipt_id: payload.supplier_repair_receipt_id,
            claim_date: payload.claim_date ?? dayjs().tz("Asia/Bangkok").format("YYYY-MM-DD"),
            supplier_id: supplierRepairReceiptData.master_supplier?.supplier_id,
            addr_number: supplierRepairReceiptData.master_supplier?.addr_number,
            addr_alley: supplierRepairReceiptData.master_supplier?.addr_alley,
            addr_street: supplierRepairReceiptData.master_supplier?.addr_street,
            addr_subdistrict: supplierRepairReceiptData.master_supplier?.addr_subdistrict,
            addr_district: supplierRepairReceiptData.master_supplier?.addr_district,
            addr_province: supplierRepairReceiptData.master_supplier?.addr_province,
            addr_postcode: supplierRepairReceiptData.master_supplier?.addr_postcode,
            contact_name: supplierRepairReceiptData.master_supplier?.contact_name,
            contact_number: supplierRepairReceiptData.master_supplier?.contact_number,
            remark: payload.remark,
            created_at: payload.created_at ?? new Date().toISOString(),
            created_by: userId,
            updated_at: payload.updated_at,
            updated_by: userId,
            responsible_by: userId,
        };
        return await prisma.send_for_a_claim.create({
            data: setPayload,
            select: {
                send_for_a_claim_id: true,
                send_for_a_claim_doc: true,
                supplier_repair_receipt_id: true,
                supplier_id: true,
            }
        });

    },
    findByIdAsync: async (companyId: string, send_for_a_claim_id: string) => {
        const claim = await prisma.send_for_a_claim.findFirst({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
            select: {
                send_for_a_claim_id: true,
                send_for_a_claim_doc: true,
                supplier_repair_receipt_id: true,
                claim_date: true,
                due_date: true,
                supplier_id: true,
                addr_number: true,
                addr_alley: true,
                addr_street: true,
                addr_subdistrict: true,
                addr_district: true,
                addr_province: true,
                addr_postcode: true,
                contact_name: true,
                contact_number: true,
                remark: true,
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_code: true,
                        supplier_name: true,
                        contact_name: true,
                        contact_number: true,
                    }
                },
                supplier_repair_receipt: {
                    select: {
                        id: true,
                        receipt_doc: true,
                        supplier_delivery_note: {
                            select: {
                                supplier_delivery_note_id: true,
                                supplier_delivery_note_doc: true
                            }
                        }
                    }
                }
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
        send_for_a_claim_id: string,
        payload: TypePayloadSendForAClaim
    ) => {
        const setPayload = {
            ...payload,
            updated_at: new Date(),
            updated_by: userId,
        };

        return await prisma.send_for_a_claim.update({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
            data: setPayload,
        });
    },

    delete: async (companyId: string, send_for_a_claim_id: string) => {
        return await prisma.send_for_a_claim.delete({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id
            },
        });
    },




    findByDate: async (date: Date) => {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // เวลาเริ่มต้นของวัน
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // เวลาสิ้นสุดของวัน

        return await prisma.supplier_delivery_note.findMany({
            where: {
                created_at: {
                    gte: startOfDay, // มากกว่าหรือเท่ากับเวลาเริ่มต้น
                    lt: endOfDay, // น้อยกว่าเวลาเที่ยงคืนของวันถัดไป
                },
            },
        });
    },



    getAllSendForAClaimDoc: async (companyId: string) => {
        return await prisma.supplier_repair_receipt.findMany({
            where: {
                company_id: companyId,
            },
            orderBy: {
                receipt_doc: "desc",
            },
            select: {
                id: true,
                receipt_doc: true,
            },
        });
    },


    findBySupplierRepairReceiptIdAsync: async (companyId: string, id: string) => {
        return await prisma.supplier_repair_receipt_list.findMany({
            where: {
                company_id: companyId,
                supplier_repair_receipt_id: id,
                finish: true
            },
            select: {
                id: true,
                supplier_repair_receipt_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                supplier_delivery_note_repair_receipt_list_id: true,
                price: true,
                quantity: true,
                total_price: true,
                status: true,
                finish: true,
                repair_date_supplier_repair_receipt_list: true,
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    }
                },
                supplier_repair_receipt: {
                    select: {
                        id: true,
                        receipt_doc: true,
                    }
                },
                supplier_delivery_note: {
                    select: {
                        supplier_delivery_note_id: true,
                        supplier_delivery_note_doc: true
                    }
                },
                master_repair_receipt: {
                    select: {
                        id: true,
                        repair_receipt_doc: true,
                    }
                }
            },
            orderBy: [
                { master_repair_receipt: { repair_receipt_doc: "asc" } },
                { master_repair: { master_repair_name: "asc" } }
            ],
        });
    },
    checkClaimListinClaim: async (companyId: string, send_for_a_claim_id: string) => {
        return await prisma.send_for_a_claim_list.findFirst({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
        });
    },

    checkClaiminReceiveForAClaim: async (companyId: string, send_for_a_claim_id: string) => {
        return await prisma.receive_for_a_claim.findFirst({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
        });
    },

    deleteBySendForAClaimId: async (companyId: string, send_for_a_claim_id: string) => {
        return await prisma.send_for_a_claim_list.deleteMany({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
        });
    },

    findOnlySendClaimDocsByCompanyId: async (companyId: string): Promise<SendClaimDocItem[]> => {
        const results = await prisma.send_for_a_claim.findMany({
          where: {
            company_id: companyId,
          },
          select: {
            send_for_a_claim_id: true,
            send_for_a_claim_doc: true,
          },
          orderBy: {
            send_for_a_claim_doc: 'asc',
          },
        });
        return results.map(item => ({
            id: item.send_for_a_claim_id,
            send_for_a_claim_doc: item.send_for_a_claim_doc,
        }));
      },

      findOnlyResponsibleUserForSendForAClaim: async (companyId: string, send_for_a_claim_id: string) => {
        return await prisma.send_for_a_claim.findFirst({
            where: {
                company_id: companyId,
                send_for_a_claim_id: send_for_a_claim_id,
            },
            select: { 
                send_for_a_claim_id: true, 
                responsible_by_user: {
                    select: {
                        employee_id: true, 
                        username: true,  
                    }
                }
            },
        });
    },
    select: async  (companyId: string , searchText : string) => {
        const data = await prisma.send_for_a_claim.findMany({
          where: {
            company_id: companyId,
            ...(searchText && {
                  send_for_a_claim_doc: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            }),
          },
          skip : 0,
          take : 50,
          select: {
            send_for_a_claim_id : true,
            send_for_a_claim_doc: true
          },
          orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    },
}