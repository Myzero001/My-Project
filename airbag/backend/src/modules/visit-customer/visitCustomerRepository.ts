import { customer_visit } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadVisitCustomer } from "@modules/visit-customer/visitCustomerModel";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const keys = [
    "customer_visit_id",
    "customer_visit_doc",
    "customer_id",
    "customer_code",
    "customer_name",
    "contact_name",
    "contact_number",
    "line_id",
    "addr_map",
    "addr_number",
    "addr_alley",
    "addr_street",
    "addr_subdistrict",
    "addr_district",
    "addr_province",
    "addr_postcode",
    "date_go",
    "topic",
    "next_topic",
    "next_date",
    "rating",


];

const prisma = new PrismaClient();

export const visitCustomerRepository = {
    findAll: async (companyId: string, skip: number, take: number, searchText: string,
    ) => {
        return await prisma.customer_visit.findMany({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        { customer_visit_doc: { contains: searchText, mode: "insensitive" } },
                        { customer_code: { contains: searchText, mode: "insensitive" } },
                        { customer_name: { contains: searchText, mode: "insensitive" } },
                        { addr_number: { contains: searchText, mode: "insensitive" } },
                        { addr_alley: { contains: searchText, mode: "insensitive" } },
                        { addr_street: { contains: searchText, mode: "insensitive" } },
                        { addr_subdistrict: { contains: searchText, mode: "insensitive" } },
                        { addr_district: { contains: searchText, mode: "insensitive" } },
                        { addr_province: { contains: searchText, mode: "insensitive" } },
                        { addr_postcode: { contains: searchText, mode: "insensitive" } },
                        { date_go: { contains: searchText, mode: "insensitive" } },
                        { next_date: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
            skip,
            take,
            orderBy: { created_at: "asc" },
            select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        })
    },
    count: async (companyId: string, searchText: string) => {
        return prisma.customer_visit.count({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        { customer_visit_doc: { contains: searchText, mode: "insensitive" } },
                        { customer_code: { contains: searchText, mode: "insensitive" } },
                        { customer_name: { contains: searchText, mode: "insensitive" } },
                        { addr_number: { contains: searchText, mode: "insensitive" } },
                        { addr_alley: { contains: searchText, mode: "insensitive" } },
                        { addr_street: { contains: searchText, mode: "insensitive" } },
                        { addr_subdistrict: { contains: searchText, mode: "insensitive" } },
                        { addr_district: { contains: searchText, mode: "insensitive" } },
                        { addr_province: { contains: searchText, mode: "insensitive" } },
                        { addr_postcode: { contains: searchText, mode: "insensitive" } },
                        { date_go: { contains: searchText, mode: "insensitive" } },
                        { next_date: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
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
        payload: TypePayloadVisitCustomer
    ) => {
        // ตรวจสอบว่ามี customer_id
        if (!payload.customer_id) {
            throw new Error("customer_id is required");
        }

        // ดึงข้อมูล customer จากตาราง master_customer
        const customer = await prisma.master_customer.findUnique({
            where: { customer_id: payload.customer_id },
            select: {
                customer_code: true,
                customer_name: true,
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
            },
        });
        if (!customer) {
            throw new Error(`Customer not found for customer_id: ${payload.customer_id}`);
        }
        const setPayload = {
            // customer_visit_id: payload.customer_visit_id,
            company_id: companyId,
            customer_visit_doc: payload.customer_visit_doc,
            customer_id: payload.customer_id,
            customer_code: customer.customer_code,
            customer_name: customer.customer_name,
            contact_name: customer.contact_name,
            contact_number: customer.contact_number,
            line_id: customer.line_id,
            addr_map: payload.addr_map,
            addr_number: customer.addr_number,
            addr_alley: customer.addr_alley,
            addr_street: customer.addr_street,
            addr_subdistrict: customer.addr_subdistrict,
            addr_district: customer.addr_district,
            addr_province: customer.addr_province,
            addr_postcode: customer.addr_postcode,
            date_go: payload.date_go || dayjs().tz("Asia/Bangkok").format("YYYY-MM-DD"),
            topic: payload.topic,
            next_topic: payload.next_topic,
            next_date: payload.next_date,
            rating: 0,
            created_at: payload.created_at,
            created_by: userId,
            updated_at: payload.updated_at,
            updated_by: userId,
        };
        return await prisma.customer_visit.create({
            data: setPayload,
            select: {
                customer_visit_id: true,
            }

        });
    },


    findByIdAsync: async (companyId: string, customer_visit_id: string) => {
        const CustomerVisit = await prisma.customer_visit.findFirst({
            where: {
                company_id: companyId,
                customer_visit_id: customer_visit_id
            },
            select: {
                customer_visit_id: true,
                customer_visit_doc: true,
                customer_id: true,
                customer_code: true,
                customer_name: true,
                contact_name: true,
                contact_number: true,
                line_id: true,
                addr_map: true,
                addr_number: true,
                addr_alley: true,
                addr_street: true,
                addr_subdistrict: true,
                addr_district: true,
                addr_province: true,
                addr_postcode: true,
                date_go: true,
                topic: true,
                next_topic: true,
                next_date: true,
                rating: true,

            }
        });

        if (!CustomerVisit) {
            return null;
        }
        return CustomerVisit

    },

    update: async (
        companyId: string,
        userId: string,
        customer_visit_id: string,
        payload: TypePayloadVisitCustomer
    ) => {
        const setPayload = {
            ...payload,
            updated_at: new Date(),
            updated_by: userId
        };
        return await prisma.customer_visit.update({
            where: {
                company_id: companyId,
                customer_visit_id: customer_visit_id
            },
            data: setPayload,
            select: {
                customer_visit_id: true,
                customer_visit_doc: true,
                // customer_id: true,
                customer_code: true,
                customer_name: true,
                contact_name: true,
                contact_number: true,
                line_id: true,
                addr_map: true,
                addr_number: true,
                addr_alley: true,
                addr_street: true,
                addr_subdistrict: true,
                addr_district: true,
                addr_province: true,
                addr_postcode: true,
                date_go: true,
                topic: true,
                next_topic: true,
                next_date: true,
                rating: true
            }

        });
    },
    delete: async (companyId: string, customer_visit_id: string) => {
        return await prisma.customer_visit.delete({
            where: {
                company_id: companyId,
                customer_visit_id: customer_visit_id
            },
        });
    },

    //-------------------
    findByDate: async (date: Date) => {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // เวลาเริ่มต้นของวัน
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // เวลาสิ้นสุดของวัน

        return await prisma.customer_visit.findMany({
            where: {
                created_at: {
                    gte: startOfDay, // มากกว่าหรือเท่ากับเวลาเริ่มต้น
                    lt: endOfDay, // น้อยกว่าเวลาเที่ยงคืนของวันถัดไป
                },
            },
        });
    },

};