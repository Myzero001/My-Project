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
exports.userService = void 0;
const http_status_codes_1 = require("http-status-codes");
const serviceResponse_1 = require("@common/models/serviceResponse");
const userRepository_1 = require("@modules/users/userRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtGenerator_1 = require("@common/utils/jwtGenerator");
const roleRepository_1 = require("@modules/role/roleRepository");
const jsonwebtoken_1 = require("jsonwebtoken");
const envConfig_1 = require("@common/utils/envConfig");
exports.userService = {
    login: (payload, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkUser = yield userRepository_1.userRepository.findByUsername(payload.username);
            if (!checkUser) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "The username or password is incorrect.", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const password = payload.password;
            const passwordDB = checkUser.password;
            const isValidPassword = yield bcrypt_1.default.compare(password, passwordDB);
            if (!isValidPassword) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "The username or password is incorrect.", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const roleName = yield roleRepository_1.roleRepository.findById2(checkUser.role_id);
            const uuid = checkUser.employee_id;
            const role = checkUser.role_id;
            const companyId = checkUser.company_id;
            const dataPayload = {
                uuid: uuid,
                // role: role,
                // companyId: companyId
            };
            const token = yield jwtGenerator_1.jwtGenerator.generate(dataPayload);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'production',
                maxAge: (10 * 60 * 60 * 1000)
            });
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "User authenticated successfully.", roleName, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create user :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    logout: (res) => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'production',
                sameSite: 'strict'
            });
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "User logged out successfully.", null, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error during logout: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    },
    authStatus: (req) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.cookies.token;
            if (token) {
                try {
                    let jwtPayload = (0, jsonwebtoken_1.verify)(token, envConfig_1.env.JWT_SECRET, {
                        complete: true,
                        algorithms: ["HS256"],
                        clockTolerance: 0,
                        ignoreExpiration: false,
                        ignoreNotBefore: false,
                    });
                    const uuid = jwtPayload.payload.uuid;
                    const user = yield userRepository_1.userRepository.findById(uuid);
                    if (!user) {
                        return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "User not found", null, http_status_codes_1.StatusCodes.FORBIDDEN);
                    }
                    const roleName = yield roleRepository_1.roleRepository.findById2(user.role_id);
                    return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "User authenticated successfully", roleName, http_status_codes_1.StatusCodes.OK);
                }
                catch (error) {
                    return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Token is not valid", null, http_status_codes_1.StatusCodes.FORBIDDEN);
                }
            }
            else {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Authentication required", null, http_status_codes_1.StatusCodes.OK);
            }
        }
        catch (ex) {
            const errorMessage = "Error auth status: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findAll: (companyId_1, ...args_1) => __awaiter(void 0, [companyId_1, ...args_1], void 0, function* (companyId, page = 1, pageSize = 12, searchText = "") {
        try {
            const skip = (page - 1) * pageSize;
            const tool = yield userRepository_1.userRepository.findAll(companyId, skip, pageSize, searchText);
            const totalCount = yield userRepository_1.userRepository.count(companyId, searchText);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get all success", {
                data: tool,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error Find All Tool :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    update: (companyId, userId, employee_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkUser_Id = yield userRepository_1.userRepository.findById2(companyId, employee_id);
            if (!checkUser_Id) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "User not found", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const user = yield userRepository_1.userRepository.update(companyId, userId, employee_id, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Success", user, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error update user :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    getAllUsernames: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const usernames = yield userRepository_1.userRepository.findAllUsernames();
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Retrieved all usernames successfully.", usernames, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error retrieving usernames: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById: (companyId, employee_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userRepository_1.userRepository.findById2(companyId, employee_id);
            if (!user) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "User not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get user success", user, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get user: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    create: (companyId, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const username = (_a = payload.username) === null || _a === void 0 ? void 0 : _a.trim();
            const checkUser = yield userRepository_1.userRepository.findById3(companyId, username);
            if (checkUser) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Username already taken", null, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            const user = yield userRepository_1.userRepository.create(companyId, userId, payload);
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Create user success", user, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error create user :" + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    findById4: (companyId, user_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userRepository_1.userRepository.findById4(companyId, user_id);
            if (!user) {
                return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "User not found", null, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Get user success", user, http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error get user: " + ex.message;
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
    getAllUsernamesAndIds: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield userRepository_1.userRepository.findAllUsernamesAndIds(); // <--- เรียก repo function ใหม่
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Success, "Retrieved all usernames and IDs successfully.", // <--- แก้ Message นิดหน่อย
            users, // <--- ส่งข้อมูล users ที่มีทั้ง id และ username
            http_status_codes_1.StatusCodes.OK);
        }
        catch (ex) {
            const errorMessage = "Error retrieving usernames and IDs: " + ex.message; // <--- แก้ Message error
            return new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, errorMessage, null, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }),
};
