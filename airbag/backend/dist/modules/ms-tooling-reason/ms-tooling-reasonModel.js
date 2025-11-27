"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.GetParamToolingReasonSchema = exports.GetToolingReasonSchema = exports.UpdateToolingReasonSchema = exports.CreateToolingReasonSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
exports.CreateToolingReasonSchema = zod_1.z.object({
    body: zod_1.z.object({
        tooling_reason_name: zod_1.z.string().max(50),
    })
});
exports.UpdateToolingReasonSchema = zod_1.z.object({
    body: zod_1.z.object({
        master_tooling_reason_id: zod_1.z.string().uuid(),
        tooling_reason_name: zod_1.z.string().max(50),
    })
});
exports.GetToolingReasonSchema = zod_1.z.object({
    params: zod_1.z.object({
        master_tooling_reason_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamToolingReasonSchema = zod_1.z.object({
    params: zod_1.z.object({
        master_tooling_reason_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
