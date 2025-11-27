export interface TypeRepairAll  {
    master_repair_id: string
    master_repair_name: string
    // master_group_repair_id: string
    master_group_repair: {
        master_group_repair_id: string
        group_repair_name: string
    };
}

export type TypeRepair = {
    master_repair_id: string
    master_repair_name: string
    // master_group_repair_id: string
    // group_repair_name: string
    barcode: string
    master_group_repair?: {
        master_group_repair_id: string
        group_repair_name: string
    };
}

export type RepairResponse = {
    success: boolean
    message: string
    responseObject: TypeRepair
    statusCode: number
}


export type APIResponseType<T> = {
    success: boolean;
    message: string;
    responseObject: T;
    statusCode: number;
};

export type APIPaginationType<T> = {
    data: T;
    totalCount: number;
    totalPages: number;
};
export type PaginatedRepairResponse = APIResponseType<APIPaginationType<TypeRepair[]>>;
export type MSRepairResponse = APIResponseType<APIPaginationType<TypeRepair[]>>;

