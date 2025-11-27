export interface Type_MS_BRANDMODEL_All {
    ms_brandmodel_id: string;
    master_brand_id: string;
    brandmodel_name: string;
    created_at: Date;
    updated_at: Date;
    master_brand?: {
      master_brand_id: string;
      brand_name: string;
      created_at: Date;
      updated_at: Date;
    };
}
  

export type Type_MS_BRANDMODEL ={
    master_brand_id : string,
    brand_name: string,
    created_at: string,
    updeated_at: string;
}

export type MS_BRANDMODEL_Response ={
    success: boolean,
    message: string,
    responseObject: Type_MS_BRANDMODEL,
    statusCode: number;
}

export type BrandModelSelectItem = {
  ms_brandmodel_id: string;
  brandmodel_name: string;
};
  
export type BrandModelSelectResponse = {
  success: boolean;
  message: string;
  responseObject: {
    data: BrandModelSelectItem[];
  };
  statusCode: number;
};