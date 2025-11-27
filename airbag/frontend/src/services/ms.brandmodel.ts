import {
  CREATE_MS_BRANDMODEL,
  GET_MS_BRANDMODEL,
  UPDATE_MS_BRANDMODEL,
  DELETE_MS_BRANDMODEL,
  GET_MS_BRANDS,
  GET_MS_BRANDMODEL_NO_PAGINATION,
  GET_MS_BRANDMODEL_BY_BRANDS,
  GET_MS_BRANDMODEL_WITH_SEARCH,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { PayLoadCreate_MS_BRANDMODEL } from "@/types/requests/request.ms-brandmode";
import { APIPaginationType, APIResponseType } from "@/types/response";
import { Type_MS_BRANDMODEL_All , BrandModelSelectResponse } from "@/types/response/response.ms-brandmodel";

export const getBrandModelData = async (
  page: string,
  pageSize: string,
  searchText: string
) => {
  try {
    // console.log(`Requesting page ${page} with pageSize ${pageSize}`);
    const { data: response } = await mainApi.get<
      APIResponseType<APIPaginationType<Type_MS_BRANDMODEL_All[]>>
    >(GET_MS_BRANDMODEL, {
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

export const getAllBrandModelsData = async () => {
  try {
    const { data: response } = await mainApi.get<
      APIResponseType<Type_MS_BRANDMODEL_All[]>
    >(GET_MS_BRANDMODEL_NO_PAGINATION);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postMasterBrandModel = async (
  data: PayLoadCreate_MS_BRANDMODEL
) => {
  try {
    const response = await mainApi.post(CREATE_MS_BRANDMODEL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating brand model:", error);
    throw error;
  }
};

export const updateMasterBrandModel = async (data: {
  ms_brandmodel_id: string;
  brandmodel_name: string;
  master_brand_id: string;
}) => {
  try {
    const response = await mainApi.patch(UPDATE_MS_BRANDMODEL, data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating brand model:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteMasterBrandModel = async (id: string) => {
  try {
    const response = await mainApi.delete(`${DELETE_MS_BRANDMODEL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting brand model:", error);
    throw error;
  }
};

export const getMsTypeMsBRANDS = async () => {
  try {
    const { data: response } = await mainApi.get(GET_MS_BRANDS);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getByBrand = async (master_brand_id: string) => {
  try {
    const { data: response } = await mainApi.get(
      GET_MS_BRANDMODEL_BY_BRANDS + "/" + master_brand_id
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getByBrandWithSearchText = async (master_brand_id: string, searchText: string = "") => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<BrandModelSelectResponse>(
      GET_MS_BRANDMODEL_WITH_SEARCH + "/" + master_brand_id + query
    );
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};