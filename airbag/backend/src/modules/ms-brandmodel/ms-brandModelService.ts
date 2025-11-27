import { StatusCodes } from "http-status-codes";
import {
  ResponseStatus,
  ServiceResponse,
} from "@common/models/serviceResponse";
import { brandModelRepository } from "@modules/ms-brandmodel/ms-brandModelRepository";
import { TypePayloadMasterBrandModel } from "@modules/ms-brandmodel/ms-brand-Model";
import { brandRepository } from "@modules/ms-brand/ms-brandRepository";
import { master_brandmodel } from "@prisma/client";
import { quotationRepository } from "@modules/quotation/quotationRepository"


export const brandModelService = {
  // ดึงข้อมูลทั้งหมดพร้อม Pagination
  findAll: async (companyId: string, page: number = 1, pageSize: number = 12, searchText: string = "") => {
    try {
      const skip = (page - 1) * pageSize; // คำนวณ offset
      const models = await brandModelRepository.findAll(companyId, skip, pageSize, searchText); // ดึงข้อมูล
      const totalCount = await brandModelRepository.count(companyId, searchText); // นับจำนวนทั้งหมด

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        {
          data: models,
          totalCount, // จำนวนข้อมูลทั้งหมด
          totalPages: Math.ceil(totalCount / pageSize), // จำนวนหน้าทั้งหมด
        },
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching models",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findAllNoPagination: async (companyId: string) => {
    try {
      const brandModel = await brandModelRepository.findAllNoPagination(companyId);
      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        brandModel,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching brand",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  findByBrand: async (companyId: string, brand_id: string) => {
    try {
      const checkBrand = await brandRepository.findByIdAsync(
        companyId,
        brand_id
      );
      if (!checkBrand) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Brand not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const models = await brandModelRepository.findByBrand(
        companyId,
        brand_id
      );

      return new ServiceResponse(
        ResponseStatus.Success,
        "Get all success",
        models,
        StatusCodes.OK
      );
    } catch (error) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        "Error fetching models",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // สร้าง BrandModel
  create: async (
    companyId: string,
    userId: string,
    payload: TypePayloadMasterBrandModel
  ) => {
    try {
      const checkModel = await brandModelRepository.findByName(
        companyId,
        payload.brandmodel_name,
        payload.master_brand_id // เพิ่ม master_brand_id ในการตรวจสอบ
      );

      if (checkModel) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Model with the same name already exists for this brand",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      const model = await brandModelRepository.create(
        companyId,
        userId,
        payload
      );
      return new ServiceResponse(
        ResponseStatus.Success,
        "Create model success",
        model,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error creating model: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // อัปเดต BrandModel
  update: async (
    companyId: string,
    userId: string,
    ms_brandmodel_id: string,
    payload: TypePayloadMasterBrandModel
  ) => {
    try {
      // 1. ตรวจสอบว่า ID ที่จะแก้ไขมีอยู่จริงหรือไม่ (อันนี้ทำถูกแล้ว)
      const checkModelExists = await brandModelRepository.findById(
        companyId,
        ms_brandmodel_id
      );
      if (!checkModelExists) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Model not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      // 2. ตรวจสอบข้อมูลซ้ำ (Logic ใหม่)
      const existingModelWithSameName = await brandModelRepository.findByName(
        companyId,
        payload.brandmodel_name,
        payload.master_brand_id, // << ส่ง brand_id ไปด้วย
        ms_brandmodel_id          // << ส่ง id ของรายการปัจจุบันไปเพื่อ "ยกเว้น"
      );

      // ถ้าเจอรายการอื่นที่ซ้ำ
      if (existingModelWithSameName) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Another model with the same name and brand already exists.", // แก้ไขข้อความให้ชัดเจน
          null,
          StatusCodes.BAD_REQUEST // หรือ 409 Conflict ก็ได้
        );
      }

      // 3. ถ้าไม่ซ้ำ ก็ทำการอัปเดต (โค้ดเดิม)
      const updatedModel = await brandModelRepository.update(
        companyId,
        userId,
        ms_brandmodel_id,
        payload
      );

      return new ServiceResponse(
        ResponseStatus.Success,
        "Update model success",
        updatedModel,
        StatusCodes.OK
      );

    } catch (ex) {
      return new ServiceResponse(
        ResponseStatus.Failed,
        `Error updating model: ${(ex as Error).message}`,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // ลบ BrandModel
  delete: async (companyId: string, ms_brandmodel_id: string) => {
    try {
      // ตรวจสอบว่ามี ID นี้อยู่หรือไม่
      const checkModel = await brandModelRepository.findById(
        companyId,
        ms_brandmodel_id
      );
      if (!checkModel) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Model not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }
      const checkBrandModelInQuotation = await quotationRepository.checkQuotation(companyId, "model_id", ms_brandmodel_id);
      if (checkBrandModelInQuotation) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Model is used in quotation",
          null,
          StatusCodes.BAD_REQUEST
        )
      }
      // ลบข้อมูล
      await brandModelRepository.delete(companyId, ms_brandmodel_id);
      return new ServiceResponse<string>(
        ResponseStatus.Success,
        "Delete model success",
        "Model deleted successfully",
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error deleting model: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  // ค้นหาตาม ID
  findById: async (companyId: string, ms_brandmodel_id: string) => {
    try {
      const model = await brandModelRepository.findById(
        companyId,
        ms_brandmodel_id
      );
      if (!model) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Model not found",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      return new ServiceResponse<master_brandmodel>(
        ResponseStatus.Success,
        "Model found",
        model,
        StatusCodes.OK
      );
    } catch (ex) {
      const errorMessage = `Error fetching model: ${(ex as Error).message}`;
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  },

  select: async (companyId: string , brandId: string , searchText: string = "") => {
      try {
        const data = await brandModelRepository.select(companyId , brandId , searchText);
        return new ServiceResponse(
          ResponseStatus.Success,
          "Select success",
          {data},
          StatusCodes.OK
        );
        
      } catch (error) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "Error fetching select",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    },
};
