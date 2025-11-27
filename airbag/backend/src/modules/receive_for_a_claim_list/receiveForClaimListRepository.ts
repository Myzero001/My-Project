// receiveForClaimListRepository.ts
import { PrismaClient } from "@prisma/client";
import { TypePayloadReceiveForAClaimList } from "./receiveForClaimListModel";

const prisma = new PrismaClient();

export const receiveForAClaimListRepository = {
    findAll: async (companyId: string, skip: number, take: number, searchText: string) => {
        return await prisma.receive_for_a_claim_list.findMany({
            where: {
                ...(companyId && { 
                    receive_for_a_claim: {
                        send_for_a_claim: {
                            company_id: companyId 
                        }
                    }
                }),
                ...(searchText && {
                    OR: [
                        { remark: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
            include: {
                receive_for_a_claim: true,
                send_for_a_claim_list: true,
                repair_receipt: true,
                master_repair: true,
            },
            skip,
            take,
            orderBy: { created_at: "desc" },
        });
    },

    count: async (companyId: string, searchText: string) => {
        return await prisma.receive_for_a_claim_list.count({
            where: {
                ...(companyId && { 
                    receive_for_a_claim: {
                        send_for_a_claim: {
                            company_id: companyId 
                        }
                    }
                }),
                ...(searchText && {
                    OR: [
                        { remark: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
        });
    },

    findByReceiveForAClaimId: async (receiveForAClaimId: string) => {
        return await prisma.receive_for_a_claim_list.findMany({
            where: {
                receive_for_a_claim_id: receiveForAClaimId,
            },
            include: {
                send_for_a_claim_list: true,
                repair_receipt: true,
                master_repair: true,
            },
            orderBy: { created_at: "desc" },
        });
    },

    create: async (userId: string, payload: TypePayloadReceiveForAClaimList, company_id: string) => {
        return await prisma.receive_for_a_claim_list.create({
            data: {
                company_id: company_id,
                receive_for_a_claim_id: payload.receive_for_a_claim_id,
                send_for_a_claim_list_id: payload.send_for_a_claim_list_id,
                repair_receipt_id: payload.repair_receipt_id,
                master_repair_id: payload.master_repair_id,
                finish_by_receipt_doc: payload.finish_by_receipt_doc,
                finish: payload.finish,
                remark: payload.remark,
                price: payload.price,
                created_by: userId,
                updated_by: userId,
            },
            include: {
                receive_for_a_claim: true,
                send_for_a_claim_list: true,
                repair_receipt: true,
                master_repair: true,
            },
        });
    },

    createMany: async (userId: string, payloads: TypePayloadReceiveForAClaimList[], company_id: string) => {
        const data = payloads.map(payload => ({
            company_id: company_id,
            receive_for_a_claim_id: payload.receive_for_a_claim_id,
            send_for_a_claim_list_id: payload.send_for_a_claim_list_id,
            repair_receipt_id: payload.repair_receipt_id,
            master_repair_id: payload.master_repair_id,
            remark: payload.remark,
            price: payload.price,
            created_by: userId,
            updated_by: userId,
        }));

        return await prisma.receive_for_a_claim_list.createMany({
            data,
        });
    },

    findByIdAsync: async (id: string) => {
        return await prisma.receive_for_a_claim_list.findUnique({
            where: {
                receive_for_a_claim_list_id: id,
            },
            include: {
                receive_for_a_claim: true,
                send_for_a_claim_list: true,
                repair_receipt: true,
                master_repair: true,
            },
        });
    },

    update: async (
        userId: string,
        id: string,
        payload: TypePayloadReceiveForAClaimList
    ) => {
        return await prisma.receive_for_a_claim_list.update({
            where: {
                receive_for_a_claim_list_id: id,
            },
            data: {
                receive_for_a_claim_id: payload.receive_for_a_claim_id,
                send_for_a_claim_list_id: payload.send_for_a_claim_list_id,
                repair_receipt_id: payload.repair_receipt_id,
                master_repair_id: payload.master_repair_id,
                remark: payload.remark,
                price: payload.price,
                finish: payload.finish, 
                finish_by_receipt_doc: payload.finish_by_receipt_doc, 
                claim_Date: payload.claim_Date, 
                updated_by: userId,
                updated_at: new Date(),
            },
            include: {
                receive_for_a_claim: true,
                send_for_a_claim_list: true,
                repair_receipt: true,
                master_repair: true,
            },
        });
    },

    delete: async (id: string) => {
        return await prisma.receive_for_a_claim_list.delete({
            where: {
                receive_for_a_claim_list_id: id,
            },
        });
    },

    // Check if a list item already exists for a specific send_for_a_claim_list_id
    findByClaimListId: async (sendForAClaimListId: string) => {
        return await prisma.receive_for_a_claim_list.findFirst({
            where: {
                send_for_a_claim_list_id: sendForAClaimListId,
            },
        });
    },

    findPayloadListById: async (
        companyId: string, 
        receive_for_a_claim_id: string,
        send_for_a_claim_id: string
    ) => {
        return await prisma.receive_for_a_claim.findMany({
            where: {
                company_id: companyId,
                receive_for_a_claim_id: receive_for_a_claim_id,
                send_for_a_claim_id: send_for_a_claim_id
            },
            select: {
                receive_for_a_claim_id: true,
                receive_for_a_claim_doc: true,
                receive_date: true,
                status: true,
                send_for_a_claim_id: true,
                supplier_id: true,
                contact_name: true,
                contact_number: true,
                claim_date: true,
                send_for_a_claim: {
                    select: {
                        send_for_a_claim_doc: true,
                        claim_date: true,
                        due_date: true,
                        supplier_id: true,
                        contact_name: true,
                        contact_number: true,
                        // Get send_for_a_claim_list data
                        send_for_a_claim_list: {
                            select: {
                                send_for_a_claim_list_id: true,
                                repair_receipt_id: true,
                                master_repair_id: true,
                                price: true,
                                remark: true,
                                master_repair: {
                                    select: {
                                        master_repair_name: true,
                                        master_repair_id: true
                                    }
                                },
                                repair_receipt: {
                                    select: {
                                        id: true,
                                        repair_receipt_doc: true
                                    }
                                },
                                // Get related receive_for_a_claim_list data
                                receive_for_a_claim_list: {
                                    select: {
                                        receive_for_a_claim_list_id: true,
                                        price: true,
                                        remark: true,
                                        finish: true,
                                        finish_by_receipt_doc: true,
                                        claim_Date: true,
                                        receive_for_a_claim_id: true
                                    }
                                }
                            }
                        },
                        supplier_repair_receipt: {
                            select: {
                                receipt_doc: true,
                                supplier_delivery_note: {
                                    select: {
                                        supplier_delivery_note_doc: true
                                    }
                                }
                            }
                        },
                    }
                },
                master_supplier: {
                    select: {
                        supplier_name: true,
                        supplier_code: true,
                    }
                },
                receive_for_a_claim_list: {
                    select: {
                        receive_for_a_claim_list_id: true,
                        send_for_a_claim_list_id: true,
                        repair_receipt_id: true,
                        master_repair_id: true,
                        price: true,
                        remark: true,
                        finish: true,
                        finish_by_receipt_doc: true,
                        claim_Date: true,
                        master_repair: {
                            select: {
                                master_repair_name: true,
                                master_repair_id: true
                            }
                        },
                        repair_receipt: {
                            select: {
                                id: true,
                                repair_receipt_doc: true
                            }
                        }
                    }
                }
            }
        });
    },
    
};