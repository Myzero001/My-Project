"use strict";
// import { users, roles } from "@prisma/client";
// import prisma from "@src/db";
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
exports.userRepository = exports.KeysFindUsername = exports.KeyProfile = exports.Keys = void 0;
const db_1 = __importDefault(require("@src/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const roleData_1 = require("@common/models/roleData");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let roldAdmin = null;
        for (const role of roleData_1.rolesData) {
            const result = yield db_1.default.roles.upsert({
                where: { role_name: role },
                update: {},
                create: {
                    role_name: role,
                },
            });
            // Save the result for the Admin role
            if (role === "Admin") {
                roldAdmin = result;
            }
        }
        if (!roldAdmin) {
            throw new Error("Admin role was not found or created.");
        }
        const roleId = roldAdmin.role_id;
    });
}
exports.Keys = [
    "employee_id",
    "employee_code",
    "username",
    "password",
    "is_active",
    "role_id",
    "email",
    "first_name",
    "last_name",
    "birthday",
    "phone_number",
    "line_id",
    "addr_number",
    "addr_alley",
    "addr_street",
    "addr_subdistrict",
    "addr_district",
    "addr_province",
    "addr_postcode",
    "position",
    "remark",
    "created_at",
    "updated_at",
    "employee_image",
    //"right",
    "job_title",
    "company_id",
];
exports.KeyProfile = [
    "employee_id",
    "first_name",
];
exports.KeysFindUsername = [
    "employee_id",
    "company_id",
    "username",
    "password",
    "role_id",
];
exports.userRepository = {
    findByUsername: (username_1, ...args_1) => __awaiter(void 0, [username_1, ...args_1], void 0, function* (username, keys = exports.KeysFindUsername) {
        return db_1.default.users.findUnique({
            where: { username: username },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    findById: (uuid_1, ...args_1) => __awaiter(void 0, [uuid_1, ...args_1], void 0, function* (uuid, keys = exports.KeysFindUsername) {
        return db_1.default.users.findUnique({
            where: { employee_id: uuid },
            select: keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}),
        });
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        // Payload
        const usernameTrim = payload.username.trim();
        const passwordTrim = payload.password.trim();
        const emailTrim = payload.email.trim();
        const firstName = payload.first_name.trim();
        const is_active = true;
        const roldAdmin = yield db_1.default.roles.findUnique({
            where: { role_name: "Admin" }, // หาบทบาทที่ชื่อว่า "Admin"
        });
        // ตรวจสอบว่า roldAdmin ไม่เป็น null
        if (!roldAdmin) {
            throw new Error("Admin role not found");
        }
        //const role_id = roldAdmin.role_id;
        // Hash Password using bcrypt
        const saltRounds = 10;
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const hashPassword = yield bcrypt_1.default.hash(passwordTrim, salt);
        // setPayload
        const setPayload = {
            employee_code: (_a = payload.employee_code) === null || _a === void 0 ? void 0 : _a.trim(),
            company_id: companyId,
            username: usernameTrim,
            password: hashPassword,
            role_id: (_b = payload.role_id) === null || _b === void 0 ? void 0 : _b.trim(),
            job_title: (_c = payload.job_title) === null || _c === void 0 ? void 0 : _c.trim(),
            //right: payload.right?.trim(),
            email: (_d = payload.email) === null || _d === void 0 ? void 0 : _d.trim(),
            first_name: (_e = payload.first_name) === null || _e === void 0 ? void 0 : _e.trim(),
            last_name: (_f = payload.last_name) === null || _f === void 0 ? void 0 : _f.trim(),
            birthday: payload.birthday,
            phone_number: (_g = payload.phone_number) === null || _g === void 0 ? void 0 : _g.trim(),
            line_id: (_h = payload.line_id) === null || _h === void 0 ? void 0 : _h.trim(),
            addr_number: (_j = payload.addr_number) === null || _j === void 0 ? void 0 : _j.trim(),
            addr_alley: (_k = payload.addr_alley) === null || _k === void 0 ? void 0 : _k.trim(),
            addr_street: (_l = payload.addr_street) === null || _l === void 0 ? void 0 : _l.trim(),
            addr_subdistrict: (_m = payload.addr_subdistrict) === null || _m === void 0 ? void 0 : _m.trim(),
            addr_district: (_o = payload.addr_district) === null || _o === void 0 ? void 0 : _o.trim(),
            addr_province: (_p = payload.addr_province) === null || _p === void 0 ? void 0 : _p.trim(),
            addr_postcode: (_q = payload.addr_postcode) === null || _q === void 0 ? void 0 : _q.trim(),
            position: (_r = payload.position) === null || _r === void 0 ? void 0 : _r.trim(),
            remark: (_s = payload.remark) === null || _s === void 0 ? void 0 : _s.trim(),
            employee_image: (_t = payload.employee_image) === null || _t === void 0 ? void 0 : _t.trim(),
            created_by: userId,
            updated_by: userId,
            is_active: is_active,
            //employee_code: payload.employee_code?.trim(), 
        };
        return yield db_1.default.users.create({
            data: setPayload
        });
    }),
    count: (companyId, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_1.default.users.count({
            where: Object.assign({ company_id: companyId }, (searchText
                ? {
                    OR: [
                        {
                            first_name: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                        {
                            last_name: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                        {
                            employee_code: {
                                contains: searchText,
                                mode: "insensitive"
                            }
                        }
                    ],
                }
                : {})),
        });
    }),
    findAll: (companyId, skip, take, searchText) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_1.default.users.findMany({
            where: searchText
                ? {
                    OR: [
                        {
                            first_name: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                        {
                            last_name: {
                                contains: searchText,
                                mode: "insensitive",
                            },
                        },
                        {
                            employee_code: {
                                contains: searchText,
                                mode: "insensitive"
                            }
                        }
                    ],
                }
                : {}, // ถ้าไม่มี searchText ก็ไม่ต้องใช้เงื่อนไขพิเศษ
            skip,
            take,
            select: {
                employee_id: true,
                employee_code: true,
                first_name: true,
                last_name: true,
                position: true,
                phone_number: true,
            },
            orderBy: { created_at: "asc" },
        });
    }),
    findByName: (companyId, username) => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.users.findFirst({
            where: { company_id: companyId, username: username },
        });
    }),
    update: (companyId, userId, employee_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        let hashPassword;
        if (payload.password) {
            const saltRounds = 10;
            const salt = yield bcrypt_1.default.genSalt(saltRounds);
            hashPassword = yield bcrypt_1.default.hash(payload.password.trim(), salt);
        }
        const setPayload = {
            employee_id: payload.employee_id,
            employee_code: payload.employee_code,
            company_id: (_a = payload.company_id) !== null && _a !== void 0 ? _a : null,
            username: payload.username,
            password: hashPassword || undefined,
            is_active: (_b = payload.is_active) !== null && _b !== void 0 ? _b : true,
            role_id: payload.role_id,
            job_title: (_c = payload.job_title) !== null && _c !== void 0 ? _c : null,
            email: payload.email,
            first_name: payload.first_name,
            last_name: (_d = payload.last_name) !== null && _d !== void 0 ? _d : null,
            birthday: (_e = payload.birthday) !== null && _e !== void 0 ? _e : null,
            phone_number: (_f = payload.phone_number) !== null && _f !== void 0 ? _f : null,
            line_id: (_g = payload.line_id) !== null && _g !== void 0 ? _g : null,
            addr_number: (_h = payload.addr_number) !== null && _h !== void 0 ? _h : null,
            addr_alley: (_j = payload.addr_alley) !== null && _j !== void 0 ? _j : null,
            addr_street: (_k = payload.addr_street) !== null && _k !== void 0 ? _k : null,
            addr_subdistrict: (_l = payload.addr_subdistrict) !== null && _l !== void 0 ? _l : null,
            addr_district: (_m = payload.addr_district) !== null && _m !== void 0 ? _m : null,
            addr_province: (_o = payload.addr_province) !== null && _o !== void 0 ? _o : null,
            addr_postcode: (_p = payload.addr_postcode) !== null && _p !== void 0 ? _p : null,
            position: (_q = payload.position) !== null && _q !== void 0 ? _q : null,
            remark: (_r = payload.remark) !== null && _r !== void 0 ? _r : null,
            employee_image: (_s = payload.employee_image) !== null && _s !== void 0 ? _s : null,
            updated_at: new Date(),
            updated_by: userId,
        };
        return yield db_1.default.users.update({
            where: { company_id: companyId, employee_id: employee_id },
            data: setPayload,
        });
    }),
    findById2: (companyId, employee_id) => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.users.findFirst({
            where: {
                company_id: companyId,
                employee_id: employee_id,
            },
            select: exports.Keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}), // Use Keys array
        });
    }),
    findById3: (companyId, username) => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.users.findFirst({
            where: {
                company_id: companyId,
                username: username
            },
            select: exports.Keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {}), // Use Keys array
        });
    }),
    findAllUsernames: () => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.users.findMany({
            select: {
                username: true,
            },
        });
    }),
    findById4: (companyId, employee_id) => __awaiter(void 0, void 0, void 0, function* () {
        const select = exports.KeyProfile
            .filter((key) => key !== "password")
            .reduce((obj, key) => {
            obj[key] = true;
            return obj;
        }, {});
        return db_1.default.users.findFirst({
            where: {
                company_id: companyId,
                employee_id: employee_id,
            },
            select: Object.assign(Object.assign({}, select), { company_id: true, role: {
                    select: {
                        role_name: true,
                    }
                } }),
        });
    }),
    findAllUsernamesAndIds: () => __awaiter(void 0, void 0, void 0, function* () {
        return db_1.default.users.findMany({
            select: {
                employee_id: true, // <--- เพิ่ม employee_id
                username: true,
            },
            orderBy: {
                username: 'asc',
            }
        });
    }),
};
