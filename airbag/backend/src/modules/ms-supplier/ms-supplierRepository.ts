import { PrismaClient } from "@prisma/client";
import { TypePayloadMasterSupplier } from "@modules/ms-supplier/ms-supplierModel";

const keys = [
    "supplier_id",
    "supplier_code",
    "supplier_name",
    "contact_name",
    "contact_number",
    "line_id",
    "addr_number",
    "addr_alley",
    "addr_street",
    "addr_subdistrict",
    "addr_district",
    "addr_province",
    "addr_postcode",
    "payment_terms",
    "payment_terms_day",
    "remark",
    "business_type",
];

const prisma = new PrismaClient();

export const msSupplierRepository = {
    findAll: async (companyId: string, skip: number, take: number, searchText: string) => {
        return await prisma.master_supplier.findMany({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        { supplier_code: { contains: searchText, mode: "insensitive" } },
                        { supplier_name: { contains: searchText, mode: "insensitive" } },
                        { contact_name: { contains: searchText, mode: "insensitive" } },
                        // { contact_number: { contains: searchText, mode: "insensitive" } },
                        { business_type: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
            skip,
            take,
            orderBy: { created_at: "asc" },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        })
    },
    // count: async (companyId: string) => {
    //     return prisma.master_supplier.count({
    //         where: {
    //             company_id: companyId,
    //             is_deleted: false
    //         },
    //     })
    // },
    count: async (companyId: string, searchText: string) => {
        return prisma.master_supplier.count({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        { supplier_code: { contains: searchText, mode: "insensitive" } },
                        { supplier_name: { contains: searchText, mode: "insensitive" } },
                        { contact_name: { contains: searchText, mode: "insensitive" } },
                        // { contact_number: { contains: searchText, mode: "insensitive" } },
                        { business_type: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
        });
    },

    findByName: async (companyId: string, supplier_code: string) => {
        return await prisma.master_supplier.findFirst({
            where: {
                supplier_code,
                company_id: companyId
            },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        });
    },

    create: async (
        companyId: string,
        userId: string,
        payload: TypePayloadMasterSupplier) => {
        if (!payload.supplier_code) {
            throw new Error("supplier_code is required");
        }
        const setPayload = {
            supplier_code: payload.supplier_code,
            supplier_name: payload.supplier_name,
            contact_name: payload.contact_name,
            contact_number: payload.contact_number,
            line_id: payload.line_id,
            addr_number: payload.addr_number,
            addr_alley: payload.addr_alley,
            addr_street: payload.addr_street,
            addr_subdistrict: payload.addr_subdistrict,
            addr_district: payload.addr_district,
            addr_province: payload.addr_province,
            addr_postcode: payload.addr_postcode,
            payment_terms: payload.payment_terms,
            payment_terms_day: payload.payment_terms_day,
            remark: payload.remark,
            business_type: payload.business_type,
            created_at: payload.created_at,
            updated_at: payload.updated_at,
            company_id: companyId,
            created_by: userId,
            updated_by: userId,
        };
        return await prisma.master_supplier.create({
            data: setPayload,
            select: {
                supplier_id: true,
                supplier_code: true,
                created_at: true
            }
        })
    },
    findByIdAsync: async (companyId: string, supplier_id: string) => {
        const supplier = await prisma.master_supplier.findFirst({
            where: {
                company_id: companyId,
                supplier_id: supplier_id
            },
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

            }
        });

        if (!supplier) {
            return null;
        }
        return supplier

    },

    update: async (
        companyId: string,
        userId: string,
        supplier_id: string,
        payload: TypePayloadMasterSupplier
    ) => {
        const setPayload = {
            supplier_code: payload.supplier_code,
            supplier_name: payload.supplier_name,
            contact_name: payload.contact_name,
            contact_number: payload.contact_number,
            line_id: payload.line_id,
            addr_number: payload.addr_number,
            addr_alley: payload.addr_alley,
            addr_street: payload.addr_street,
            addr_subdistrict: payload.addr_subdistrict,
            addr_district: payload.addr_district,
            addr_province: payload.addr_province,
            addr_postcode: payload.addr_postcode,
            payment_terms: payload.payment_terms,
            payment_terms_day: payload.payment_terms_day,
            remark: payload.remark,
            business_type: payload.business_type,
            updated_at: payload.updated_at || new Date(),
            updated_by: userId,
        };
        return await prisma.master_supplier.update({
            where: {
                company_id: companyId,
                supplier_id: supplier_id
            },
            data: setPayload,
        });
    },


    delete: async (companyId: string, supplier_id: string) => {
        return await prisma.master_supplier.delete({
            where: {
                company_id: companyId,
                supplier_id: supplier_id
            },
        });
    },

    findAllNoPagination: async (companyId: string) => {
        return await prisma.master_supplier.findMany({
            where: {
                company_id: companyId,
            },
            orderBy: { created_at: "asc" },
            select: {
                supplier_id: true,
                supplier_code: true,
            }
        });
    },

    select: async  (companyId: string , searchText : string) => {
    const data = await prisma.master_supplier.findMany({
        where: {
        company_id: companyId,
        ...(searchText && {
                supplier_code: {
                contains: searchText,
                mode: 'insensitive'
            },
        }),
        },
        skip : 0,
        take : 50,
        select: {
            supplier_id : true,
            supplier_code: true
        },
        orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
    return data;
    },

};