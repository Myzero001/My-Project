export type Type_MS_CLEAR_BY_ALL = {
    clear_by_id: string;
    clear_by_name: string;
};
export type Type_MS_CLEAR_BY={
    clear_by_id: string;
    clear_by_name: string;
    created_by: string;
    updated_by: string;
}

export type MS_CLEAR_BY_Response={
    success: boolean;
    message: string;
    responseObject: Type_MS_CLEAR_BY;
    statusCode: number;
}