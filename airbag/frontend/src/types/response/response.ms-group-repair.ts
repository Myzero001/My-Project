export type Type_MS_GROUP_REPAIR_All = {
    group_repair_name : string,
    master_group_repair_id:string;
}

export type Type_MS_GROUP_REPAIR ={
    master_group_repair_id : string,
    group_repair_name: string,
    created_at: string,
    updeated_at: string;
}

export type MS_GROUP_REPAIR_Response ={
    success: boolean,
    message: string,
    responseObject: Type_MS_GROUP_REPAIR,
    statusCode: number;
}