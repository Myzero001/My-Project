export type TypeMasterPositionAll = {
    position_name: string;
    position_id: string;

};
export type TypeMasterPosition = {
    position_id: string;
    position_name: string;
    created_at: string;
    updated_at: string;
};
// export type MS_POSITION_Response = {
//     success: boolean;
//     message: string;
//     data: TypeMasterPosition;
//     statusCode: number;
// };

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
export type PaginatedPositionResponse = APIResponseType<APIPaginationType<TypeMasterPosition[]>>;
export type MasterPositionResponse = APIResponseType<APIPaginationType<TypeMasterPosition[]>>;

export type PositionSelectItem = {
  position_id: string;
  position_name: string;
};
  
export type PositionSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: PositionSelectItem[];
  };
  statusCode: number;
};