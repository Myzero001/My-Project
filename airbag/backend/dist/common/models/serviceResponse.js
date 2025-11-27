"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceResponseSchema = exports.ServiceResponse = exports.ResponseStatus = void 0;
const zod_1 = require("zod");
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["Success"] = 0] = "Success";
    ResponseStatus[ResponseStatus["Failed"] = 1] = "Failed";
})(ResponseStatus || (exports.ResponseStatus = ResponseStatus = {}));
class ServiceResponse {
    constructor(status, message, responseObject, statusCode) {
        this.success = status === ResponseStatus.Success;
        this.message = message;
        this.responseObject = responseObject;
        this.statusCode = statusCode;
    }
}
exports.ServiceResponse = ServiceResponse;
const ServiceResponseSchema = (dataSchema) => zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
    responseObject: dataSchema.optional(),
    statusCode: zod_1.z.number(),
    header: zod_1.z.any(),
});
exports.ServiceResponseSchema = ServiceResponseSchema;
