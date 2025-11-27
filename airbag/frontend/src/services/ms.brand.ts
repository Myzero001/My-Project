import {
  CREATE_MS_BRAND,
  GET_MS_BRAND,
  UPDATE_MS_BRAND,
  DELETE_MS_BRAND,
  GET_MS_BRANDL_NO_PAGINATION,
  SELECT_BRAND,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreate_MS_BRAND } from "@/types/requests/request.ms-brand";
import {
  MS_BRAND_Response,
  Type_MS_BRAND,
  Type_MS_BRAND_All,
  BrandSelectResponse,
} from "@/types/response/response.ms-brand";
import { APIPaginationType, APIResponseType } from "@/types/response";

export const getBrandData = async (
  page: string,
  pageSize: string,
  searchText: string
) => {
  try {
    // console.log(`Requesting page ${page} with pageSize ${pageSize}`);
    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<Type_MS_BRAND_All[]>>
    >(GET_MS_BRAND, {
      params: {
        page: page,
        pageSize: pageSize,
        searchText: searchText,
      },
    });
    // console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getMasterBrand = async (page: number, pageSize: number) => {
  console.log(`Requesting page ${page} with pageSize ${pageSize}`);

  const { data: response } = await mainApi.get(
    `${GET_MS_BRAND}?page=${page}&pageSize=${pageSize}`
  );

  console.log("Response data:", response.responseObject?.data);
  console.log("Total count:", response.responseObject?.totalCount);

  return response;
};

export const getAllBrandsData = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<Type_MS_BRAND[]>
    >(GET_MS_BRANDL_NO_PAGINATION);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postMasterBrand = async (data: PayLoadCreate_MS_BRAND) => {
  const { data: response } = await mainApi.post<MS_BRAND_Response>(
    CREATE_MS_BRAND,
    data
  );
  return response;
};

export const updateMasterBrand = async (data: {
  master_brand_id: string;
  brand_name: string;
}) => {
  const { data: response } = await mainApi.patch<MS_BRAND_Response>(
    UPDATE_MS_BRAND,
    data
  );
  return response;
};

export const deleteMasterBrand = async (master_brand_id: string) => {
  const { data: response } = await mainApi.delete<MS_BRAND_Response>(
    `${DELETE_MS_BRAND}/${master_brand_id}`
  );
  return response;
};

export const selectBrand = async (
  searchText: string = ""
): Promise<BrandSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<BrandSelectResponse>(
      `${SELECT_BRAND}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching Brandmodel:", error);
    throw error;
  }
};