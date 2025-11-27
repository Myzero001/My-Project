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
const serviceResponse_1 = require("@common/models/serviceResponse");
const envConfig_1 = require("@common/utils/envConfig");
const httpHandlers_1 = require("@common/utils/httpHandlers");
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = require("jsonwebtoken");
const userRepository_1 = require("@modules/users/userRepository");
const roleRepository_1 = require("@modules/role/roleRepository");
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        {
            const token = req.cookies.token;
            let jwtPayload;
            if (!token) {
                (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Authentication failed", null, http_status_codes_1.StatusCodes.UNAUTHORIZED), res);
                return;
            }
            try {
                jwtPayload = (0, jsonwebtoken_1.verify)(token, envConfig_1.env.JWT_SECRET, {
                    complete: true,
                    algorithms: ["HS256"],
                    clockTolerance: 0,
                    ignoreExpiration: false,
                    ignoreNotBefore: false,
                });
                const uuid = jwtPayload.payload.uuid;
                const user = yield userRepository_1.userRepository.findById(uuid);
                if (!user) {
                    (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "User not found", null, http_status_codes_1.StatusCodes.FORBIDDEN), res);
                    return;
                }
                const roleData = yield roleRepository_1.roleRepository.findById(user.role_id);
                jwtPayload.payload.company_id = user.company_id;
                jwtPayload.payload.role_id = user.role_id;
                jwtPayload.payload.role = roleData === null || roleData === void 0 ? void 0 : roleData.role_name;
                req.token = jwtPayload;
            }
            catch (error) {
                (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Token is not valid", null, http_status_codes_1.StatusCodes.FORBIDDEN), res);
                return;
            }
            next();
        }
    });
}
exports.default = authenticateToken;
