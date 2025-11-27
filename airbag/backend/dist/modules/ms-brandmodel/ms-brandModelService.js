"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandModelService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const ms_brandModelRepository_1 = require("@modules/ms-brandmodel/ms-brandModelRepository");
const ms_brandRepository_1 = require("@modules/ms-brand/ms-brandRepository");
const quotationRepository_1 = require("@modules/quotation/quotationRepository");
exports.brandModelService = {
    // ดึงข้อมูลทั้งหมดพร้อม Pagination
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize; // คำนวณ offset
            const models = yield ms_brandModelRepository_1.brandModelRepository.findAll(companyId, skip, pageSize, searchText); // ดึงข้อมูล
            const totalCount = yield ms_brandModelRepository_1.brandModelRepository.count(companyId, searchText); // นับจำนวนทั้งหมด
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: models,
                totalCount, // จำนวนข้อมูลทั้งหมด
                totalPages: Math.ceil(totalCount / pageSize), // จำนวนหน้าทั้งหมด
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching models", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const brandModel = yield ms_brandModelRepository_1.brandModelRepository.findAllNoPagination(companyId);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", brandModel, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching brand", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findByBrand: (companyId, brand_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkBrand = yield ms_brandRepository_1.brandRepository.findByIdAsync(companyId, brand_id);
            if (!checkBrand) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Brand not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const models = yield ms_brandModelRepository_1.brandModelRepository.findByBrand(companyId, brand_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", models, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching models", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // สร้าง BrandModel
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkModel = yield ms_brandModelRepository_1.brandModelRepository.findByName(companyId, payload.brandmodel_name, payload.master_brand_id // เพิ่ม master_brand_id ในการตรวจสอบ
            );
            if (checkModel) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Model with the same name already exists for this brand", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const model = yield ms_brandModelRepository_1.brandModelRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create model success", model, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error creating model: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // อัปเดต BrandModel
    update: (companyId, userId, ms_brandmodel_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 1. ตรวจสอบว่า ID ที่จะแก้ไขมีอยู่จริงหรือไม่ (อันนี้ทำถูกแล้ว)
            const checkModelExists = yield ms_brandModelRepository_1.brandModelRepository.findById(companyId, ms_brandmodel_id);
            if (!checkModelExists) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Model not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // 2. ตรวจสอบข้อมูลซ้ำ (Logic ใหม่)
            const existingModelWithSameName = yield ms_brandModelRepository_1.brandModelRepository.findByName(companyId, payload.brandmodel_name, payload.master_brand_id, // << ส่ง brand_id ไปด้วย
            ms_brandmodel_id // << ส่ง id ของรายการปัจจุบันไปเพื่อ "ยกเว้น"
            );
            // ถ้าเจอรายการอื่นที่ซ้ำ
            if (existingModelWithSameName) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Another model with the same name and brand already exists.", // แก้ไขข้อความให้ชัดเจน
                null, http_status_codes_1.StatusCodes.BAD_REQUEST // หรือ 409 Conflict ก็ได้
                );
            }
            // 3. ถ้าไม่ซ้ำ ก็ทำการอัปเดต (โค้ดเดิม)
            const updatedModel = yield ms_brandModelRepository_1.brandModelRepository.update(companyId, userId, ms_brandmodel_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Update model success", updatedModel, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, `Error updating model: ${ex.message}`, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // ลบ BrandModel
    delete: (companyId, ms_brandmodel_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // ตรวจสอบว่ามี ID นี้อยู่หรือไม่
            const checkModel = yield ms_brandModelRepository_1.brandModelRepository.findById(companyId, ms_brandmodel_id);
            if (!checkModel) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Model not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const checkBrandModelInQuotation = yield quotationRepository_1.quotationRepository.checkQuotation(companyId, "model_id", ms_brandmodel_id);
            if (checkBrandModelInQuotation) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Model is used in quotation", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            // ลบข้อมูล
            yield ms_brandModelRepository_1.brandModelRepository.delete(companyId, ms_brandmodel_id);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Delete model success", "Model deleted successfully", http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error deleting model: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    // ค้นหาตาม ID
    findById: (companyId, ms_brandmodel_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const model = yield ms_brandModelRepository_1.brandModelRepository.findById(companyId, ms_brandmodel_id);
            if (!model) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Model not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Model found", model, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = `Error fetching model: ${ex.message}`;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    select: (companyId_1, brandId_1, ...args_1) => __awaiter(void 0, [companyId_1, brandId_1, ...args_1], void 0, function* (companyId, brandId, searchText = "") {
        try {
            const data = yield ms_brandModelRepository_1.brandModelRepository.select(companyId, brandId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Select success", { data }, http_status_codes_1.StatusCodes.OK);
        }
        catch (error) {
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Error fetching select", null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
