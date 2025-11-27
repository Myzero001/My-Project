"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceResponse_1 = require("@common/models/serviceResponse");
const httpHandlers_1 = require("@common/utils/httpHandlers");
const http_status_codes_1 = require("http-status-codes");
const roleData_1 = require("@common/models/roleData");
function authorizeAdmin(req, res, next) {
    var _a, _b;
    const role = (_b = (_a = req.token) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.role;
    if (!roleData_1.rolesData.includes(role)) {
        (0, httpHandlers_1.handleServiceResponse)(new serviceResponse_1.ServiceResponse(serviceResponse_1.ResponseStatus.Failed, "Unauthorized", null, http_status_codes_1.StatusCodes.FORBIDDEN), res);
        return;
    }
    next();
}
exports.default = authorizeAdmin;
