import { GET_MS_COMPANY_ALL, CREATE_MS_COMPANY, UPDATE_MS_COMPANY, DELETE_MS_COMPANY } from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreateMsCompanies,PayLoadeditMsCompanies } from "@/types/requests/request.ms-companies";
import { Type_MS_Companies_Response } from "@/types/response/response.ms-companies";

export const getMsCompanies = async (page: string, pageSize: string, searchText: string) => {
    const { data: response } = await mainApi.get<Type_MS_Companies_Response>(
        GET_MS_COMPANY_ALL,
        {
            params: {
                page: page,
                pageSize: pageSize,
                searchText: searchText,
            },
        }
    )
    return response;
};

export const postMsCompanies = async (payload: PayLoadCreateMsCompanies) => {
    try{
       const {data:response} =await mainApi.post(CREATE_MS_COMPANY,payload);
        return response;
    }catch(error){
        console.error("Error creating color:", error);
        throw error;
    }
        
};

export const updateMsCompanies = async (company_id: string,payload: PayLoadeditMsCompanies) => {
   try{
    const{data:response}=await mainApi.patch(`${UPDATE_MS_COMPANY}/${company_id}`,payload);
     return response;
   }catch(error){
    console.error("Error creating color:", error);
    throw error;
   }
};

export const deleteMsCompanies = async (company_id : string) => {
    const { data: response } = await mainApi.delete<Type_MS_Companies_Response>(
        `${DELETE_MS_COMPANY}/${company_id}`
    );
    return response;
};


export const getMsCompaniesByID = async (company_id : string) => {
    const { data: response } = await mainApi.get<Type_MS_Companies_Response>(
        `${GET_MS_COMPANY_ALL}/${company_id}`
    );
    return response;
};
