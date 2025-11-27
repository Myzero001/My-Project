export type TypeColorAll = {
    color_id    : string
    color_name: string
}

export interface TypeColorAllResponse {
    color_id    : string
    color_name: string
    create_at: Date;
    update_at: Date
}

export type Typecolor = {
    color_name: string,
    color_id: string,
    totalCount: number
}

//
export type typeToolResponse = {
    responseObject: {
      totalCount: number;
      data: Typecolor[];
    };
    success: boolean;
  };
//
export type ColorResponse = {
 success:boolean,
 message:string,
 responseObject:Typecolor;
 statusCode:number
}

export type ColorSelectItem = {
  color_id: string;
  color_name: string;
};
  
export type ColorSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: ColorSelectItem[];
  };
  statusCode: number;
};