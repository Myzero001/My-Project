import { PrismaClient } from "@prisma/client";
import { TypePayloadSupplierDeliveryNote, DeliveryNoteDocItem } from "@modules/supplier-delivery-note/supplierDeliveryNoteModel";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const keys = [
    "supplier_delivery_note_id",
    "supplier_delivery_note_doc",
    "date_of_submission",
    "due_date",
    "amount",
    "status",
    "addr_number",
    "addr_alley",
    "addr_street",
    "addr_subdistrict",
    "addr_district",
    "addr_province",
    "addr_postcode",
    "contact_name",
    "contact_number",
    "payment_terms",
    "payment_terms_day",
    "remark",
];

const prisma = new PrismaClient();

export const supplierDeliveryNoteRepository = {
    findAll: async (companyId: string, skip: number, take: number, searchText: string) => {
        const searchAmount = parseFloat(searchText);
        return await prisma.supplier_delivery_note.findMany({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        { supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } },
                        { date_of_submission: { contains: searchText, mode: "insensitive" } },
                        { due_date: { contains: searchText, mode: "insensitive" } },
                        { master_supplier: { supplier_code: { contains: searchText, mode: "insensitive" } } },
                        { amount: { equals: searchAmount } },
                        { status: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
            select: {
                supplier_delivery_note_id: true,
                supplier_delivery_note_doc: true,
                date_of_submission: true,
                due_date: true,
                amount: true,
                status: true,
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
                payment_terms: true,
                payment_terms_day: true,
                remark: true,
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_code: true,
                        supplier_name: true,
                    },
                },
            },
            skip,
            take,
            orderBy: { created_at: "asc" },
        });
    },

    count: async (companyId: string, searchText: string) => {
        const searchAmount = parseFloat(searchText);
        return prisma.supplier_delivery_note.count({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        { supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } },
                        { date_of_submission: { contains: searchText, mode: "insensitive" } },
                        { due_date: { contains: searchText, mode: "insensitive" } },
                        { master_supplier: { supplier_code: { contains: searchText, mode: "insensitive" } } },
                        { amount: { equals: searchAmount } },
                        { status: { contains: searchText, mode: "insensitive" } },
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
        payload: TypePayloadSupplierDeliveryNote
    ) => {
        if (!payload.supplier_id) {
            throw new Error("supplier_id is required");
        }
        const supplierDeliveryNoteData = await prisma.master_supplier.findUnique({
            where: { supplier_id: payload.supplier_id },
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
                created_at: true,
                updated_at: true,
            },
        });
        if (!supplierDeliveryNoteData) {
            throw new Error(`Supplier not found for supplier_id: ${payload.supplier_id}`);
        }
        const setPayload = {
            company_id: companyId,
            supplier_delivery_note_doc: payload.supplier_delivery_note_doc,
            date_of_submission: payload.date_of_submission ?? dayjs().tz("Asia/Bangkok").format("YYYY-MM-DD"),
            due_date: payload.due_date,
            amount: payload.amount,
            status: payload.status ?? "pending",
            supplier_id: payload.supplier_id,
            addr_number: supplierDeliveryNoteData.addr_number,
            addr_alley: supplierDeliveryNoteData.addr_alley,
            addr_street: supplierDeliveryNoteData.addr_street,
            addr_subdistrict: supplierDeliveryNoteData.addr_subdistrict,
            addr_district: supplierDeliveryNoteData.addr_district,
            addr_province: supplierDeliveryNoteData.addr_province,
            addr_postcode: supplierDeliveryNoteData.addr_postcode,
            contact_name: supplierDeliveryNoteData.contact_name,
            contact_number: supplierDeliveryNoteData.contact_number,
            payment_terms: supplierDeliveryNoteData.payment_terms,
            payment_terms_day: supplierDeliveryNoteData.payment_terms_day,
            remark: supplierDeliveryNoteData.remark,
            created_at: payload.created_at ?? new Date().toISOString(),
            created_by: userId,
            updated_at: payload.updated_at,
            updated_by: userId,
            responsible_by: userId,
        };
        return await prisma.supplier_delivery_note.create({
            data: setPayload,
            select: {
                supplier_delivery_note_id: true,
                supplier_delivery_note_doc: true,
                supplier_id: true,

            }
        });

    },

    findByIdAsync: async (companyId: string, supplier_delivery_note_id: string) => {
        const SupplierDeliveryNote = await prisma.supplier_delivery_note.findFirst({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
            select: {
                supplier_delivery_note_id: true,
                supplier_delivery_note_doc: true,
                date_of_submission: true,
                due_date: true,
                amount: true,
                status: true,
                supplier_id: true,
                addr_alley: true,
                addr_number: true,
                addr_street: true,
                addr_subdistrict: true,
                addr_district: true,
                addr_province: true,
                addr_postcode: true,
                contact_name: true,
                contact_number: true,
                payment_terms: true,
                payment_terms_day: true,
                remark: true,
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_code: true,
                        supplier_name: true,
                    },
                },
            },
        });

        if (!SupplierDeliveryNote) {
            return null;
        }
        return SupplierDeliveryNote;
    },

    update: async (
        companyId: string,
        userId: string,
        supplier_delivery_note_id: string,
        payload: TypePayloadSupplierDeliveryNote
    ) => {

        // คำนวณจำนวนเงินรวม
        const totalAmount = await prisma.supplier_delivery_note_repair_receipt_list.aggregate({
            _sum: {
                total_price: true,
            },
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
        });

        const setPayload = {
            ...payload,
            amount: totalAmount._sum.total_price ?? 0, // ใช้ 0 หากไม่มีข้อมูลใน total_price
            updated_at: new Date(),
            updated_by: userId,
        };

        // อัพเดต supplier_delivery_note ด้วย status ใหม่
        return await prisma.supplier_delivery_note.update({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
            data: setPayload,
        });
    },

    delete: async (companyId: string, supplier_delivery_note_id: string) => {
        return await prisma.supplier_delivery_note.delete({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id
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

    getAllSupplierDeliveryNoteDoc: async (companyId: string) => {
        // ดึงข้อมูล docs
        const docs = await prisma.supplier_delivery_note.findMany({
            where: {
                company_id: companyId,
            },
            select: {
                supplier_delivery_note_doc: true,
                supplier_delivery_note_id: true
            },
            orderBy: {
                supplier_delivery_note_doc: 'desc'
            }
        });

        // นับจำนวนทั้งหมด
        const totalCount = await prisma.supplier_delivery_note.count({
            where: {
                company_id: companyId,
            }
        });

        return {
            docs,
            totalCount
        };
    },

    checkSDNListinSDN: async (companyId: string, supplier_delivery_note_id: string) => {
        return await prisma.supplier_delivery_note_repair_receipt_list.findFirst({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
        });
    },

    checkSDNinSRR: async (companyId: string, supplier_delivery_note_id: string) => {
        return await prisma.supplier_repair_receipt.findFirst({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
        });
    },
    deleteSupplierDeliveryNoteList: async (companyId: string, supplier_delivery_note_id: string) => {
        return await prisma.supplier_delivery_note_repair_receipt_list.deleteMany({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
        });
    },

    findOnlyDeliveryNoteDocsByCompanyId: async (companyId: string): Promise<DeliveryNoteDocItem[]> => { // <-- ปรับ Return Type
        const results = await prisma.supplier_delivery_note.findMany({
          where: {
            company_id: companyId,
          },
          select: {
            supplier_delivery_note_id: true, // <-- Select Primary Key
            supplier_delivery_note_doc: true,
          },
          orderBy: {
            supplier_delivery_note_doc: 'asc',
          },
        });
        // แปลงผลลัพธ์ให้ตรงกับ Interface (ถ้าชื่อ PK ไม่ตรงกับ 'id' ใน Interface)
        return results.map(item => ({
            id: item.supplier_delivery_note_id, // Map supplier_delivery_note_id ไปที่ 'id'
            supplier_delivery_note_doc: item.supplier_delivery_note_doc,
        }));
      },

      findOnlyResponsibleUserForDeliveryNote: async (companyId: string, supplier_delivery_note_id: string) => {
        return await prisma.supplier_delivery_note.findFirst({
            where: {
                company_id: companyId,
                supplier_delivery_note_id: supplier_delivery_note_id,
            },
            select: { 
                supplier_delivery_note_id: true, 
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
    const data = await prisma.supplier_delivery_note.findMany({
        where: {
        company_id: companyId,
        ...(searchText && {
                supplier_delivery_note_doc: {
                contains: searchText,
                mode: 'insensitive'
            },
        }),
        },
        skip : 0,
        take : 50,
        select: {
            supplier_delivery_note_id : true,
            supplier_delivery_note_doc: true
        },
        orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
    return data;
    },
};