import { PrismaClient } from "@prisma/client";
import { QUOTATION_STATUS, TypePayloadQuotation } from "./quotationModel";

const prisma = new PrismaClient();

export const quotationRepository = {
  // ดึงข้อมูลทั้งหมดพร้อม pagination
  findAll: async (
    skip: number,
    take: number,
    searchText: string,
    status: string,
    company_id: string,
  ) => {
    return await prisma.master_quotation.findMany({
      where: {
        company_id: company_id,
        ...(searchText
          ? {
              OR: [
                {
                  master_customer: {
                    customer_code: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  master_customer: {
                    customer_name: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  quotation_doc: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
              ],
              AND: {
                ...(status !== "all" ? { quotation_status: status } : {}),
              },
            }
          : { ...(status !== "all" ? { quotation_status: status } : {}) }),
      },
      include: {
        master_customer: true,
        master_brand: true,
        // master_brandmodel: true,
        // master_color: true,
      },
      skip, // จำนวนข้อมูลที่ต้องข้าม
      take, // จำนวนข้อมูลที่ต้องดึง
      orderBy: { created_at: "desc" }, // เรียงตามวันที่สร้างล่าสุด
    });
  },
   
  findAllApprove: async (
    skip: number,
    take: number,
    searchText: string,
    status: string,
    company_id: string,
  ) => {
    return await prisma.master_quotation.findMany({

      where: {
        company_id: company_id,
        ...(searchText
          ? {
              OR: [
                {
                  master_customer: {
                    customer_code: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  master_customer: {
                    contact_name: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  quotation_doc: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
              ],
              AND: {
                ...(status !== "all"
                ? { 
                    ...(status == "approved" 
                      ? { 
                        OR: [
                          {
                            quotation_status: QUOTATION_STATUS.CLOSE_DEAL,},
                          { quotation_status: QUOTATION_STATUS.APPROVED },
                        ],
                      } : {quotation_status: status}
                    )
                  }
                  : {
                    OR: [
                      { quotation_status: QUOTATION_STATUS.WAITING_FOR_APPROVE,},
                      { quotation_status: QUOTATION_STATUS.CLOSE_DEAL},
                      { quotation_status: QUOTATION_STATUS.APPROVED },
                      { quotation_status: QUOTATION_STATUS.REJECT_APPROVED },
                    ],
                  }
                ),
              },
            }
          : {
              ...(status !== "all"
                ? { 
                    ...(status == "approved" 
                      ? { 
                        OR: [
                          {
                            quotation_status: QUOTATION_STATUS.CLOSE_DEAL,},
                          { quotation_status: QUOTATION_STATUS.APPROVED },
                        ],
                      } : {quotation_status: status}
                    )
                  }
                  : {
                    OR: [
                      { quotation_status: QUOTATION_STATUS.WAITING_FOR_APPROVE,},
                      { quotation_status: QUOTATION_STATUS.CLOSE_DEAL},
                      { quotation_status: QUOTATION_STATUS.APPROVED },
                      { quotation_status: QUOTATION_STATUS.REJECT_APPROVED },
                    ],
                  }
                ),
            }
          ),
        
      },
      include: {
        master_customer: true,
        master_brand: true,
        // master_brandmodel: true,
        // master_color: true,
      },
      skip, // จำนวนข้อมูลที่ต้องข้าม
      take, // จำนวนข้อมูลที่ต้องดึง
      orderBy: { created_at: "desc" }, // เรียงตามวันที่สร้างล่าสุด
    });
  },

  // นับจำนวนข้อมูลทั้งหมด
  count: async (searchText: string, status: string, company_id: string) => {
    return await prisma.master_quotation.count({
      where: {
        company_id: company_id,
        ...(searchText
          ? {
              OR: [
                {
                  master_customer: {
                    customer_code: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  master_customer: {
                    customer_name: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
              ],
              AND: {
                ...(status !== "all" ? { quotation_status: status } : {}),
              },
            }
          : { ...(status !== "all" ? { quotation_status: status } : {}) }),
      },
    });
  },

  countApprove: async (searchText: string, status?: string, company_id?: string) => {
    return await prisma.master_quotation.count({
      where: {
        company_id: company_id,
        ...(searchText
          ? {
              OR: [
                {
                  master_customer: {
                    customer_code: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  master_customer: {
                    customer_name: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  quotation_doc: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
              ],
              AND: {
                ...(status !== "all"
                  ? { quotation_status: status }
                  : {
                      OR: [
                        {
                          quotation_status:
                            QUOTATION_STATUS.WAITING_FOR_APPROVE,
                        },
                        { quotation_status: QUOTATION_STATUS.APPROVED },
                        { quotation_status: QUOTATION_STATUS.REJECT_APPROVED },
                      ],
                    }),
              },
            }
          : {
              ...(status !== "all"
                ? { 
                    ...(status == "approved" 
                      ? { 
                        OR: [
                          {
                            quotation_status: QUOTATION_STATUS.CLOSE_DEAL,},
                          { quotation_status: QUOTATION_STATUS.APPROVED },
                        ],
                      } : {quotation_status: status}
                    )
                  }
                  : {
                    OR: [
                      { quotation_status: QUOTATION_STATUS.WAITING_FOR_APPROVE,},
                      { quotation_status: QUOTATION_STATUS.CLOSE_DEAL},
                      { quotation_status: QUOTATION_STATUS.APPROVED },
                      { quotation_status: QUOTATION_STATUS.REJECT_APPROVED },
                    ],
                  }
                ),
            }),
      },
    });
  },

  // ค้นหาด้วยเลขที่เอกสารใบเสนอราคา (quotation_doc)
  findByQuotationDoc: async (quotation_doc: string) => {
    return await prisma.master_quotation.findUnique({
      where: { quotation_id: quotation_doc },
    });
  },

  findByDate: async (date: Date) => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day
    return await prisma.master_quotation.findMany({
      where: {
        created_at: {
          gte: startOfDay, // Greater than or equal to start of the day
          lte: endOfDay, // Less than or equal to end of the day
        },
      },
    });
  },

  findById: async (id: string) => {
    return await prisma.master_quotation.findUnique({
      where: { quotation_id: id },
      include: {
        quotationRepair: true,
      },
    });
  },

  findByQuotationId: async (id: string) => {
    return await prisma.master_quotation.findUnique({
      where: { quotation_id: id },
      include: {
        master_customer: true,
        master_brand: true,
        master_brandmodel: true,
        master_color: true,
        quotationRepair: true,
        companies: true,
      },
    });
  },

  findLastQuotation: async (quotation_doc: string) => {
    return await prisma.master_quotation.findFirst({
      where: {
        quotation_doc: quotation_doc, // เงื่อนไขการค้นหา
      },
      orderBy: {
        created_at: "desc", // เรียงลำดับจากใหม่ไปเก่า (แก้ไข field เป็น field ที่เก็บเวลาสร้างจริง)
      },
    });
  },

  // สร้างข้อมูลใหม่
  create: async (payload: TypePayloadQuotation) => {
    return await prisma.master_quotation.create({
      data: {
        quotation_doc: payload.quotation_doc,
        customer_id: payload.customer_id,
        addr_map: payload.addr_map,
        addr_number: payload.addr_number,
        addr_alley: payload.addr_alley,
        addr_street: payload.addr_street,
        addr_subdistrict: payload.addr_subdistrict,
        addr_district: payload.addr_district,
        addr_province: payload.addr_province,
        addr_postcode: payload.addr_postcode,
        customer_name: payload.customer_name,
        position: payload.position,
        contact_number: payload.contact_number,
        line_id: payload.line_id,

        responsible_by: payload.responsible_by,
        responsible_date: payload.responsible_date,
        quotation_status: payload.quotation_status,

        company_id: payload.company_id,

        created_by: payload.created_by,
        updated_by: payload.updated_by,
      },
    });
  },

  // อัปเดตข้อมูล
  update: async (
    quotation_id: string,
    payload: Partial<TypePayloadQuotation>
  ) => {
    return await prisma.master_quotation.update({
      where: { quotation_id: quotation_id },
      data: {
        addr_map: payload.addr_map,
        addr_number: payload.addr_number,
        addr_alley: payload.addr_alley,
        addr_street: payload.addr_street,
        addr_subdistrict: payload.addr_subdistrict,
        addr_district: payload.addr_district,
        addr_province: payload.addr_province,
        addr_postcode: payload.addr_postcode,
        customer_name: payload.customer_name,
        position: payload.position,
        contact_number: payload.contact_number,
        line_id: payload.line_id,

        image_url: payload.image_url,

        brand_id: payload.brand_id,
        model_id: payload.model_id,
        car_year: payload.car_year,
        car_color_id: payload.car_color_id,
        total_price: payload.total_price,
        tax: payload.tax,
        deadline_day: payload.deadline_day,
        appointment_date: payload.appointment_date,
        remark: payload.remark,

        insurance: payload.insurance,
        insurance_date: payload.insurance_date,

        is_box_detail: payload.is_box_detail,

        // lock: payload.lock,

        // quotation_status: payload.quotation_status,
        // approval_date: payload.approval_date,
        // approval_by: payload.approval_by,
        // approval_notes: payload.approval_notes,
        // deal_closed_status: payload.deal_closed_status,
        // deal_closed_date: payload.deal_closed_date,
        // deal_closed_by: payload.deal_closed_by,

        updated_by: payload.updated_by,
        responsible_by: payload.responsible_by,
      },
    });
  },

  requestApprove: async (
    quotation_id: string,
    payload: Partial<TypePayloadQuotation>
  ) => {
    return await prisma.master_quotation.update({
      where: { quotation_id: quotation_id },
      data: {
        quotation_status: payload.quotation_status,
      },
    });
  },

  requestEdit: async (
    quotation_id: string,
    payload: Partial<TypePayloadQuotation>
  ) => {
    return await prisma.master_quotation.update({
      where: { quotation_id: quotation_id },
      data: {
        quotation_status: payload.quotation_status,
      },
    });
  },

  approve: async (
    quotation_id: string,
    payload: Partial<TypePayloadQuotation>
  ) => {
    return await prisma.master_quotation.update({
      where: { quotation_id: quotation_id },
      data: {
        quotation_status: payload.quotation_status,
        approval_date: payload.approval_date,
        approval_by: payload.approval_by,
        approval_notes: payload.approval_notes,
      },
    });
  },

  closeDeal: async (
    quotation_id: string,
    payload: Partial<TypePayloadQuotation>
  ) => {
    return await prisma.master_quotation.update({
      where: { quotation_id: quotation_id },
      data: {
        quotation_status: payload.quotation_status,
        deal_closed_date: payload.deal_closed_date,
        deal_closed_by: payload.deal_closed_by,
      },
    });
  },

  reject: async (
    quotation_id: string,
    payload: Partial<TypePayloadQuotation>
  ) => {
    const quotation = await prisma.master_quotation.update({
      where: { quotation_id: quotation_id },
      data: {
        quotation_status: payload.quotation_status,
        approval_date: payload.approval_date,
        approval_by: payload.approval_by,
        approval_notes: payload.approval_notes,
      },
    });

    // if(quotation){
    //   await prisma.master_repair_receipt.updateMany({ where: { quotation_id: quotation_id }, data: { repair_receipt_status: payload.quotation_status } });
    // }
    return quotation
  },

  cancel: async (
    quotation_id: string,
    payload: Partial<TypePayloadQuotation>
  ) => {
    return await prisma.master_quotation.update({
      where: { quotation_id: quotation_id },
      data: {
        quotation_status: payload.quotation_status,
      },
    });
  },

  // ลบข้อมูล
  delete: async (quotation_id: string) => {
    return await prisma.master_quotation.delete({
      where: { quotation_id },
    });
  },

  // ดึงเฉพาะ quotation_doc
  findQuotationDocs: async (companyId: string) => {
    return await prisma.master_quotation.findMany({
      where: {company_id: companyId },
      select: {
        quotation_id: true,
        quotation_doc: true,
      },
    });
  },

  findResponsibleBy: async (quotationDoc: string) => {
    return await prisma.master_quotation.findMany({
      where: {
        quotation_doc: quotationDoc,
      },
      select: {
        responsible_by: true,
        responsible_by_profile: {
          select: {
            username: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
  },
  checkQuotation: async (companyId: string, key: string, value: string) => {
    const whereCondition: any = { company_id: companyId };
    whereCondition[key] = value; // กำหนดค่าแบบไดนามิก
  
    return await prisma.master_quotation.findFirst({
      where: whereCondition,
    });
  },
  
  showCalendarRemoval : async (companyId: string ,  startDateFilter: string , endDateFilter: string) => {
    return await prisma.master_quotation.findMany({
      where: {
        company_id: companyId,
        is_deleted: false,
        NOT: { appointment_date : null },
        appointment_date: { gte : startDateFilter , lte: endDateFilter}
      },
      select: {
          quotation_doc: true,
          appointment_date: true,
          addr_number: true,
          addr_alley: true,
          addr_street: true,
          addr_subdistrict: true,
          addr_district: true,
          addr_province: true,
          customer_name: true,
          contact_number: true,
          master_repair_receipt: {
            select: {
              id: true,
              repair_receipt_doc: true,
              expected_delivery_date: true,
              register: true,
              master_delivery_schedule: {
                select: {
                  status: true,
                }
              }
            },
          },
          master_customer: {
            select: {
              customer_name: true,
            },
          },
          master_brand: {
            select: {
              brand_name: true,
            },
          },
          master_brandmodel: {
            select: {
              brandmodel_name: true,
            },
          },
          master_color: {
            select: {
              color_name: true,
            },
          },
        },
    })
  }

};
