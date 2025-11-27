"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeByName = void 0;
const serviceResponse_1 = require("@common/models/serviceResponse");
const httpHandlers_1 = require("@common/utils/httpHandlers");
const permissionMap_1 = require("@common/utils/permissionMap");
const http_status_codes_1 = require("http-status-codes");
/**
 * Middleware สำหรับตรวจสอบสิทธิ์การเข้าถึง
 * @param name หมวดหมู่สิทธิ์
 * @param requiredPermissions อาร์เรย์ของสิทธิ์ที่อนุญาต
 */
const authorizeByName = (name, requiredPermissions) => (req, res, next) => {
    var _a, _b, _c;
    try {
        const role = (_b = (_a = req.token) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.role;
        const userPermission = (_c = permissionMap_1.permissionMap[name]) === null || _c === void 0 ? void 0 : _c[role];
        if (!userPermission || !requiredPermissions.includes(userPermission)) {
            return handleUnauthorizedResponse(res);
        }
        next();
    }
    catch (err) {
        return handleUnauthorizedResponse(res);
    }
};
exports.authorizeByName = authorizeByName;
/**
 * ส่ง response กรณี Unauthorized
 */
const handleUnauthorizedResponse = (res) => {
    (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Unauthorized", null, http_status_codes_1.StatusCodes.FORBIDDEN), res);
};
