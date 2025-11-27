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
exports.issueReasonRepository = exports.KeyIssueReason = void 0;
const db_1 = __importDefault(require("@src/db"));
exports.KeyIssueReason = ["issue_reason_id", "issue_reason_name"];
exports.issueReasonRepository = {
    findAll: (companyId_1, skip_1, take_1, searchText_1, ...args_1) => __awaiter(void 0, [companyId_1, skip_1, take_1, searchText_1, ...args_1], void 0, function* (companyId, skip, take, searchText, keys = exports.KeyIssueReason) {
        // กำหนดฟิลด์ที่ต้องการดึง
        const selectFields = keys.reduce((obj, k) => {
            obj[k] = true;
            return obj;
        }, {});
        return yield db_1.default.master_issue_reason.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    {
                        issue_reason_name: {
                            contains: searchText,
                            mode: "insensitive", // ค้นหาทั้งตัวพิมพ์เล็กและใหญ่
                        },
                    },
                    {
                        type_issue_group: {
                            type_issue_group_name: {
                                contains: searchText,
                                mode: "insensitive", // ค้นหาทั้งตัวพิมพ์เล็กและใหญ่
                            },
                        },
                    },
                ],
            })),
            skip, // จำนวนข้อมูลที่ต้องข้าม
            take, // จำนวนข้อมูลที่ต้องดึง
            select: Object.assign(Object.assign({}, selectFields), { type_issue_group: {
                    select: {
                        type_issue_group_id: true,
                        type_issue_group_name: true,
                    },
                } }),
            orderBy: { created_at: "asc" }, // การจัดเรียง
        });
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_1.default.master_issue_reason.count({
            where: Object.assign({ company_id: companyId }, (searchText && {
                OR: [
                    {
                        issue_reason_name: {
                            contains: searchText,
                            mode: "insensitive", // ค้นหาทั้งตัวพิมพ์เล็กและใหญ่
                        },
                    },
                    {
                        type_issue_group: {
                            type_issue_group_name: {
                                contains: searchText,
                                mode: "insensitive", // ค้นหาทั้งตัวพิมพ์เล็กและใหญ่
                            },
                        },
                    },
                ],
            })),
        });
    }),
    findAllNoPagination: (companyId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_1.default.master_issue_reason.findMany({
            where: {
                company_id: companyId,
            },
            orderBy: { created_at: "asc" },
        });
    }),
    select: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield db_1.default.master_issue_reason.findMany({
            where: Object.assign({ company_id: companyId }, (searchText && {
                issue_reason_name: {
                    contains: searchText,
                    mode: 'insensitive'
                },
            })),
            skip: 0,
            take: 50,
            select: {
                issue_reason_id: true,
                issue_reason_name: true
            },
            orderBy: { created_at: "asc" },
        });
        return data;
    }),
    findByName: (companyId_1, payload_1, ...args_1) => __awaiter(void 0, [companyId_1, payload_1, ...args_1], void 0, function* (companyId, payload, // ชื่อที่ต้องการค้นหา
    keys = exports.KeyIssueReason) {
        return db_1.default.master_issue_reason.findFirst({
            where: {
                company_id: companyId,
                issue_reason_name: payload.issue_reason_name,
                type_issue_group_id: payload.type_issue_group_id,
            },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        }); // คืนค่าหนึ่งค่า
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        // ตัดช่องว่างจากชื่อหมวดหมู่
        const issue_reason_name = payload.issue_reason_name.trim();
        const type_issue_group_id = payload.type_issue_group_id.trim();
        // สร้างอ็อบเจ็กต์สำหรับข้อมูลที่จะบันทึก
        const setPayload = {
            company_id: companyId,
            issue_reason_name: issue_reason_name,
            type_issue_group_id: type_issue_group_id,
            created_by: userId,
            updated_by: userId,
        };
        // สร้างหมวดหมู่ใหม่ในฐานข้อมูล
        return yield db_1.default.master_issue_reason.create({
            data: setPayload,
            select: {
                issue_reason_id: true,
                issue_reason_name: true,
                type_issue_group: {
                    select: {
                        type_issue_group_id: true,
                        type_issue_group_name: true,
                    },
                },
            },
        });
    }),
    findByIdAsync: (companyId_1, issue_reason_id_1, ...args_1) => __awaiter(void 0, [companyId_1, issue_reason_id_1, ...args_1], void 0, function* (companyId, issue_reason_id, keys = exports.KeyIssueReason) {
        return db_1.default.master_issue_reason.findFirst({
            where: {
                company_id: companyId,
                issue_reason_id: issue_reason_id,
            },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        }); // คืนค่าหนึ่งค่า
    }),
    update: (companyId, userId, issue_reason_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        const trim_issue_reason_id = issue_reason_id.trim();
        const issue_reason_name = payload.issue_reason_name.trim();
        const type_issue_group_id = payload.type_issue_group_id.trim();
        const setPayload = {
            issue_reason_name: issue_reason_name,
            type_issue_group_id: type_issue_group_id,
            updated_by: userId,
        };
        return yield db_1.default.master_issue_reason.update({
            where: {
                company_id: companyId,
                issue_reason_id: trim_issue_reason_id,
            },
            data: setPayload,
            select: {
                issue_reason_id: true,
                issue_reason_name: true,
                type_issue_group: {
                    select: {
                        type_issue_group_id: true,
                        type_issue_group_name: true,
                    },
                },
            },
        });
    }),
    delete: (companyId, issue_reason_id) => __awaiter(void 0, void 0, void 0, function* () {
        // ตัดช่องว่างจาก ID
        const trim_issue_reason_id = issue_reason_id.trim();
        // ลบหมวดหมู่จากฐานข้อมูล
        return yield db_1.default.master_issue_reason.delete({
            where: {
                company_id: companyId,
                issue_reason_id: trim_issue_reason_id,
            },
        });
    }),
};
