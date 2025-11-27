import {
  CREATE_COLOR,
  GET_COLOR_ALL,
  DELETE_COLOR,
  UPDATE_COLOR,
  GET_COLOR_ALL_NO_PAGINATION,
  SELECT_COLOR,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";

import {PayLoadCreatecolor} from "@/types/requests/request.color";
import { ColorResponse, Typecolor, ColorSelectResponse } from "@/types/response/response.color";
import { APIResponseType } from "@/types/response";

export const getColor = async (page: string, pageSize: string, searchText: string) => {
  try{
    const { data: response } = await mainApi.get<ColorResponse>(
      `${GET_COLOR_ALL}?page=${page}&pageSize=${pageSize}&searchText=${searchText}`
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getAllColors = async () => {
  try {
    const { data: response } = await mainApi.get<APIResponseType<Typecolor[]>>(
      GET_COLOR_ALL_NO_PAGINATION
    );
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postColor = async (payload: PayLoadCreatecolor) => {
  try {
    const { data: response } = await mainApi.post(CREATE_COLOR, payload);
    return response;
  } catch (error) {
    console.error("Error creating color:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const updateColor = async (
  color_id: string,
  payload: PayLoadCreatecolor
) => {
  try {
    // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
    //const encodedColorName = encodeURIComponent(color_id);
    const { data: response } = await mainApi.patch(
      `${UPDATE_COLOR}/${color_id}`,
      payload
    );

    return response;
  } catch (error) {
    console.error("Error updating color:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const deleteColor = async (color_id: string) => {
  try {
    // ใช้ encodeURIComponent เพื่อเข้ารหัสตัวอักษรพิเศษใน color_name
    const encodedColorName = encodeURIComponent(color_id);
    const { data: response } = await mainApi.delete(
      `${DELETE_COLOR}/${encodedColorName}`
    );
    return response;
  } catch (error) {
    console.error("Error deleting color:", error); // Log the error
    throw error; // Optionally rethrow the error for further handling
  }
};

export const selectColor = async (
  searchText: string = ""
): Promise<ColorSelectResponse> => {
  try {
    const query = `?searchText=${encodeURIComponent(searchText)}`;
    const { data: response } = await mainApi.get<ColorSelectResponse>(
      `${SELECT_COLOR}${query}`
    );
    return response;
  } catch (error) {
    console.error("Error searching color:", error);
    throw error;
  }
};