import mainApi from "@/apis/main.api";
import { SEARCH_FROM_REGISTER } from "@/apis/endpoint.api";
import { SearchRegisterResponse } from "@/types/response/response.serach.register";

export const searchRegisterData = async (
  page: number,
  pageSize: number,
  search: string = "",
): Promise<SearchRegisterResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search: search,
    });
    
    const { data: response } = await mainApi.get<SearchRegisterResponse>(
      `${SEARCH_FROM_REGISTER}?${queryParams.toString()}`
    );
    
    return response;
    
  } catch (error) {
    console.error("Error searching register data:", error);
    throw error;
  }
};

export const fetchRegistersForSelect = async (searchText: string) => {
    try {
        const response = await searchRegisterData(1,50,searchText);
        if (response && response.responseObject) {
            return response; 
        }
        return { responseObject: [] };

    } catch (error) {
        console.error("Error fetching registers for select:", error);
        return { responseObject: [] };
    }
};