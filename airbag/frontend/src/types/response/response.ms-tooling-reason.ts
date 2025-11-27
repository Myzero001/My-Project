export type Type_MS_TOOLING_REASON_All = {
    tooling_reason_name : string,
    master_tooling_reason_id:string;
}

export type Type_MS_TOOLING_REASON ={
    master_tooling_reason_id : string,
    tooling_reason_name: string,
    created_at: string,
    updeated_at: string;
}

export type MS_TOOLING_REASON_Response ={
    success: boolean,
    message: string,
    responseObject: Type_MS_TOOLING_REASON,
    statusCode: number;
}

export type ToolingReasonSelectItem = {
  master_tooling_reason_id: string;
  tooling_reason_name: string;
};
  
export type ToolingReasonSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: ToolingReasonSelectItem[];
  };
  statusCode: number;
};