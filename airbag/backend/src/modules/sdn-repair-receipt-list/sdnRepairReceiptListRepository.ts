import { PrismaClient } from "@prisma/client";
import { TypePayloadSupplierDeliveryNoteRRList } from "@modules/sdn-repair-receipt-list/sdnRepairReceiptListModel";
import { SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS } from "@modules/sdn-repair-receipt-list/sdnRepairReceiptListModel"

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const keys = [
    "supplier_delivery_note_repair_receipt_list_id",
    "supplier_delivery_note_id",
    "repair_receipt_id",
    "master_repair_id",
    "price",
    "quantity",
    "total_price",
    "status",
];

const prisma = new PrismaClient();

export const supplierDeliveryNoteRRListRepository = {
    findAll: async (companyId: string, skip: number, take: number, searchText: string, supplier_delivery_note_id: string) => {
        const searchAmount = parseFloat(searchText);

        const records = await prisma.supplier_delivery_note_repair_receipt_list.findMany({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
                ...(searchText && {
                    OR: [
                        { status: { contains: searchText, mode: "insensitive" } },
                        { master_repair: { master_repair_name: { contains: searchText, mode: "insensitive" } } },  // แก้ไขที่นี่ให้เข้าถึง master_repair_name ผ่าน master_repair
                        { master_repair_receipt: { repair_receipt_doc: { contains: searchText, mode: "insensitive" } } },  // ค้นหาตาม repair_receipt_doc
                        { price: { equals: searchAmount } },
                        { quantity: { equals: searchAmount } },
                        { total_price: { equals: searchAmount } },
                    ],
                }),
            },
            skip,
            take,
            orderBy: { created_at: "asc" },
            select: {
                supplier_delivery_note_repair_receipt_list_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                status: true,
                price: true,
                quantity: true,
                total_price: true,
                master_repair_receipt: {
                    select: {
                        repair_receipt_doc: true,
                    },
                },
                supplier_delivery_note: {
                    select: {
                        supplier_delivery_note_doc: true,
                    },
                },
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    },
                },
            },
        });

        // จัดกลุ่มข้อมูลตาม supplier_delivery_note_id และ repair_receipt_id
        const groupedData = records.reduce<Record<string, Record<string, { repair_receipts: any[], repair_receipt_doc: string, supplier_delivery_note_doc: string, master_repair_name: string }>>>(
            (acc, record) => {
                // ถ้ายังไม่มีกลุ่มนี้ใน accumulator สำหรับ supplier_delivery_note_id ให้สร้างกลุ่มใหม่
                if (!acc[record.supplier_delivery_note_id]) {
                    acc[record.supplier_delivery_note_id] = {};
                }

                // ถ้ายังไม่มีกลุ่มนี้ใน accumulator สำหรับ repair_receipt_id ให้สร้างกลุ่มใหม่
                if (!acc[record.supplier_delivery_note_id][record.repair_receipt_id]) {
                    acc[record.supplier_delivery_note_id][record.repair_receipt_id] = {
                        repair_receipts: [],
                        repair_receipt_doc: record.master_repair_receipt?.repair_receipt_doc || "", // เพิ่ม repair_receipt_doc เมื่อสร้างกลุ่มใหม่
                        supplier_delivery_note_doc: record.supplier_delivery_note?.supplier_delivery_note_doc || "", // เพิ่ม supplier_delivery_note_doc
                        master_repair_name: record.master_repair?.master_repair_name || "",
                    };
                }

                // เพิ่มรายการ repair_receipt ลงในกลุ่มที่ตรงกับ supplier_delivery_note_id และ repair_receipt_id
                acc[record.supplier_delivery_note_id][record.repair_receipt_id].repair_receipts.push({
                    supplier_delivery_note_repair_receipt_list_id: record.supplier_delivery_note_repair_receipt_list_id,
                    repair_receipt_id: record.repair_receipt_id,
                    master_repair_id: record.master_repair.master_repair_id,
                    master_repair_name: record.master_repair.master_repair_name,
                    price: record.price,
                    quantity: record.quantity,
                    total_price: record.total_price,
                    status: record.status,

                });

                return acc;
            },
            {}
        );

        // เปลี่ยนจาก object เป็น array เพื่อให้ผลลัพธ์เป็น list
        const result = Object.keys(groupedData).map(supplierDeliveryNoteId => ({
            supplier_delivery_note_id: supplierDeliveryNoteId,
            supplier_delivery_note_doc: groupedData[supplierDeliveryNoteId][Object.keys(groupedData[supplierDeliveryNoteId])[0]].supplier_delivery_note_doc, // ใช้ supplier_delivery_note_doc จากรายการแรก
            repair_receipts: Object.keys(groupedData[supplierDeliveryNoteId]).map(repairReceiptId => ({
                repair_receipt_id: repairReceiptId,
                repair_receipt_doc: groupedData[supplierDeliveryNoteId][repairReceiptId].repair_receipt_doc, // เพิ่มข้อมูล repair_receipt_doc
                repair_receipts: groupedData[supplierDeliveryNoteId][repairReceiptId].repair_receipts,
            })),
        }));

        return result;
    },



    count: async (companyId: string, searchText: string, supplier_delivery_note_id: string) => {
        const searchAmount = parseFloat(searchText);

        return prisma.supplier_delivery_note_repair_receipt_list.count({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
                ...(searchText && {
                    OR: [
                        { status: { contains: searchText, mode: "insensitive" } },
                        { master_repair: { master_repair_name: { contains: searchText, mode: "insensitive" } } },  // แก้ไขที่นี่ให้เข้าถึง master_repair_name ผ่าน master_repair
                        { master_repair_receipt: { repair_receipt_doc: { contains: searchText, mode: "insensitive" } } },  // ค้นหาตาม repair_receipt_doc
                        { price: { equals: searchAmount } },  // ค้นหาตาม price
                        { quantity: { equals: searchAmount } },  // ค้นหาตาม quantity
                        { total_price: { equals: searchAmount } },  // ค้นหาตาม total_price
                    ],
                }),
            },
            orderBy: { created_at: "asc" },
        });
    },
    findByName: async (companyId: string, customer_code: string) => {
        return await prisma.customer_visit.findFirst({
            where: {
                customer_code,
                company_id: companyId
            },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        });
    },

    create: async (
        companyId: string,
        userId: string,
        payload: TypePayloadSupplierDeliveryNoteRRList
    ) => {
        if (!payload.supplier_delivery_note_id) {
            throw new Error("supplier_delivery_note_id is required ");
        }
        if (!payload.repair_receipt_id) {
            throw new Error(" repair_receipt_id is required");
        }
        if (!payload.master_repair_id) {
            throw new Error(" master_repair_id is required");
        }
        const supplierDeliveryNoteData = await prisma.supplier_delivery_note.findUnique({
            where: { supplier_delivery_note_id: payload.supplier_delivery_note_id },
            select: {
                supplier_delivery_note_id: true,
                supplier_delivery_note_doc: true,
                date_of_submission: true,
                due_date: true,
                amount: true,
                status: true,
                supplier_id: true,
            },
        });
        if (!supplierDeliveryNoteData) {
            throw new Error(`Supplier not found for supplier_delivery_note_id or repair_receipt_id or master_repair_id: ${payload.supplier_delivery_note_id}`);
        }
        const setPayload = {
            company_id: companyId,
            supplier_delivery_note_id: payload.supplier_delivery_note_id,
            repair_receipt_id: payload.repair_receipt_id,
            master_repair_id: payload.master_repair_id,
            price: payload.price ?? 0,
            quantity: payload.quantity ?? 0,
            total_price: payload.total_price ?? ((payload.price ?? 0) * (payload.quantity ?? 0)),
            // status: SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS.PENDING,
            status: payload.status ?? SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS.PENDING,
            created_at: payload.created_at ?? new Date().toISOString(),
            created_by: userId,
            updated_at: payload.updated_at,
            updated_by: userId,
        };
        return await prisma.supplier_delivery_note_repair_receipt_list.create({
            data: setPayload,
            select: {
                supplier_delivery_note_repair_receipt_list_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                price: true,
                quantity: true,
                total_price: true,
                status: true,
            }
        });

    },


    findByIdAsync: async (companyId: string, supplier_delivery_note_repair_receipt_list_id: string) => {
        const SupplierDeliveryNoteRRList = await prisma.supplier_delivery_note_repair_receipt_list.findFirst({
            where: {
                company_id: companyId,
                supplier_delivery_note_repair_receipt_list_id: supplier_delivery_note_repair_receipt_list_id
            },
            select: {
                supplier_delivery_note_repair_receipt_list_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                price: true,
                quantity: true,
                total_price: true,
                status: true,
            }
        });

        if (!SupplierDeliveryNoteRRList) {
            return null;
        }
        return SupplierDeliveryNoteRRList

    },

    update: async (
        companyId: string,
        userId: string,
        supplier_delivery_note_repair_receipt_list_id: string,
        payload: TypePayloadSupplierDeliveryNoteRRList
    ) => {
        const setPayload = {
            ...payload,
            updated_at: new Date(),
            updated_by: userId,
        };

        await prisma.supplier_delivery_note_repair_receipt_list.update({
            where: {
                company_id: companyId,
                supplier_delivery_note_repair_receipt_list_id: supplier_delivery_note_repair_receipt_list_id,
            },
            data: setPayload,
        });

        // // ตรวจสอบสถานะของ supplier_delivery_note_repair_receipt_list ทั้งหมดที่มี supplier_delivery_note_id เหมือนกัน
        // // ถ้าสถานะของทั้งหมดเป็น SUCCESS ให้เปลี่ยนสถานะของ supplier_delivery_note เป็น SUCCESS

        // const supplierDeliveryNoteId = payload.supplier_delivery_note_id;
        // const repairReceiptList = await prisma.supplier_delivery_note_repair_receipt_list.findMany({
        //     where: {
        //         company_id: companyId,
        //         supplier_delivery_note_id: supplierDeliveryNoteId,
        //     },
        //     select: {
        //         status: true,
        //     },
        // });

        // const allSuccess = repairReceiptList.every((item) => item.status === SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS.SUCCESS);

        // if (allSuccess) {
        //     const setSupplierDeliveryNotePayload = {
        //         status: SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS.SUCCESS,
        //         updated_at: new Date(),
        //         updated_by: userId,
        //     };

        //     await prisma.supplier_delivery_note.update({
        //         where: {
        //             company_id: companyId,
        //             supplier_delivery_note_id: supplierDeliveryNoteId,
        //         },
        //         data: setSupplierDeliveryNotePayload,
        //     });
        // } else {
        //     const setSupplierDeliveryNotePayload = {
        //         status: SDN_REPAIR_RECEIPT_LIST_REPAIR_STATUS.PENDING,
        //         updated_at: new Date(),
        //         updated_by: userId,
        //     };
        //         await prisma.supplier_delivery_note.update({
        //         where: {
        //             company_id: companyId,
        //             supplier_delivery_note_id: supplierDeliveryNoteId,
        //         },
        //         data: setSupplierDeliveryNotePayload,
        //     });
        // }
    },

    delete: async (companyId: string, supplier_delivery_note_repair_receipt_list_id: string) => {
        return await prisma.supplier_delivery_note_repair_receipt_list.delete({
            where: {
                company_id: companyId,
                supplier_delivery_note_repair_receipt_list_id: supplier_delivery_note_repair_receipt_list_id
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

    findByRRIdAsync: async (companyId: string, supplier_delivery_note_id: string, repair_receipt_id: string) => {
        return await prisma.supplier_delivery_note_repair_receipt_list.findMany({

            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
                repair_receipt_id: repair_receipt_id
            },
            select: {
                supplier_delivery_note_repair_receipt_list_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                price: true,
                quantity: true,
                total_price: true,
                status: true,
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    },
                }
            },
        });
    },

    findByRRIdAsync2: async (companyId: string, repair_receipt_id: string) => {
        return await prisma.supplier_delivery_note_repair_receipt_list.findMany({

            where: {
                company_id: companyId,
                // supplier_delivery_note_id: supplier_delivery_note_id,
                repair_receipt_id: repair_receipt_id
            },
            select: {
                supplier_delivery_note_repair_receipt_list_id: true,
                supplier_delivery_note_id: true,
                repair_receipt_id: true,
                master_repair_id: true,
                price: true,
                quantity: true,
                total_price: true,
                status: true,
                master_repair: {
                    select: {
                        master_repair_id: true,
                        master_repair_name: true,
                    },
                }
            },
        });
    },

    checkSDNListinSupplierRepairReceipt: async (companyId: string, supplier_delivery_note_repair_receipt_list_id: string) => {
        const results = await prisma.supplier_repair_receipt_list.findMany({
            where: {
                company_id: companyId,
                supplier_delivery_note_repair_receipt_list_id: supplier_delivery_note_repair_receipt_list_id,
                finish: true
            }
        });
        return results;
    },
    
};