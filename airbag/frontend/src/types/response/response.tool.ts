export type TypeToolAll = {
    tool_id: string,
    tool: string
}
export interface TypeToolAllResponse {
  tool_id: string;
  tool: string;
  created_at: Date;
  updated_at: Date;
}

export type TypeTool = {
    tool_id: string,
    tool: string
    totalCount: number
}
export type TypeToolResponse = {
    responseObject: {
      totalCount: number;
      data: TypeTool[];
    };
    success: boolean;
  };

export type ToolResponse = {
 success:boolean,
 message:string,
 responseObject:TypeTool;
 statusCode:number
}

export type ToolSelectItem = {
  tool_id: string;
  tool: string;
};
  
export type ToolSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: ToolSelectItem[];
  };
  statusCode: number;
};