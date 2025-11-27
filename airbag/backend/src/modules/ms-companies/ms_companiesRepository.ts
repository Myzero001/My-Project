import { companies } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TypePayloadMastercompanies } from "@modules/ms-companies/ms_companiesModel";
import { string } from "zod";
const keys = [
  "company_id",
  "company_name",
  //"company_address",
  "company_main",
  "company_code",
  "tax_status",
  "tel_number",
  "company_tin",
  "addr_number",
  "addr_alley",
  "addr_street",
  "addr_subdistrict",
  "addr_district",
  "addr_province",
  "addr_postcode",
  "promtpay_id",
];

const prisma = new PrismaClient();

export const companiesRepository = {
  findAll: async (
    companyId: string,
    skip: number,
    take: number,
    searchText: string
  ) => {
    return await prisma.companies.findMany({
      where: searchText
        ? {
            OR: [
              {
                company_name: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
              {
                company_code: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}, // ถ้าไม่มี searchText ก็ไม่ต้องใช้เงื่อนไขพิเศษ
      skip,
      take,
      orderBy: { created_at: "asc" },
    });
  },
  count: async (companyId: string, searchText: string) => {
    return await prisma.companies.count({
      where: {
        company_id: companyId, // เพิ่มเงื่อนไข companyId
        ...(searchText && {
          OR: [
            {
              company_name: {
                contains: searchText,
                mode: "insensitive",
              },
            },
            {
                company_code: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
            
          ],
        }),
      },
    });
  },
  findByName: async (companyId: string, company_name: string) => {
    if (!companyId) {
      throw new Error("Company ID is required");
    }
    return prisma.companies.findFirst({
      where: { company_id: companyId, company_name: company_name },
    });
  },
  findById: async (conpanyId: string) => {
    return await prisma.companies.findUnique({
      where: { company_id: conpanyId },
      select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    });
  },
  findByIdCompany: async (id: string) => {
    return await prisma.companies.findUnique({
      where: { company_id: id },
    });
  },
  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadMastercompanies
  ) => {
    try {
      const setPayload = {
        company_name: payload.company_name.trim(),
        company_code: payload.company_code,
        tax_status: payload.tax_status,
        tel_number: payload.tel_number,
        created_by: userId, // ใช้ userId จาก token
        updated_by: userId, // ใช้ userId จาก token
        company_tin: payload.company_tin,
        
        addr_number: payload.addr_number,
        addr_alley: payload.addr_alley,
        addr_street: payload.addr_street,
        addr_subdistrict: payload.addr_subdistrict,
        addr_district: payload.addr_district,
        addr_province: payload.addr_province,
        addr_postcode: payload.addr_postcode,
        promtpay_id: payload.promtpay_id
      };

      return await prisma.companies.create({
        data: setPayload,
      });
    } catch (error) {
      console.error(`Error creating company: ${error}`);
      throw error;
    }
  },

  update: async (
    company_id: string,
    userId: string,
    payload: TypePayloadMastercompanies
  ) => {
    const setPayload = {
      company_name: payload.company_name,
      
      company_code: payload.company_code,
      tax_status: payload.tax_status,
      tel_number: payload.tel_number,
      updated_at: new Date(),
      updated_by: userId, // ใช้ userId จาก token
      company_tin: payload.company_tin,
      addr_number: payload.addr_number,
      addr_alley: payload.addr_alley,
      addr_street: payload.addr_street,
      addr_subdistrict: payload.addr_subdistrict,
      addr_district: payload.addr_district,
      addr_province: payload.addr_province,
      addr_postcode: payload.addr_postcode,
      promtpay_id: payload.promtpay_id
    };
    return await prisma.companies.update({
      where: { company_id: company_id },
      data: setPayload,
    });
  },

  delete: async (company_id: string) => {
    return await prisma.companies.delete({
      where: { company_id: company_id },
    });
  },
};
