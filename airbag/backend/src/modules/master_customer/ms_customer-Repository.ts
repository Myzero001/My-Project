import { master_customer } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadMasterCustomer } from "@modules/master_customer/ms_customer-Model";

const keys = [
  "customer_id",
  "customer_code", // รหัสลูกค้า (สำคัญมาก ควรเป็นคีย์หลักหรือใช้บ่อยในระบบ)
  "customer_name", // ชื่อลูกค้า (สำหรับแสดงผลและค้นหา)
  "contact_name", // ชื่อผู้ติดต่อ (สำคัญสำหรับการติดต่อลูกค้า)
  "customer_prefix", // คํานําหน้าชื่อ (สำหรับแสดงผลและค้นหา)
  "contact_number", // เบอร์ติดต่อ (สำหรับการสื่อสารกับลูกค้า)
  "customer_position", // ตําแหน่ง (สำหรับแสดงผลและค้นหา)
  "contact_number", // เบอร์ติดต่อ (สำหรับการสื่อสารกับลูกค้า)
  "tax",
  "line_id", // ชื่อไลน์ (สำหรับการติดต่อลูกค้า)
  "addr_number", // เลขที่ (สำหรับการติดต่อลูกค้า)
  "addr_alley", // ถนน (สำหรับการติดต่อลูกค้า)
  "addr_street", // ถนน (สำหรับการติดต่อลูกค้า)
  "addr_subdistrict", // ตําบล (สำหรับการติดต่อลูกค้า)
  "addr_district", // อําเภอ (สำหรับการติดต่อลูกค้า)
  "addr_province", // จังหวัด (สำหรับการติดต่อลูกค้า)
  "addr_postcode", // รหัสไปรษณีย์ (สำหรับการติดต่อลูกค้า)
  "payment_terms", // ข้อตกลงการชําระเงิน (สำหรับการติดต่อลูกค้า)
  "payment_terms_day", // จํานวนวัน (สำหรับการติดต่อลูกค้า)
  "comment_customer", // หมายเหตุ (สำหรับการติดต่อลูกค้า)
  "comment_sale", // หมายเหตุ (สำหรับการติดต่อลูกค้า)
  "competitor", // คู่ค้า (สำหรับการติดต่อลูกค้า)
  "created_at", // วันที่สร้าง (สำหรับการติดต่อลูกค้า)
  "image_url",
  "customer_tin"
];

const prisma = new PrismaClient();


export const customerRepository = {
  findAll: async (companyId: string, skip: number, take: number, searchText: string) => {
    return await prisma.master_customer.findMany({
      where: {
        company_id: companyId,
        ...(searchText && {
          OR: [
            {
              customer_name: {
                contains: searchText,
                mode: 'insensitive'
              }
            },
            {
              customer_code: {
                contains: searchText,
                mode: 'insensitive'
              }
            },
            {
              contact_number: {
                contains: searchText,
                mode: 'insensitive'
              }
            }
            ,
            {
              contact_name: {
                contains: searchText,
                mode: 'insensitive'
              }
            }
          ],
        }),
      },
      skip,
      take,
      orderBy: { created_at: "asc" },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    })
  },


  findAllNoPagination:  (companyId: string) => {
    return  prisma.master_customer.findMany({
      where: {
        company_id: companyId,
      },
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
  },

  select: async  (companyId: string , searchText : string) => {
    const data = await prisma.master_customer.findMany({
      where: {
        company_id: companyId,
        ...(searchText && {

              customer_code: {
                contains: searchText,
                mode: 'insensitive'
              
            },
        }),
      },
      skip : 0,
      take : 50,
      select: {
        customer_id : true,
        customer_code: true
      },
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
    

    return data;
  },

  count: async (companyId: string, searchText: string) => {
    return await prisma.master_customer.count({
      where: {
        company_id: companyId, // เพิ่มเงื่อนไข companyId
        ...(searchText && {
          OR: [
            {
              customer_name: {
                contains: searchText,
                mode: 'insensitive'
              }
            },
            {
              customer_code: {
                contains: searchText,
                mode: 'insensitive'
              }
            },
            {
              contact_number: {
                contains: searchText,
                mode: 'insensitive'
              }
            }
            ,
            {
              contact_name: {
                contains: searchText,
                mode: 'insensitive'
              }
            }
          ],
        }),
      },
    });
  },



  findByName: async (companyId: string, customer_code: string) => {
    return await prisma.master_customer.findFirst({
      where: { company_id: companyId, customer_code: customer_code },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
  },
  findById: async (companyId: string, customer_id: string) => {
    return prisma.master_customer.findFirst({
      where: { company_id: companyId, customer_id: customer_id },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
  },

  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadMasterCustomer
  ) => {
    const customer_code = payload.customer_code;

    const setPayload: any = {
      company_id: companyId,
      customer_code: payload.customer_code,
      created_by: userId,
      updated_by: userId,
    };
    return await prisma.master_customer.create({
      data: setPayload,
      select: {
        customer_id: true,
        customer_code: true,
        created_at: true
      }
    });
  },

  createWithRequiredFields: async (
    companyId: string,
    userId: string,
    payload: TypePayloadMasterCustomer
  ) => {
    const setPayload: any = {
      company_id: companyId,
      customer_code: payload.customer_code,
      customer_prefix: payload.customer_prefix,
      customer_name: payload.customer_name,
      contact_name: payload.contact_name,
      contact_number: payload.contact_number,
      created_by: userId,
      updated_by: userId,
    };
    return await prisma.master_customer.create({
      data: setPayload,
      select: {
        customer_id: true,
        customer_code: true,
        created_at: true,
      },
    });
  },

  update: async (
    companyId: string,
    userId: string,
    customer_id: string,
    payload: TypePayloadMasterCustomer
  ) => {
    const setPayload = {
      customer_code: payload.customer_code,
      customer_prefix: payload.customer_prefix,
      customer_name: payload.customer_name,
      contact_name: payload.contact_name,
      customer_position: payload.customer_position,
      contact_number: payload.contact_number,
      line_id: payload.line_id,
      addr_number: payload.addr_number,
      image_url: Array.isArray(payload.image_url) && payload.image_url.length === 0 
      ? null 
      : payload.image_url,
      addr_alley: payload.addr_alley,
      addr_street: payload.addr_street,
      addr_subdistrict: payload.addr_subdistrict,
      addr_district: payload.addr_district,
      addr_province: payload.addr_province,
      addr_postcode: payload.addr_postcode,
      payment_terms: payload.payment_terms,
      payment_terms_day: payload.payment_terms_day,
      tax: payload.tax,
      comment_customer: payload.comment_customer,
      comment_sale: payload.comment_sale,
      competitor: payload.competitor,
      updated_at: payload.updated_at || new Date(),
      updated_by: userId,
      customer_tin : payload.customer_tin
      //หากมีฟิลด์เพิ่มเติมที่ต้องการบันทึก ให้ระบุที่นี่
    };
    return await prisma.master_customer.update({
      where: { company_id: companyId, customer_id: customer_id },
      data: setPayload,
      select: {
        customer_id: true,
        customer_code: true,
        created_at: true
      }
    });
  },

  delete: async (companyId: string, customer_id: string) => {
    if (!customer_id) {
      throw new Error("Customer ID is required");
    }

    const customer = await prisma.master_customer.findFirst({
      where: { company_id: companyId, customer_id: customer_id },
    });

    if (!customer) {
      console.error(`Customer with ID ${customer_id} not found`);
      throw new Error("Customer not found");
    }

    return await prisma.master_customer.delete({
      where: { customer_id: customer_id },
    });
  },
  search: async (query: string) => {
    return await prisma.master_customer.findMany({
      where: {
        customer_name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
  },
};
