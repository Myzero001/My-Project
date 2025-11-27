import { StatusCodes } from "http-status-codes";
import { ResponseStatus, ServiceResponse } from "@common/models/serviceResponse";
import { receiveForAClaimListRepository } from "./receiveForClaimListRepository";
import { TypePayloadReceiveForAClaimList } from "./receiveForClaimListModel";

export const receiveForAClaimListService = {
    findAll: async (
        companyId: string,
        page: number = 1,
        pageSize: number = 12,
        searchText: string = ""
    ) => {
        try {
            const skip = (page - 1) * pageSize;
            const claimLists = await receiveForAClaimListRepository.findAll(companyId, skip, pageSize, searchText);
            if (!claimLists || claimLists.length === 0) {
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "No receive for claim lists found",
                    {
                        data: [],
                        totalCount: 0,
                        totalPages: 0,
                    },
                    StatusCodes.OK
                );
            }
            const totalCount = await receiveForAClaimListRepository.count(companyId, searchText);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get all success",
                {
                    data: claimLists,
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                },
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching receive for claim lists",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findByReceiveForAClaimId: async (receiveForAClaimId: string) => {
        try {
            const claimLists = await receiveForAClaimListRepository.findByReceiveForAClaimId(receiveForAClaimId);
            if (!claimLists || claimLists.length === 0) {
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "No receive for claim lists found for this claim",
                    [],
                    StatusCodes.OK
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get by receive_for_a_claim_id success",
                claimLists,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error fetching receive for claim lists",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    create: async (userId: string, payload: TypePayloadReceiveForAClaimList, company_id: string) => {
        try {
            if (payload.send_for_a_claim_list_id) {
                const existingItem = await receiveForAClaimListRepository.findByClaimListId(payload.send_for_a_claim_list_id);
                if (existingItem) {
                    return new ServiceResponse(
                        ResponseStatus.Failed,
                        "Item already exists for this send_for_a_claim_list_id",
                        null,
                        StatusCodes.CONFLICT
                    );
                }
            }

            const newClaimList = await receiveForAClaimListRepository.create(userId, payload, company_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Create receive for claim list success",
                newClaimList,
                StatusCodes.CREATED
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error creating receive for claim list",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    createMany: async (userId: string, payloads: TypePayloadReceiveForAClaimList[], company_id:string) => {
        try {
            // Filter out payloads with send_for_a_claim_list_id that already exist
            const itemsToCheck = payloads.filter(item => item.send_for_a_claim_list_id);
            const existingItemPromises = itemsToCheck.map(async item => {
                if (item.send_for_a_claim_list_id) {
                    const exists = await receiveForAClaimListRepository.findByClaimListId(item.send_for_a_claim_list_id);
                    return { id: item.send_for_a_claim_list_id, exists: Boolean(exists) };
                }
                return { id: null, exists: false };
            });
            
            const existingResults = await Promise.all(existingItemPromises);
            const existingMap = new Map();
            existingResults.forEach(item => {
                if (item.id) existingMap.set(item.id, item.exists);
            });
            
            const filteredPayloads = payloads.filter(item => 
                !item.send_for_a_claim_list_id || !existingMap.get(item.send_for_a_claim_list_id)
            );

            if (filteredPayloads.length === 0) {
                return new ServiceResponse(
                    ResponseStatus.Success,
                    "No new items to create, all already exist",
                    { count: 0 },
                    StatusCodes.OK
                );
            }

            const result = await receiveForAClaimListRepository.createMany(userId, filteredPayloads, company_id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Create multiple receive for claim list items success",
                { count: result.count },
                StatusCodes.CREATED
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error creating receive for claim list items",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (userId: string, id: string, payload: TypePayloadReceiveForAClaimList) => {
        try {
            const claimList = await receiveForAClaimListRepository.findByIdAsync(id);
            if (!claimList) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Receive for claim list not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            // Check if there's already an entry for this send_for_a_claim_list_id (if it's changing)
            if (payload.send_for_a_claim_list_id && 
                payload.send_for_a_claim_list_id !== claimList.send_for_a_claim_list_id) {
                const existingItem = await receiveForAClaimListRepository.findByClaimListId(payload.send_for_a_claim_list_id);
                if (existingItem && existingItem.receive_for_a_claim_list_id !== id) {
                    return new ServiceResponse(
                        ResponseStatus.Failed,
                        "Item already exists for this send_for_a_claim_list_id",
                        null,
                        StatusCodes.CONFLICT
                    );
                }
            }

            const updatedClaimList = await receiveForAClaimListRepository.update(userId, id, payload);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Update receive for claim list success",
                updatedClaimList,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error updating receive for claim list",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    delete: async (id: string) => {
        try {
            const claimList = await receiveForAClaimListRepository.findByIdAsync(id);
            if (!claimList) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Receive for claim list not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            await receiveForAClaimListRepository.delete(id);
            return new ServiceResponse(
                ResponseStatus.Success,
                "Delete receive for claim list success",
                null,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error deleting receive for claim list",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findOne: async (id: string) => {
        try {
            const claimList = await receiveForAClaimListRepository.findByIdAsync(id);
            if (!claimList) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "Receive for claim list not found",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get receive for claim list success",
                claimList,
                StatusCodes.OK
            );
        } catch (ex) {
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error getting receive for claim list",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    findPayloadList: async (
        companyId: string, 
        receive_for_a_claim_id: string,
        send_for_a_claim_id: string
    ) => {
        try {
            const claims = await receiveForAClaimListRepository.findPayloadListById(
                companyId, 
                receive_for_a_claim_id,
                send_for_a_claim_id
            );
            
            if (!claims || claims.length === 0) {
                return new ServiceResponse(
                    ResponseStatus.Failed,
                    "No receive for claim data found for the specified IDs",
                    null,
                    StatusCodes.NOT_FOUND
                );
            }
    
            const formattedClaims = claims.map(claim => {
                // Get data from send_for_a_claim_list first
                const sendForClaimItems = claim.send_for_a_claim?.send_for_a_claim_list.map(item => {
                    // Check if receive_for_a_claim_list exists and has data
                    const relatedReceiveForClaimList = item.receive_for_a_claim_list && 
                                                      Array.isArray(item.receive_for_a_claim_list) && 
                                                      item.receive_for_a_claim_list.length > 0 
                                                      ? item.receive_for_a_claim_list[0] : null;
                
                    return {
                        send_for_a_claim_list_id: item.send_for_a_claim_list_id,
                        repair_receipt_doc: item.repair_receipt?.repair_receipt_doc || null,
                        master_repair_name: item.master_repair?.master_repair_name || "",
                        master_repair_id: item.master_repair?.master_repair_id || "",
                        repair_receipt_id: item.repair_receipt?.id || "",
                        price: item.price || 0,
                        remark: item.remark || "",
                        receive_for_a_claim_list: relatedReceiveForClaimList ? {
                            receive_for_a_claim_list_id: relatedReceiveForClaimList.receive_for_a_claim_list_id,
                            price: relatedReceiveForClaimList.price,
                            remark: relatedReceiveForClaimList.remark,
                            finish: relatedReceiveForClaimList.finish,
                            finish_by_receipt_doc: relatedReceiveForClaimList.finish_by_receipt_doc,
                            claim_Date: relatedReceiveForClaimList.claim_Date,
                            receive_for_a_claim_id: relatedReceiveForClaimList.receive_for_a_claim_id
                        } : null
                    };
                }) || [];
    
                // Use Map to manage data from both sources
                const claimItemsMap = new Map();
                
                // Add data from receive_for_a_claim_list first
                claim.receive_for_a_claim_list.forEach(item => {
                    const key = `${item.master_repair?.master_repair_id || ""}_${item.repair_receipt?.id || ""}`;
                    
                    claimItemsMap.set(key, {
                        receive_for_a_claim_list_id: item.receive_for_a_claim_list_id,
                        receive_for_a_claim_doc: claim.receive_for_a_claim_doc,
                        repair_receipt_doc: item.repair_receipt?.repair_receipt_doc || null,
                        master_repair_name: item.master_repair?.master_repair_name || "",
                        master_repair_id: item.master_repair?.master_repair_id || "",
                        repair_receipt_id: item.repair_receipt?.id || "",
                        price: item.price || 0,
                        remark: item.remark || "",
                        finish: item.finish || false,
                        finish_by_receipt_doc: item.finish_by_receipt_doc || null,
                        claim_Date: item.claim_Date || null,
                    });
                });
                
                // Add or update from send_for_claim_items
                sendForClaimItems.forEach(item => {
                    const key = `${item.master_repair_id}_${item.repair_receipt_id}`;
                    
                    // If item doesn't exist in map, add it
                    if (!claimItemsMap.has(key) && item.receive_for_a_claim_list) {
                        claimItemsMap.set(key, {
                            receive_for_a_claim_list_id: item.receive_for_a_claim_list.receive_for_a_claim_list_id,
                            receive_for_a_claim_doc: claim.receive_for_a_claim_doc || null,
                            repair_receipt_doc: item.repair_receipt_doc,
                            master_repair_name: item.master_repair_name,
                            master_repair_id: item.master_repair_id,
                            repair_receipt_id: item.repair_receipt_id,
                            price: item.price,
                            remark: item.remark,
                            finish: item.receive_for_a_claim_list?.finish || false,
                            finish_by_receipt_doc: item.receive_for_a_claim_list?.finish_by_receipt_doc || null,
                            claim_Date: item.receive_for_a_claim_list?.claim_Date || null,
                        });
                    }
                });
                
                // Convert map back to array
                const allClaimItems = Array.from(claimItemsMap.values());
    
                return {
                    receive_for_a_claim_id: claim.receive_for_a_claim_id,
                    receive_for_a_claim_doc: claim.receive_for_a_claim_doc,
                    send_for_a_claim_id: claim.send_for_a_claim_id,
                    send_for_a_claim_doc: claim.send_for_a_claim?.send_for_a_claim_doc,
                    supplier_delivery_note_doc: claim.send_for_a_claim?.supplier_repair_receipt?.supplier_delivery_note?.supplier_delivery_note_doc || null,
                    receipt_doc: claim.send_for_a_claim?.supplier_repair_receipt?.receipt_doc || null,
                    claim_date: claim.claim_date,
                    due_date: claim.send_for_a_claim?.due_date,
                    receive_date: claim.receive_date,
                    contact_name: claim.contact_name,
                    contact_number: claim.contact_number,
                    supplier_name: claim.master_supplier?.supplier_name,
                    supplier_code: claim.master_supplier?.supplier_code,
                    status: claim.status,
                    claim_items: allClaimItems,
                    send_for_claim_items: sendForClaimItems
                };
            });
    
            return new ServiceResponse(
                ResponseStatus.Success,
                "Get receive for claim list payload success",
                formattedClaims,
                StatusCodes.OK
            );
        } catch (ex) {
            console.error('Error in findPayloadList:', ex);
            return new ServiceResponse(
                ResponseStatus.Failed,
                "Error getting receive for claim list payload",
                (ex as Error).message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
};