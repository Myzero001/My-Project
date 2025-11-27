import { PrismaClient } from "@prisma/client";
import { TypePayloadDeliverySchedule } from "./deliveryScheduleModel";
import { REPAIR_RECEIPT_STATUS } from "@modules/ms-repair-receipt/repairReceiptModel";
import { sendForAClaimListRepository } from "@modules/send-for-a-claim-list/sendForAClaimListRepository";

const prisma = new PrismaClient();

export const deliveryScheduleRepository = {
  // ดึงข้อมูลทั้งหมดพร้อม pagination
  findAll: async (
    companyId: string,
    skip: number,
    take: number,
    searchText?: string,
    status?: string
  ) => {
    return await prisma.master_delivery_schedule.findMany({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  delivery_schedule_doc: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
                {
                  master_repair_receipt: {
                    repair_receipt_doc: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  master_repair_receipt: {
                    master_quotation: {
                      master_customer: {
                        contact_name: {
                          contains: searchText,
                          mode: "insensitive",
                        },
                      },
                    },
                  },
                },
              ],
              AND: {
                ...(status !== "all" ? { status: status } : {}),
              },
            }
          : { ...(status !== "all" ? { status: status } : {}) }),
      },
      include: {
        master_repair_receipt: {
          include: {
            master_quotation: {
              include: {
                master_brand: true,
                master_brandmodel: true,
                master_color: true,
                master_customer: true,
              },
            },
          },
        },
      },
      skip,
      take,
      orderBy: { created_at: "desc" },
    });
  },

  showDeliverySchedule: async (companyId: string , startDateFilter: string , endDateFilter: string ) => {
    return await prisma.master_delivery_schedule.findMany({
      where: {
        company_id: companyId,
        delivery_date : {gte : startDateFilter , lte: endDateFilter}
        ,
        status: "success"
      },
      select: {
        id: true,
        delivery_schedule_doc: true,
        customer_name: true,
        contact_number: true,
        delivery_date: true,
        master_repair_receipt: {
          select: {
            id: true,
            repair_receipt_doc: true,
            master_quotation:{
              select: {
                quotation_id: true,
                total_price: true,
                master_brand: {select: { master_brand_id: true , brand_name: true }},
                master_brandmodel: { select: { ms_brandmodel_id: true , brandmodel_name: true}}
              }
            },
            register: true,
          }
        },
        status: true,
      }
    })
  },

  // นับจำนวนข้อมูลทั้งหมด
  count: async (companyId: string, searchText?: string, status?: string) => {
    return await prisma.master_delivery_schedule.count({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  delivery_schedule_doc: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
                {
                  master_repair_receipt: {
                    repair_receipt_doc: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  master_repair_receipt: {
                    master_quotation: {
                      master_customer: {
                        contact_name: {
                          contains: searchText,
                          mode: "insensitive",
                        },
                      },
                    },
                  },
                },
              ],
              AND: {
                ...(status !== "all" ? { status: status } : {}),
              },
            }
          : { ...(status !== "all" ? { status: status } : {}) }),
      },
    });
  },

  findAllNoPagination: async (company_id: string) => {
    return await prisma.master_delivery_schedule.findMany({
      where: {company_id: company_id},
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
  },

  select: async  (companyId: string , searchText : string) => {
    const data = await prisma.master_delivery_schedule.findMany({
      where: {
        company_id: companyId,
        ...(searchText && {
              delivery_schedule_doc: {
                contains: searchText,
                mode: 'insensitive'
            },
        }),
      },
      skip : 0,
      take : 50,
      select: {
        id : true,
        delivery_schedule_doc: true
      },
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
    return data;
  },

  findAllPaymentNoPagination: async (company_id: string) => {
    return await prisma.master_delivery_schedule.findMany({
      where: {
        company_id: company_id,
        master_repair_receipt: {
          repair_receipt_status: REPAIR_RECEIPT_STATUS.PENDING || REPAIR_RECEIPT_STATUS.SUCCESS
        }
      },
      include:{
        master_repair_receipt: true,
        master_payment: true
      },
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
  },

  findByDate: async (date: Date) => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day
    return await prisma.master_delivery_schedule.findMany({
      where: {
        created_at: {
          gte: startOfDay, // Greater than or equal to start of the day
          lte: endOfDay, // Less than or equal to end of the day
        },
      },
    });
  },

  findAllById: async (id: string) => {
    return await prisma.master_delivery_schedule.findUnique({
      where: { id },
      include: {
        master_repair_receipt: {
          include: {
            master_quotation: {
              include: {
                master_brand: true,
                master_brandmodel: true,
                master_color: true,
                master_customer: true,
              },
            },
          },
        },
        companies: true,
      },
    });
  },

  findById: async (id: string) => {
    return await prisma.master_delivery_schedule.findUnique({
      where: { id },
      include: {
        companies: true,
      },
    });
  },

  findByRepairReceiptIdAndCompany: async (
    repair_receipt_id: string,
    company_id: string
  ) => {
    return await prisma.master_delivery_schedule.findFirst({
      where: {
        repair_receipt_id,
        company_id,
      },
    });
  },

  // สร้างข้อมูลใหม่
  create: async (payload: TypePayloadDeliverySchedule) => {
    return await prisma.master_delivery_schedule.create({
      data: {
        delivery_schedule_doc: payload.delivery_schedule_doc,
        repair_receipt_id: payload.repair_receipt_id,
        delivery_date: payload.delivery_date,
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
        created_by: payload.created_by ?? "",
        updated_by: payload.updated_by ?? "",
        company_id: payload.company_id,

        status: payload.status,
      },
    });
  },

  // อัปเดตข้อมูล
  updateHome: async (
    id: string,
    payload: Partial<TypePayloadDeliverySchedule>
  ) => {
    return await prisma.master_delivery_schedule.update({
      where: { id },
      data: {
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

        delivery_date: payload.delivery_date,
        delivery_location: payload.delivery_location,
        delivery_schedule_image_url: payload.delivery_schedule_image_url,
        remark: payload.remark,
        updated_by: payload.updated_by,
      },
    });
  },

  requestDelivery: async (
    id: string,
    payload: Partial<TypePayloadDeliverySchedule>
  ) => {
    const deliverySchedule = await prisma.master_delivery_schedule.update({
      where: { id: id },
      data: {
        status: payload.status,
      },
    });
    if (deliverySchedule) {
      await prisma.master_repair_receipt.update({
        where: { id: deliverySchedule.repair_receipt_id },
        data: {
          repair_receipt_status: payload.status,
          updated_by: payload.updated_by,
        },
      })
    }
    return deliverySchedule;
  },

  // ลบข้อมูล
  delete: async (id: string) => {
    return await prisma.master_delivery_schedule.delete({
      where: { id },
    });
  },

  findOverduePayments: async (
  companyId: string,
  searchText: string
) => {
  // สร้างเงื่อนไขการค้นหา (where clause) แบบ dynamic
  const whereCondition: any = {
    status: "success",
    company_id: companyId,
    master_repair_receipt: {
      total_price: {
        gt: 0, // ดึงเฉพาะรายการที่มีราคารวมมากกว่า 0
      },
    },
  };

  // เพิ่มเงื่อนไขการค้นหาถ้ามี searchText
  if (searchText) {
    whereCondition.OR = [
      {
        master_repair_receipt: {
          repair_receipt_doc: {
            contains: searchText,
            mode: "insensitive",
          },
        },
      },
      {
        master_repair_receipt: {
          master_quotation: {
            customer_name: {
              contains: searchText,
              mode: "insensitive",
            },
          },
        },
      },
      {
        master_repair_receipt: {
          master_quotation: {
            quotation_doc: {
              contains: searchText,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  // ดึงข้อมูลทั้งหมดที่เข้าเงื่อนไข โดย *ไม่* ทำ pagination ในขั้นตอนนี้
  const payments = await prisma.master_delivery_schedule.findMany({
    where: whereCondition,
    include: {
      master_repair_receipt: {
        include: {
          master_quotation: {
            select: {
              quotation_id: true,
              quotation_doc: true,
              customer_name: true,
            },
          },
        },
      },
      master_payment: true, // ดึงข้อมูลการชำระเงินทั้งหมดมาด้วย
    },
    orderBy: { created_at: "desc" },
  });

  // ส่งข้อมูลที่ยังไม่ได้กรองยอดค้างชำระกลับไปทั้งหมด
  return payments; 
},

  findCustomersByCompanyId: async (companyId: string, dateRange?: string) => {
    // Calculate the date range based on the parameter
    let startDate: Date | undefined;
    const currentDate = new Date();
    
    if (dateRange) {
      switch (dateRange) {
        case '7days':
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
          break;
        case '15days':
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 15);
          break;
        case '30days':
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 30);
          break;
        case '3months':
          startDate = new Date(currentDate);
          startDate.setMonth(currentDate.getMonth() - 3);
          break;
        case '1year':
          startDate = new Date(currentDate);
          startDate.setFullYear(currentDate.getFullYear() - 1);
          break;
        default:
          // No date filter if invalid range provided
          startDate = undefined;
      }
    }
    
    return await prisma.master_delivery_schedule.findMany({
      where: {
        company_id: companyId,
        ...(startDate ? {
          created_at: {
            gte: startDate
          }
        } : {})
      },
      select: {
        master_repair_receipt: {
          include: {
            master_quotation: {
              include: {
                master_customer: {
                  select: {
                    customer_id: true,
                    customer_code: true,
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
                    created_at: true,
                    master_quotation: {
                      select: {
                        quotation_id: true,
                        quotation_doc: true,
                        total_price: true,
                        master_repair_receipt: {
                          select: {
                            id: true,
                            repair_receipt_doc: true,
                            repair_receipt_status: true,
                            total_price: true,
                            master_delivery_schedule: {
                              select: {
                                delivery_schedule_doc: true,
                                delivery_location: true,
                                delivery_schedule_image_url: true,
                                delivery_date: true,
                                remark: true,
                                status: true,
                                master_payment: {
                                  select: {
                                    payment_doc: true,
                                    price: true,
                                    type_money: true,
                                    status: true,
                                  }
                                }
                              },
                            }
                          },
                        }
                      },
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  },

  findInactiveCustomersByCompanyId: async (companyId: string, dateRange?: string) => {
    // Calculate the date range based on the parameter
    let inactivityThreshold: Date | undefined;
    const currentDate = new Date();
    
    if (dateRange) {
      switch (dateRange) {
        case '15days':
          inactivityThreshold = new Date(currentDate);
          inactivityThreshold.setDate(currentDate.getDate() - 15);
          break;
        case '30days':
          inactivityThreshold = new Date(currentDate);
          inactivityThreshold.setDate(currentDate.getDate() - 30);
          break;
        case '1month':
          inactivityThreshold = new Date(currentDate);
          inactivityThreshold.setMonth(currentDate.getMonth() - 1);
          break;
        case '3months':
          inactivityThreshold = new Date(currentDate);
          inactivityThreshold.setMonth(currentDate.getMonth() - 3);
          break;
        case '6months':
          inactivityThreshold = new Date(currentDate);
          inactivityThreshold.setMonth(currentDate.getMonth() - 6);
          break;
        case '1year':
          inactivityThreshold = new Date(currentDate);
          inactivityThreshold.setFullYear(currentDate.getFullYear() - 1);
          break;
        default:
          // No date filter if invalid range provided
          inactivityThreshold = undefined;
      }
    }
    
    return await prisma.master_delivery_schedule.findMany({
      where: {
        company_id: companyId,
        // Note: We want to get ALL customers and filter for inactivity in the service layer
      },
      select: {
        created_at: true,
        updated_at: true,
        master_repair_receipt: {
          select: {
            id: true,
            created_at: true,
            updated_at: true,
            master_quotation: {
              select: {
                quotation_id: true,
                quotation_doc: true,
                total_price: true,
                created_at: true,
                updated_at: true,
                master_customer: {
                  select: {
                    customer_id: true,
                    customer_code: true,
                    contact_name: true,
                    contact_number: true,
                    customer_prefix: true,
                    line_id: true,
                    addr_number: true,
                    addr_alley: true,
                    addr_street: true,
                    addr_subdistrict: true,
                    addr_district: true,
                    addr_province: true,
                    addr_postcode: true,
                    created_at: true,
                    updated_at: true,
                    master_quotation: {
                      select: {
                        quotation_id: true,
                        quotation_doc: true,
                        total_price: true,
                        created_at: true,
                        updated_at: true,
                        master_repair_receipt: {
                          select: {
                            id: true,
                            repair_receipt_doc: true,
                            repair_receipt_status: true,
                            total_price: true,
                            created_at: true,
                            updated_at: true,
                            master_delivery_schedule: {
                              select: {
                                delivery_schedule_doc: true,
                                delivery_location: true,
                                delivery_schedule_image_url: true,
                                delivery_date: true,
                                remark: true,
                                status: true,
                                created_at: true,
                                updated_at: true,
                                master_payment: {
                                  select: {
                                    payment_doc: true,
                                    price: true,
                                    type_money: true,
                                    status: true,
                                    created_at: true,
                                    updated_at: true,
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  },
  
};
