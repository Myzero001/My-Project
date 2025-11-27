import { PrismaClient, Prisma } from "@prisma/client";
import { TypePayloadReceiveForAClaim, ReceiveClaimDocItem } from "./receiveForClaimModel";

const prisma = new PrismaClient();
const MAX_RETRIES = 5;

export const receiveForAClaimRepository = {
    findAll: async (companyId: string, skip: number, take: number, searchText: string) => {
        return await prisma.receive_for_a_claim.findMany({
            where: {
                ...(companyId && { 
                    send_for_a_claim: {
                        company_id: companyId 
                    }
                }),
                ...(searchText && {
                    OR: [
                        { receive_for_a_claim_doc: { contains: searchText, mode: "insensitive" } },
                        { send_for_a_claim: { send_for_a_claim_doc : { contains: searchText, mode: "insensitive" }} },
                        { contact_name: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
            include: {
                send_for_a_claim: true,
                master_supplier: true,
                receive_for_a_claim_list: {
                    include: {
                        send_for_a_claim_list: true,
                        repair_receipt: true,
                        master_repair: true,
                    }
                },
            },
            skip,
            take,
            orderBy: { created_at: "desc" },
        });
    },

    count: async (companyId: string, searchText: string) => {
        return await prisma.receive_for_a_claim.count({
            where: {
                ...(companyId && { 
                    send_for_a_claim: {
                        company_id: companyId 
                    }
                }),
                ...(searchText && {
                    OR: [
                        { receive_for_a_claim_doc: { contains: searchText, mode: "insensitive" } },
                        { send_for_a_claim: { send_for_a_claim_doc : { contains: searchText, mode: "insensitive" }} },
                        { status: { contains: searchText, mode: "insensitive" } },
                        { contact_name: { contains: searchText, mode: "insensitive" } },
                        { contact_number: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
        });
    },

    create: async (userId: string, companyId: string, payload: TypePayloadReceiveForAClaim) => {
        let retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                // ใช้ transaction สำหรับการสร้างเลขที่เอกสารและการสร้าง header
                const createdRecord = await prisma.$transaction(async (tx) => {
                    // --- 1. Document Number Generation ---
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    const docPrefix = `CMR${year}${month}${day}`;
                    const existingDocsCount = await tx.receive_for_a_claim.count({
                        where: {
                            receive_for_a_claim_doc: { startsWith: docPrefix },
                            // Need a way to check company ID here. Assuming company_id is directly on receive_for_a_claim
                            company_id: companyId // Check company_id directly if available
                            // If company_id is not direct, need relation check like before:
                            // send_for_a_claim: { company_id: companyId }
                        },
                    });
                    const sequentialNumber = String(existingDocsCount + 1 + retries).padStart(3, '0');
                    const generatedDocNumber = `${docPrefix}${sequentialNumber}`;

                    // --- 2. Find Original Send For A Claim (Get info needed for header) ---
                    // You might still need some info from the parent send_for_a_claim
                    const sendForAClaimInfo = await tx.send_for_a_claim.findFirst({
                        where: {
                            send_for_a_claim_id: payload.send_for_a_claim_id,
                            company_id: companyId
                        },
                        select: { // Select only what's needed for the receive header defaults
                            supplier_id: true,
                            contact_name: true,
                            contact_number: true,
                            addr_number: true,
                            addr_alley: true,
                            addr_street: true,
                            addr_subdistrict: true,
                            addr_district: true,
                            addr_province: true,
                            addr_postcode: true,
                        }
                    });
                    // Handle case where send_for_a_claim is not found
                    if (!sendForAClaimInfo) {
                         throw new Error(`Send for claim record with ID ${payload.send_for_a_claim_id} not found or not associated with company ${companyId}.`);
                    }

                    // --- 3. Create Only the Main Receive For A Claim Record ---
                    const newClaimHeader = await tx.receive_for_a_claim.create({
                        data: {
                            company_id: companyId, // Explicitly set company_id
                            receive_for_a_claim_doc: generatedDocNumber,
                            send_for_a_claim_id: payload.send_for_a_claim_id, // Link to parent
                            receive_date: payload.receive_date || new Date(),
                            // Use defaults from sendForAClaimInfo if not provided in payload
                            supplier_id: payload.supplier_id ?? sendForAClaimInfo.supplier_id,
                            addr_number: payload.addr_number ?? sendForAClaimInfo.addr_number,
                            addr_alley: payload.addr_alley ?? sendForAClaimInfo.addr_alley,
                            addr_street: payload.addr_street ?? sendForAClaimInfo.addr_street,
                            addr_subdistrict: payload.addr_subdistrict ?? sendForAClaimInfo.addr_subdistrict,
                            addr_district: payload.addr_district ?? sendForAClaimInfo.addr_district,
                            addr_province: payload.addr_province ?? sendForAClaimInfo.addr_province,
                            addr_postcode: payload.addr_postcode ?? sendForAClaimInfo.addr_postcode,
                            contact_name: payload.contact_name ?? sendForAClaimInfo.contact_name,
                            contact_number: payload.contact_number ?? sendForAClaimInfo.contact_number,
                            status: payload.status || "pending",
                            claim_date: payload.claim_date, // Optional
                            created_by: userId,
                            updated_by: userId,
                            responsible_by: userId,
                        },
                         select: { receive_for_a_claim_id: true } // Only need the ID from transaction
                    });

                    // Return the ID of the newly created header
                    return newClaimHeader.receive_for_a_claim_id;

                }); // --- End Prisma Transaction ---

                // --- Fetch Final Record with Includes (Outside Transaction) ---
                // Fetch the header record with relations after creation is confirmed
                 const finalRecord = await prisma.receive_for_a_claim.findUnique({ // Use findUnique for single record
                    where: { receive_for_a_claim_id: createdRecord },
                    include: {
                        // Include relations needed by the service/frontend
                        send_for_a_claim: true,
                        master_supplier: true,
                        receive_for_a_claim_list: true, // Include the list (will be empty)
                        created_by_user: true,          // Include user info
                        updated_by_user: true,          // Include user info
                        companies: true                 // Include company info
                    },
                });

                // Check if fetching the final record failed unexpectedly
                if (!finalRecord) {
                     throw new Error("Failed to retrieve the newly created receive for claim record.");
                }

                return finalRecord; // Return the complete header record

            } catch (error) {
                // --- Error Handling & Retry Logic ---
                if (error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2002' &&
                    error.meta?.target) {
                    const targetFields = error.meta.target;
                    if (Array.isArray(targetFields) && targetFields.includes('receive_for_a_claim_doc')) {
                        retries++;
                        console.warn(`[Repo.create] Retrying document number generation (Attempt ${retries}) due to P2002.`);
                        if (retries >= MAX_RETRIES) {
                            console.error(`[Repo.create] Max retries (${MAX_RETRIES}) reached.`);
                            throw new Error(`Failed to generate unique document number after ${MAX_RETRIES} attempts.`);
                        }
                        continue; // Retry the while loop
                    } else {
                         console.error("[Repo.create] P2002 error on unexpected field:", error.meta.target);
                         throw error; // Non-doc unique constraint error
                    }
                } else {
                    console.error("[Repo.create] Error during creation:", error);
                    throw error; // Other Prisma or logic errors
                }
            } // --- End Catch Block ---
        } // --- End While Loop ---

        // Should not be reached
        throw new Error("Failed to create receive for claim after multiple retries.");
    },

    findByIdAsync: async (id: string) => {
        return await prisma.receive_for_a_claim.findUnique({
            where: {
                receive_for_a_claim_id: id,
            },
            include: {
                send_for_a_claim: true,
                master_supplier: true,
                receive_for_a_claim_list: {
                    include: {
                        send_for_a_claim_list: true,
                        repair_receipt: true,
                        master_repair: true,
                    }
                },
            },
        });
    },

    update: async (
        userId: string,
        id: string,
        payload: TypePayloadReceiveForAClaim
    ) => {
        return await prisma.receive_for_a_claim.update({
            where: {
                receive_for_a_claim_id: id,
            },
            data: {
                receive_for_a_claim_doc: payload.receive_for_a_claim_doc,
                send_for_a_claim_id: payload.send_for_a_claim_id,
                receive_date: payload.receive_date,
                supplier_id: payload.supplier_id,
                addr_number: payload.addr_number,
                addr_alley: payload.addr_alley,
                addr_street: payload.addr_street,
                addr_subdistrict: payload.addr_subdistrict,
                addr_district: payload.addr_district,
                addr_province: payload.addr_province,
                addr_postcode: payload.addr_postcode,
                contact_name: payload.contact_name,
                contact_number: payload.contact_number,
                status: payload.status,
                claim_date: payload.claim_date,
                updated_by: userId,
                updated_at: new Date(),
                responsible_by: payload.responsible_by,
            },
            include: {
                send_for_a_claim: true,
                master_supplier: true,
                receive_for_a_claim_list: {
                    include: {
                        send_for_a_claim_list: true,
                        repair_receipt: true,
                        master_repair: true,
                    }
                },
            },
        });
    },

    delete: async (id: string) => {
        await prisma.receive_for_a_claim_list.deleteMany({
            where: {
                receive_for_a_claim_id: id,
            },
        });

        return await prisma.receive_for_a_claim.delete({
            where: {
                receive_for_a_claim_id: id,
            },
        });
    },

    findPayloadData: async (companyId: string, skip: number, take: number, searchText: string) => {
        return await prisma.receive_for_a_claim.findMany({
            where: {
                send_for_a_claim: {
                    company_id: companyId
                },
                ...(searchText && {
                    OR: [
                        { receive_for_a_claim_doc: { contains: searchText, mode: "insensitive" } },
                        { send_for_a_claim: { send_for_a_claim_doc : { contains: searchText, mode: "insensitive" }} },
                        { status: { contains: searchText, mode: "insensitive" } },
                        { send_for_a_claim: { supplier_repair_receipt :{receipt_doc : { contains: searchText, mode: "insensitive" }}} },
                        { send_for_a_claim: { supplier_repair_receipt :{supplier_delivery_note : {supplier_delivery_note_doc : { contains: searchText, mode: "insensitive" }}}} },
                        { master_supplier: { supplier_code : { contains: searchText, mode: "insensitive" }} },
                        { contact_name: { contains: searchText, mode: "insensitive" } },
                        { contact_number: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
            select: {
                receive_for_a_claim_doc: true,
                receive_for_a_claim_id: true,
                claim_date: true,
                master_supplier: {
                    select: {
                        supplier_code: true,
                        supplier_name: true,
                    }
                },
                send_for_a_claim: {
                    select: {
                        send_for_a_claim_doc: true,
                        send_for_a_claim_id: true,
                        supplier_repair_receipt: {
                            select: {
                                receipt_doc: true,
                                supplier_delivery_note: {
                                    select: {
                                        supplier_delivery_note_doc: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            skip,
            take,
            orderBy: { created_at: "desc" },
        });
    },

    countPayloadData: async (companyId: string, searchText: string) => {
        return await prisma.receive_for_a_claim.count({
            where: {
                send_for_a_claim: {
                    company_id: companyId
                },
                ...(searchText && {
                    OR: [
                        { receive_for_a_claim_doc: { contains: searchText, mode: "insensitive" } },
                        { send_for_a_claim: { send_for_a_claim_doc : { contains: searchText, mode: "insensitive" }} },
                        { send_for_a_claim: { supplier_repair_receipt :{receipt_doc : { contains: searchText, mode: "insensitive" }}} },
                        { send_for_a_claim: { supplier_repair_receipt :{supplier_delivery_note : {supplier_delivery_note_doc : { contains: searchText, mode: "insensitive" }}}} },
                        { status: { contains: searchText, mode: "insensitive" } },
                        { master_supplier: { supplier_code : { contains: searchText, mode: "insensitive" }} },
                        { contact_name: { contains: searchText, mode: "insensitive" } },
                        { contact_number: { contains: searchText, mode: "insensitive" } },
                    ],
                }),
            },
        });
    },

    getSendForClaimDocs: async (companyId: string) => {
        return await prisma.send_for_a_claim.findMany({
            where: {
                company_id: companyId
            },
            select: {
                send_for_a_claim_id: true,
                send_for_a_claim_doc: true
            },
            orderBy: {
                created_at: "desc"
            }
        });
    },

    findOnlyReceiveClaimDocsByCompanyId: async (companyId: string): Promise<ReceiveClaimDocItem[]> => {
        const results = await prisma.receive_for_a_claim.findMany({
          where: {
            company_id: companyId,
          },
          select: {
            receive_for_a_claim_id: true, 
            receive_for_a_claim_doc: true,
          },
          orderBy: {
            receive_for_a_claim_doc: 'asc',
          },
        });
        return results.map(item => ({
            id: item.receive_for_a_claim_id,
            receive_for_a_claim_doc: item.receive_for_a_claim_doc,
        }));
      },

      findOnlyResponsibleUserForReceiveForAClaim: async (receive_for_a_claim_id: string) => {
        return await prisma.receive_for_a_claim.findUnique({
            where: {
                receive_for_a_claim_id: receive_for_a_claim_id,
            },
            select: { 
                receive_for_a_claim_id: true, 
                responsible_by_user: {
                    select: {
                        employee_id: true,
                        username: true, 
                    }
                }
            },
        });
    },
};