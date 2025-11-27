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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandModelRepository = void 0;
const db_1 = __importDefault(require("@src/db"));
exports.brandModelRepository = {
    // ดึงข้อมูลทั้งหมด พร้อม pagination
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_1.default.master_brandmodel.findMany({
            where: Object.assign({ company_id: companyId }, (searchText
                ? {
                    OR: [
                        {
                            brandmodel_name: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                        {
                            master_brand: {
                                brand_name: {
                                    contains: searchText,
                                    mode: "insensitive",
                                },
                            },
                        },
                    ],
                }
                : {})),
            skip,
            take,
            select: {
                ms_brandmodel_id: true, // ฟิลด์ ms_brandmodel_id
                brandmodel_name: true, // ฟิลด์ brandmodel_name
                master_brand: {
                    // ฟิลด์จากตาราง master_brand ที่เชื่อมโยง
                    select: {
                        master_brand_id: true, // ฟิลด์ master_brand_id
                        brand_name: true, // ฟิลด์ brand_name
                    },
                },
            },
            orderBy: { created_at: "asc" }, // เรียงลำดับตาม created_at
        });
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_1.default.master_brandmodel.findMany({
            where: {
                company_id: companyId,
            },
            orderBy: { created_at: "asc" },
        });
    }),
    select: (companyId, brandId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield db_1.default.master_brandmodel.findMany({
            where: Object.assign({ company_id: companyId, master_brand_id: brandId }, (searchText && {
                brandmodel_name: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            })),
            skip: 0,
            take: 50,
            select: {
                ms_brandmodel_id: true,
                brandmodel_name: true
            },
            orderBy: { created_at: "asc" }, // เรียงตามวันที่หรือคอลัมน์ที่คุณต้องการ
        });
        return data;
    }),
    // นับจำนวนข้อมูลทั้งหมด
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_1.default.master_brandmodel.count({
            where: Object.assign({ company_id: companyId }, (searchText
                ? {
                    OR: [
                        {
                            brandmodel_name: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                        {
                            master_brand: {
                                brand_name: {
                                    contains: searchText,
                                    mode: "insensitive",
                                },
                            },
                        },
                    ],
                }
                : {})),
        });
    }),
    // ค้นหาด้วย Brand ID
    findByBrand: (companyId_1, master_brand_id_1, ...args_1) => __awaiter(void 0, [companyId_1, master_brand_id_1, ...args_1], void 0, function* (companyId, master_brand_id, keys = [
        "ms_brandmodel_id",
        "brandmodel_name",
        "master_brand_id",
    ]) {
        return db_1.default.master_brandmodel.findMany({
            where: {
                company_id: companyId,
                master_brand_id: master_brand_id.trim(),
            },
            select: keys.reduce((obj, key) => (Object.assign(Object.assign({}, obj), { [key]: true })), {}),
        });
    }),
    findByName: (companyId_1, brandmodel_name_1, master_brand_id_1, excludeId_1, ...args_1) => __awaiter(void 0, [companyId_1, brandmodel_name_1, master_brand_id_1, excludeId_1, ...args_1], void 0, function* (companyId, brandmodel_name, master_brand_id, excludeId, keys = [
        "ms_brandmodel_id",
        "brandmodel_name",
        "master_brand_id",
        "created_at",
        "updated_at",
    ]) {
        return db_1.default.master_brandmodel.findFirst({
            where: {
                // ใช้ AND เพื่อรวมเงื่อนไขทั้งหมด
                AND: [
                    // เงื่อนไขที่ 1: เปรียบเทียบชื่อแบบไม่สนตัวพิมพ์เล็ก-ใหญ่
                    {
                        brandmodel_name: {
                            equals: brandmodel_name.trim(),
                            mode: 'insensitive',
                        }
                    },
                    // เงื่อนไขที่ 2: ต้องเป็นของบริษัทเดียวกัน
                    { company_id: companyId },
                    // เงื่อนไขที่ 3 (ถ้ามี): ต้องเป็นของแบรนด์เดียวกัน
                    ...(master_brand_id ? [{ master_brand_id }] : []),
                    // เงื่อนไขที่ 4 (ถ้ามี): ต้องไม่ใช่ ID ที่กำลังแก้ไข
                    ...(excludeId ? [{ ms_brandmodel_id: { not: excludeId } }] : []),
                ]
            },
            select: keys.reduce((obj, key) => (Object.assign(Object.assign({}, obj), { [key]: true })), {}),
        });
    }),
    // สร้างข้อมูลใหม่
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const brandmodel_name = payload.brandmodel_name.trim();
        return db_1.default.master_brandmodel.create({
            data: {
                company_id: companyId,
                brandmodel_name,
                master_brand_id: payload.master_brand_id || null,
                created_by: userId,
                updated_by: userId,
            },
            select: {
                brandmodel_name: true,
                created_at: true,
                created_by: true,
            },
        });
    }),
    // ค้นหาด้วย ID
    findById: (companyId_1, ms_brandmodel_id_1, ...args_1) => __awaiter(void 0, [companyId_1, ms_brandmodel_id_1, ...args_1], void 0, function* (companyId, ms_brandmodel_id, keys = [
        "ms_brandmodel_id",
        "brandmodel_name",
        "master_brand_id",
        "created_at",
        "updated_at",
    ]) {
        return db_1.default.master_brandmodel.findFirst({
            where: {
                company_id: companyId,
                ms_brandmodel_id,
            },
            select: keys.reduce((obj, key) => (Object.assign(Object.assign({}, obj), { [key]: true })), {}),
        });
    }),
    // อัปเดตข้อมูล
    update: (companyId, userId, ms_brandmodel_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const brandmodel_name = payload.brandmodel_name.trim();
        return db_1.default.master_brandmodel.update({
            where: {
                ms_brandmodel_id,
                company_id: companyId,
            },
            data: {
                brandmodel_name,
                master_brand_id: payload.master_brand_id || null,
                updated_by: userId,
            },
            select: {
                brandmodel_name: true,
                updated_at: true,
                updated_by: true,
            },
        });
    }),
    // ลบข้อมูล
    delete: (companyId, ms_brandmodel_id) => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.master_brandmodel.delete({
            where: {
                ms_brandmodel_id,
                company_id: companyId,
            },
        });
    }),
};
