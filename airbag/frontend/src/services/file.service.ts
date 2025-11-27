import {
  CREATE_FILE,
  CREATE_FILE_REPAIR_RECEIPT_BOX_AFTER,
  CREATE_FILE_REPAIR_RECEIPT_BOX_BEFORE,
  DELETE_FILE,
  GET_FILE_BY_URL,
  GET_SERVE_FILE,
} from "@/apis/endpoint.api";
import mainApi from "@/apis/main.api";
import { APIResponseType } from "@/types/response";
import {
  ResponseCreateFileType,
  TypeFile,
} from "@/types/response/response.file";

export const postFile = async (payload: FormData) => {
  try {
    const { data: response } = await mainApi.post<
      APIResponseType<ResponseCreateFileType>
    >(CREATE_FILE, payload);
    return response;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

export const postFileRepairReceiptBoxBefore = async (payload: FormData) => {
  try {
    const { data: response } = await mainApi.post<
      APIResponseType<ResponseCreateFileType>
    >(CREATE_FILE_REPAIR_RECEIPT_BOX_BEFORE, payload);
    return response;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

export const postFileRepairReceiptBoxAfter = async (payload: FormData) => {
  try {
    const { data: response } = await mainApi.post<
      APIResponseType<ResponseCreateFileType>
    >(CREATE_FILE_REPAIR_RECEIPT_BOX_AFTER, payload);
    return response;
  } catch (error) {
    console.error("Error creating file:", error);
    throw error;
  }
};

export const deleteFile = async (file_url: string) => {
  try {
    const response = await mainApi.post(DELETE_FILE, {
      file_url: file_url,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const fetchFileByURL = async (file_url: string) => {
  const response = await mainApi.post<APIResponseType<TypeFile[]>>(
    GET_FILE_BY_URL,
    {
      file_url,
    }
  );
  return response.data;
};

export const fetchImages = async (images: TypeFile[]) => {
  const newImagesPromises = images.map(async (image) => {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_API}${GET_SERVE_FILE}?file_url=${
        image.file_url
      }`
    );
    const blobData = await response.blob();
    const blobToFile = new File([blobData], image.file_name, {
      type: image.file_type,
    }) as any;
    blobToFile.status = "new";
    blobToFile.url = URL.createObjectURL(blobToFile);
    blobToFile.imageURL = URL.createObjectURL(blobToFile);
    blobToFile.file_url = URL.createObjectURL(blobToFile);
    blobToFile.id = Math.random().toString(36).slice(2);
    return blobToFile;
  });

  const newImages = await Promise.all(newImagesPromises);
  return newImages;
};
