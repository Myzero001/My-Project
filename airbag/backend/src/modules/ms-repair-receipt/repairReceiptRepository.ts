import { PrismaClient , Prisma } from "@prisma/client";
import { TypePayloadRepairReceipt, RepairDocItem , REPAIR_RECEIPT_STATUS } from "./repairReceiptModel";

const prisma = new PrismaClient();

export const repairReceiptRepository = {
  // ดึงข้อมูลทั้งหมดพร้อม pagination
  findAll: async (
    companyId: string,
    skip: number,
    take: number,
    searchText?: string,
    status?: string
  ) => {
    return await prisma.master_repair_receipt.findMany({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  repair_receipt_doc: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
                {
                  master_quotation: {
                    quotation_doc: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  master_quotation: {
                    OR:[
                      {
                        master_customer: {
                          contact_name: {
                            contains: searchText,
                            mode: "insensitive",
                          },
                        },
                      },
                      {
                        contact_number: {
                          contains: searchText,
                          mode: "insensitive",
                        },
                      },
                    ]
                  },
                },
                {
                  master_quotation: {
                    master_brand: {
                      brand_name: {
                        contains: searchText,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
              AND: {
                ...(status !== "all" ? { repair_receipt_status: status } : {}),
              },
            }
          : { ...(status !== "all" ? { repair_receipt_status: status } : {}) }),
      },
      select: {
        id: true,
        repair_receipt_doc: true,
        master_quotation: { 
          select: { 
            quotation_id: true,
            quotation_doc: true,
            master_customer: { select: { customer_id: true , contact_name: true }},
            contact_number: true,
            master_brand: { select: { master_brand_id: true , brand_name: true}},
            is_box_detail: true
          } ,
        },
        
        total_price: true,
        repair_receipt_status: true
      },
      // include: {
      //   master_quotation: {
      //     include: {
      //       master_brand: true,
      //       master_brandmodel: true,
      //       master_color: true,
      //       master_customer: true,
      //     },
      //   },
      //   master_issue_reason: true,
      //   master_tool_one: true,
      //   master_clear_by_one: true,
      //   master_clear_by_three: true,
      //   master_clear_by_two: true,
      //   master_tool_three: true,
      //   master_tool_two: true,
      //   master_tooling_reason_one: true,
      //   master_tooling_reason_three: true,
      //   master_tooling_reason_two: true,
      // },
      skip,
      take,
      orderBy: { created_at: "desc" }
    });
  },

  // นับจำนวนข้อมูลทั้งหมด
  count: async (companyId: string, searchText?: string, status?: string) => {
    return await prisma.master_repair_receipt.count({
      where: {
        company_id: companyId,
        ...(searchText
          ? {
              OR: [
                {
                  repair_receipt_doc: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
                {
                  master_quotation: {
                    quotation_doc: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  master_quotation: {
                    master_customer: {
                      contact_name: {
                        contains: searchText,
                        mode: "insensitive",
                      },
                    },
                  },
                },
                {
                  register: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                },
                {
                  master_quotation: {
                    master_brandmodel: {
                      brandmodel_name: {
                        contains: searchText,
                        mode: "insensitive",
                      },
                    },
                  },
                },
                {
                  master_quotation: {
                    appointment_date: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  master_quotation: {
                    deal_closed_date: {
                      contains: searchText,
                      mode: "insensitive",
                    },
                  },
                },
              ],
              AND: {
                ...(status !== "all" ? { repair_receipt_status: status } : {}),
              },
            }
          : { ...(status !== "all" ? { repair_receipt_status: status } : {}) }),
      },
    });
  },

  findAllNoPagination: async (company_id: string) => {
    return await prisma.master_repair_receipt.findMany({
      where: {company_id: company_id},
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
  },

  select: async  (companyId: string , searchText : string) => {
    const data = await prisma.master_repair_receipt.findMany({
      where: {
        company_id: companyId,
        
        ...(searchText && {
              repair_receipt_doc: {
                contains: searchText,
                mode: 'insensitive'
            },
        }),
      },
      skip : 0,
      take : 50,
      select: {
        id : true,
        repair_receipt_doc: true
      },
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
    

    return data;
  },

  findAllNotDeliveryNoPagination: async (company_id: string) => {
    return await prisma.master_repair_receipt.findMany({
      where: {
        company_id: company_id,
        master_delivery_schedule: {
          none: {}, // เงื่อนไข none หมายถึงไม่มีความสัมพันธ์ใด ๆ ในตาราง master_delivery_schedule
        },
      },
      orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
    });
  },

  findByDate: async (date: Date) => {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day
    return await prisma.master_repair_receipt.findMany({
      where: {
        created_at: {
          gte: startOfDay, // Greater than or equal to start of the day
          lte: endOfDay, // Less than or equal to end of the day
        },
      },
    });
  },

  findAllById: async (id: string) => {
    return await prisma.master_repair_receipt.findUnique({
      where: { id },
      include: {
        master_quotation: {
          include: {
            master_brand: true,
            master_brandmodel: true,
            master_color: true,
            master_repair_receipt: true,
            master_customer: true,
            quotationRepair: true,
          },
        },
        master_issue_reason: true,
        master_tool_one: true,
        master_clear_by_one: true,
        master_clear_by_three: true,
        master_clear_by_two: true,
        master_tool_three: true,
        master_tool_two: true,
        master_tooling_reason_one: true,
        master_tooling_reason_three: true,
        master_tooling_reason_two: true,
      },
    });
  },

  findById: async (id: string) => {
    return await prisma.master_repair_receipt.findUnique({
      where: { id },
      include: {
        master_quotation: {
          include: {
            master_customer: true,
          },
        },
      },
    });
  },

  findQuotationByRepairReceiptId: async (repairReceiptId: string) => {
    return await prisma.master_repair_receipt.findMany({
      where: { id: repairReceiptId },
      include: {
        master_quotation: {
          include: {
            master_customer: true,
          },
        },
      },
    });
  },

  findByQuotationId: async (id: string) => {
    return await prisma.master_repair_receipt.findMany({
      where: { quotation_id: id },
      include: {
        master_quotation: true,
        master_issue_reason: true,
        master_tool_one: true,
        master_clear_by_one: true,
        master_clear_by_three: true,
        master_clear_by_two: true,
        master_tool_three: true,
        master_tool_two: true,
        master_tooling_reason_one: true,
        master_tooling_reason_three: true,
        master_tooling_reason_two: true,
      },
    });
  },

  findLastRepairReceipt: async (id: string) => {
    return await prisma.master_repair_receipt.findFirst({
      where: {
        id,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  },

  // สร้างข้อมูลใหม่
  create: async (payload: TypePayloadRepairReceipt, company_id: string) => {
    const dateNow = new Date();
    const year = dateNow.getFullYear();
    const month = String(dateNow.getMonth() + 1).padStart(2, '0'); 
    const day = String(dateNow.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return await prisma.master_repair_receipt.create({
      data: {
        repair_receipt_doc: payload.repair_receipt_doc,
        repair_receipt_status: payload.repair_receipt_status,
        quotation_id: payload.quotation_id,
        repair_receipt_at: formattedDate,
        estimated_date_repair_completion: formattedDate,
        expected_delivery_date: formattedDate,

        created_by: payload.created_by ?? "",
        updated_by: payload.updated_by ?? "",
        responsible_by: payload.responsible_by,

        total_price: payload.total_price,
        tax: payload.tax,
        company_id: company_id,
      },
    });
  },

  // อัปเดตข้อมูล
  updateHome: async (
    id: string,
    payload: Partial<TypePayloadRepairReceipt>
  ) => {
    return await prisma.master_repair_receipt.update({
      where: { id },
      data: {
        register: payload.register,
        box_number: payload.box_number,
        box_number_detail: payload.box_number_detail,
        repair_receipt_at: payload.repair_receipt_at,
        estimated_date_repair_completion:
          payload.estimated_date_repair_completion,
        expected_delivery_date: payload.expected_delivery_date,

        repair_receipt_image_url: payload.repair_receipt_image_url,
        repair_receipt_box_image_url: payload.repair_receipt_box_image_url,

        // box_before_file_url: payload.box_before_file_url,
        // box_after_file_url: payload.box_after_file_url,
        // chip_type: payload.chip_type,
        // chip_no: payload.chip_no,
        // tool_one_id: payload.tool_one_id,
        // tool_two_id: payload.tool_two_id,
        // tool_three_id: payload.tool_three_id,
        // for_tool_one_id: payload.for_tool_one_id,
        // for_tool_two_id: payload.for_tool_two_id,
        // for_tool_three_id: payload.for_tool_three_id,
        // clear_by_tool_one_id: payload.clear_by_tool_one_id,
        // clear_by_tool_two_id: payload.clear_by_tool_two_id,
        // clear_by_tool_three_id: payload.clear_by_tool_three_id,

        // issue_reason_id: payload.issue_reason_id,
        remark: payload.remark,
        // box_remark: payload.box_remark,
        total_price: payload.total_price,
        tax: payload.tax,
        updated_by: payload.updated_by,
      },
    });
  },

  updateBox: async (id: string, payload: Partial<TypePayloadRepairReceipt>) => {
    return await prisma.master_repair_receipt.update({
      where: { id },
      data: {
        box_chip_image_url: payload.box_chip_image_url,
        box_before_file_url: payload.box_before_file_url,
        box_after_file_url: payload.box_after_file_url,

        chip_type: payload.chip_type,
        chip_no: payload.chip_no,

        tool_one_id: payload.tool_one_id !== "" ? payload.tool_one_id : null,
        tool_two_id: payload.tool_two_id !== "" ? payload.tool_two_id : null,
        tool_three_id:
          payload.tool_three_id !== "" ? payload.tool_three_id : null,
        for_tool_one_id:
          payload.for_tool_one_id !== "" ? payload.for_tool_one_id : null,
        for_tool_two_id:
          payload.for_tool_two_id !== "" ? payload.for_tool_two_id : null,
        for_tool_three_id:
          payload.for_tool_three_id !== "" ? payload.for_tool_three_id : null,
        clear_by_tool_one_id:
          payload.clear_by_tool_one_id !== ""
            ? payload.clear_by_tool_one_id
            : null,
        clear_by_tool_two_id:
          payload.clear_by_tool_two_id !== ""
            ? payload.clear_by_tool_two_id
            : null,
        clear_by_tool_three_id:
          payload.clear_by_tool_three_id !== ""
            ? payload.clear_by_tool_three_id
            : null,

        issue_reason_id:
          payload.issue_reason_id !== "" ? payload.issue_reason_id : null,
        not_repair: payload.not_repair,
        box_remark: payload.box_remark,

        updated_by: payload.updated_by,
      },
    });
  },

  success: async (id: string, payload: Partial<TypePayloadRepairReceipt>) => {
    return await prisma.master_repair_receipt.update({
      where: { id: id },
      data: {
        repair_receipt_status: payload.repair_receipt_status,
      },
    });
  },

  cancel: async (id: string, payload: Partial<TypePayloadRepairReceipt>) => {
    return await prisma.master_repair_receipt.update({
      where: { id: id },
      data: {
        repair_receipt_status: payload.repair_receipt_status,
      },
    });
  },

  // ลบข้อมูล
  delete: async (id: string) => {
    return await prisma.master_repair_receipt.delete({
      where: { id },
    });
  },

  // ดึงข้อมูลสำหรับหน้า Job
  findSelectedFieldsById: async (id: string) => {
    return await prisma.master_repair_receipt.findUnique({
      where: { id },
      select: {
        repair_receipt_doc: true,
        register: true,
        estimated_date_repair_completion: true,
        master_quotation: {
          select: {
            master_customer: {
              select: {
                contact_name: true,
              },
            },
            master_brandmodel: {
              select: {
                brandmodel_name: true,
              },
            },
            deal_closed_date: true,
            quotation_status: true,
          },
        },
      },
    });
  },

  // อัปเดตค่า finish เป็น true
  updateFinishToTrue: async (id: string) => {
    return await prisma.master_repair_receipt.update({
      where: { id },
      data: { finish: true },
      select: { finish: true },
    });
  },

  // อัปเดตค่า finish เป็น false
  updateFinishToFalse: async (id: string) => {
    return await prisma.master_repair_receipt.update({
      where: { id },
      data: { finish: false },
      select: { finish: true },
    });
  },

  findByFinishStatusAndId: async (id: string, isFinished: boolean) => {
    const repairReceipt = await prisma.master_repair_receipt.findFirst({
      where: {
        id: id,
        finish: isFinished,
      },
      select: {
        repair_receipt_doc: true,
        register: true,
        master_quotation: {
          select: {
            master_customer: {
              select: {
                contact_name: true,
              },
            },
            master_brandmodel: {
              select: {
                brandmodel_name: true,
              },
            },
            deal_closed_date: true,
            appointment_date: true,
          },
        },
      },
    });
    return repairReceipt;
  },

  findSelect: async (companyId: string) => {
    return await prisma.master_repair_receipt.findMany({
      where: { company_id: companyId },
      select: {
        id: true,
        repair_receipt_doc: true,
      },
    });
  },

  findCalendarRemoval: async (id: string, companyId: string) => {
    return await prisma.master_repair_receipt.findFirst({
      where: {
        id,
        company_id: companyId,
      },
      select: {
        id: true,
        quotation_id: true,
      },
    });
  },

  findDocAndId: async (companyId: string) => {
    return await prisma.master_repair_receipt.findMany({
      where: { company_id: companyId },
      select: {
        id: true,
        repair_receipt_doc: true,
      },
    });
  },

  checkRepairReceipt: async (companyId: string, key: string, value: string) => {
    const whereCondition: any = { company_id: companyId };
    whereCondition[key] = value; 
  
    return await prisma.master_repair_receipt.findFirst({
      where: whereCondition,
    });
  },

  findRepairDocsByCompanyId: async (companyId: string): Promise<RepairDocItem[]> => { 
    return await prisma.master_repair_receipt.findMany({
      where: { company_id: companyId },
      select: {
        id: true,
        repair_receipt_doc: true,
      },
      orderBy: {
        repair_receipt_doc: "asc",
      },
    });
  },

  findOnlyResponsibleUser: async (id: string) => {
    return await prisma.master_repair_receipt.findUnique({
        where: { id },
        select: { 
            id: true,
            responsible_by_user: {
                select: {
                    employee_id: true,
                    username: true,  
                }
            }
        },
    });
},

updateResponsibleBy: async (id: string, responsibleById: string, updatedById: string) => {
  return await prisma.master_repair_receipt.update({
    where: { id },
    data: {
      responsible_by: responsibleById,
      updated_by: updatedById,
      updated_at: new Date(), 
    },
  });
},

  // /repository/repairReceiptRepository.ts (ตัวอย่าง)

findJobs: async (
    companyId: string,
    skip: number,
    take: number,
    status: 'all' | 'pending' | 'success',
    searchText?: string
  ) => {
    // 1. สร้างเงื่อนไขพื้นฐาน
    const baseConditions: Prisma.master_repair_receiptWhereInput[] = [
      { company_id: companyId },
    ];
    if (searchText) {
      baseConditions.push({
        OR: [
          { repair_receipt_doc: { contains: searchText, mode: 'insensitive' } },
          { register: { contains: searchText, mode: 'insensitive' } },
          { master_quotation: { master_customer: { customer_name: { contains: searchText, mode: 'insensitive' } } } },
          { master_quotation: { master_brandmodel: { brandmodel_name: { contains: searchText, mode: 'insensitive' } } } },
        ],
      });
    }

    // 2. สร้างเงื่อนไขสำหรับแต่ละสถานะ
    const pendingCondition: Prisma.master_repair_receiptWhereInput = {
      OR: [
        { repair_receipt_list_repair: { some: { is_active: true } } }, // มีรายการซ่อมอย่างน้อย 1 รายการ
        { repair_receipt_list_repair: { none: {} } }                 // หรือยังไม่มีรายการซ่อมเลย
      ],
      NOT: {
        AND: [ // ไม่ใช่ทุกรายการที่เสร็จ
            { repair_receipt_list_repair: { some: { is_active: true } } },
            {
                repair_receipt_list_repair: {
                    every: {
                      OR: [{ status_date: { not: null } }, { is_active: false }]
                    }
                }
            }
        ]
      },
    };

    const successCondition: Prisma.master_repair_receiptWhereInput = {
        AND: [
            { repair_receipt_list_repair: { some: { is_active: true } } }, // ต้องมีรายการซ่อมอย่างน้อย 1 รายการ
            {
                repair_receipt_list_repair: {
                    every: {
                        OR: [{ status_date: { not: null } }, { is_active: false }]
                    }
                }
            }
        ]
    };
    
    // 3. กำหนดเงื่อนไขหลัก (where) ตาม status ที่เลือก
    const conditionsForFilter = [...baseConditions];
    if (status === 'pending') {
      conditionsForFilter.push(pendingCondition);
    } else if (status === 'success') {
      conditionsForFilter.push(successCondition);
    }
    const where: Prisma.master_repair_receiptWhereInput = { AND: conditionsForFilter };

    // 4. Query ข้อมูลหลักและนับจำนวนทั้งหมดพร้อมกันด้วย transaction
    const [data, totalCount] = await prisma.$transaction([
      prisma.master_repair_receipt.findMany({
        where,
        select: {
          id: true,
          repair_receipt_doc: true,
          register: true,
          estimated_date_repair_completion: true,
          repair_receipt_status: true,
          master_quotation: {
            select: {
              deal_closed_date: true,
              is_box_detail: true,
              master_customer: { select: { customer_name: true } },
              master_brandmodel: { select: { brandmodel_name: true } },
            },
          },
          _count: {
            select: { repair_receipt_list_repair: { where: { is_active: true } } },
          },
          repair_receipt_list_repair: {
            where: { is_active: true },
            select: { status_date: true },
          },
        },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      prisma.master_repair_receipt.count({ where }),
    ]);

    // 5. Query ข้อมูลสรุปยอด (งานค้างทั้งหมด, งานที่เลยกำหนด)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // ใช้ UTC เพื่อความแม่นยำ

    const [totalPendingJobs, totalOverdueJobs] = await prisma.$transaction([
      // นับงานค้างทั้งหมด (ไม่สนใจ searchText หรือ status filter)
      prisma.master_repair_receipt.count({
        where: {
          company_id: companyId,
          ...pendingCondition,
        }
      }),
      prisma.master_repair_receipt.count({
        where: {
          company_id: companyId,
          ...pendingCondition,
          estimated_date_repair_completion: {
            lt: today.toISOString(), 
            not: null, 
          }
        }
      })
    ]);

    // 6. ประมวลผลข้อมูล
    const processedData = data.map(job => {
      const total_repairs = job._count.repair_receipt_list_repair;
      const completed_repairs = job.repair_receipt_list_repair.filter(detail => detail.status_date !== null).length;
      const { _count, repair_receipt_list_repair, ...restOfJob } = job;
      return { ...restOfJob, total_repairs, completed_repairs };
    });

    return { 
      data: processedData, 
      totalCount,
      summary: { // ส่งข้อมูลสรุปยอดกลับไปด้วย
        totalPendingJobs,
        totalOverdueJobs,
      }
    };
  },
};