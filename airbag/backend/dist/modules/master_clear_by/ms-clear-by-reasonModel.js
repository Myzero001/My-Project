"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.GetParamClearBySchema = exports.GetClearBySchema = exports.UpdateCelarBySchema = exports.CreateCelarBySchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
exports.CreateCelarBySchema = zod_1.z.object({
    body: zod_1.z.object({
        clear_by_name: zod_1.z.string().max(50),
    })
});
exports.UpdateCelarBySchema = zod_1.z.object({
    body: zod_1.z.object({
        clear_by_id: zod_1.z.string().uuid(),
        clear_by_name: zod_1.z.string().max(50),
    })
});
exports.GetClearBySchema = zod_1.z.object({
    params: zod_1.z.object({
        clear_by_id: commonValidation_1.commonValidations.uuid
    })
});
exports.GetParamClearBySchema = zod_1.z.object({
    params: zod_1.z.object({
        clear_by_id: commonValidation_1.commonValidations.uuid
    })
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
