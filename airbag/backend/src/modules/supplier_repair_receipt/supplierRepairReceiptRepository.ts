import { PrismaClient } from "@prisma/client";
import { TypePayloadSupplierRepairReceipt, SupplierReceiptDocItem } from "./supplierRepairReceiptModel";
import { generateRepairReceiptNumber } from "./generateRepairReceiptNumber";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export const supplierRepairReceiptRepository = {
    findAll: async (companyId: string, skip: number, take: number, searchText: string) => {
        return await prisma.supplier_repair_receipt.findMany({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        { receipt_doc: { contains: searchText, mode: "insensitive" } },
                        {supplier_delivery_note :{ supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } }},
                        { status: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
            include: {
                supplier_repair_receipt_lists: {
                    include: {
                        master_repair: true,
                        master_repair_receipt: {
                            include: {
                                master_quotation: {
                                    include: {
                                        master_customer: true,
                                        master_brand: true,
                                        master_brandmodel: true,
                                        master_color: true
                                    }
                                }
                            }
                        }
                    }
                },
                master_supplier: {
                    select: {
                        supplier_id: true,
                        supplier_name: true,
                        supplier_code: true,
                        contact_name: true,
                        contact_number: true,
                        payment_terms: true,
                        payment_terms_day: true
                    }
                },
                supplier_delivery_note: {
                    include: {
                        supplier_delivery_note_repair_receipt_list: {
                            include: {
                                master_repair: true,
                                master_repair_receipt: true
                            }
                        }
                    }
                },
                company: true,
                created_by_user: {
                    select: {
                        employee_id: true,
                        username: true
                    }
                },
                updated_by_user: {
                    select: {
                        employee_id: true,
                        username: true
                    }
                }
            },
            skip,
            take,
            orderBy: { created_at: "desc" },
        });
    },

    count: async (companyId: string, searchText: string) => {
        return await prisma.supplier_repair_receipt.count({
            where: {
                company_id: companyId,
                ...(searchText && {
                    OR: [
                        { receipt_doc: { contains: searchText, mode: "insensitive" } },
                        {supplier_delivery_note :{ supplier_delivery_note_doc: { contains: searchText, mode: "insensitive" } }},
                        { status: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
        });
    },

    create: async (
        companyId: string,
        userId: string,
        supplierDeliveryNoteId: string,
        supplierId: string | null 
        ) => {

        const receiptDoc = await generateRepairReceiptNumber(companyId);

        return await prisma.supplier_repair_receipt.create({
            data: {
                supplier_delivery_note_id: supplierDeliveryNoteId,
                company_id: companyId,
                created_by: userId,
                updated_by: userId,
                supplier_id: supplierId,
                status: "pending", 
                receipt_doc: receiptDoc,
                responsible_by: userId,
            },
            include: {
                supplier_delivery_note: true, // Includes all fields from supplier_delivery_note
                master_supplier: true,       // Includes master_supplier data if supplier_id is not null
                company: true,              // Includes company data
                created_by_user: {        // Includes data about the user who created it
                    select: {             // Select specific user fields if needed
                        employee_id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                },
                updated_by_user: {   
                     select: {
                        employee_id: true,
                        first_name: true,
                        last_name: true,
                        email: true
                    }
                },
                master_repair_receipt: true,
                supplier_delivery_note_repair_receipt_list: true,
                master_repair: true,
                repair_receipt_list: true,

                supplier_repair_receipt_lists: true,
                send_for_a_claim: true
            }
        });
    },

    findByIdAsync: async (companyId: string, id: string) => {
        return await prisma.supplier_repair_receipt.findFirst({
            where: {
                company_id: companyId,
                id: id,
            },
            include: {
                supplier_repair_receipt_lists: {
                    include: {
                        master_repair: true,
                        master_repair_receipt: true
                    }
                },
                master_supplier: true,
                supplier_delivery_note: {
                    include: {
                        supplier_delivery_note_repair_receipt_list: true
                    }
                },
                company: true,
                created_by_user: true,
                updated_by_user: true
            }
        });
    },

    update: async (
        companyId: string,
        userId: string,
        id: string,
        payload: TypePayloadSupplierRepairReceipt
    ) => {
        return await prisma.supplier_repair_receipt.update({
            where: {
                company_id: companyId,
                id: id,
            },
            data: {
                ...payload,
                updated_by: userId,
                updated_at: new Date(),
            },
        });
    },

    delete: async (companyId: string, id: string) => {
        return await prisma.supplier_repair_receipt.delete({
            where: {
                company_id: companyId,
                id: id,
            },
        });
    },

    findSupplierDeliveryNoteById: async (supplierDeliveryNoteId: string) => {
        return await prisma.supplier_delivery_note.findUnique({
            where: { supplier_delivery_note_id: supplierDeliveryNoteId },
            select: { supplier_id: true }
        });
    },

    findPayloadById: async (companyId: string, id: string) => {
        return await prisma.supplier_repair_receipt.findFirst({
            where: {
                company_id: companyId,
                id: id,
            },
            select: {
                receipt_doc: true,
                repair_date_supplier_repair_receipt: true,
                supplier_delivery_note: {
                    select: {
                        supplier_delivery_note_doc: true,
                        date_of_submission: true,
                        amount: true,
                    }
                },
                master_supplier: {
                    select: {
                        supplier_name: true,
                    }
                }
            }
        });
    },

    findReceiptDocsByCompanyId: async (companyId: string): Promise<SupplierReceiptDocItem[]> => {
        return await prisma.supplier_repair_receipt.findMany({
          where: {
            company_id: companyId,
          },
          select: {
            id: true,
            receipt_doc: true,
          },
          orderBy: {
            receipt_doc: 'asc',
          },
        });
      },

    findOnlyResponsibleUserForSupplierRepairReceipt: async (companyId: string, id: string) => {
    return await prisma.supplier_repair_receipt.findFirst({
        where: {
            company_id: companyId,
            id: id,
        },
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
    select: async  (companyId: string , searchText : string) => {
        const data = await prisma.supplier_repair_receipt.findMany({
          where: {
            company_id: companyId,
            ...(searchText && {
                  receipt_doc: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            }),
          },
          skip : 0,
          take : 50,
          select: {
            id : true,
            receipt_doc: true
          },
          orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    },
};