"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.GetParamMsPositionSchema = exports.GetMsPositionSchema = exports.UpdateMsPositionSchema = exports.CreateMsPositionSchema = void 0;
// ms_positionModel.ts
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
exports.CreateMsPositionSchema = zod_1.z.object({
    body: zod_1.z.object({
        position_name: zod_1.z.string().max(50)
    })
});
exports.UpdateMsPositionSchema = zod_1.z.object({
    body: zod_1.z.object({
        position_id: commonValidation_1.commonValidations.uuid,
        position_name: zod_1.z.string().max(50)
    })
});
exports.GetMsPositionSchema = zod_1.z.object({
    body: zod_1.z.object({
        position_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamMsPositionSchema = zod_1.z.object({
    params: zod_1.z.object({
        position_id: commonValidation_1.commonValidations.uuid
    })
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
