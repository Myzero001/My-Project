"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.GetParamBrandSchema = exports.GetBrandSchema = exports.UpdateBrandSchema = exports.CreateBrandSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
exports.CreateBrandSchema = zod_1.z.object({
    body: zod_1.z.object({
        brand_name: zod_1.z.string().max(50),
    })
});
exports.UpdateBrandSchema = zod_1.z.object({
    body: zod_1.z.object({
        master_brand_id: zod_1.z.string().uuid(),
        brand_name: zod_1.z.string().max(50),
    })
});
exports.GetBrandSchema = zod_1.z.object({
    params: zod_1.z.object({
        master_brand_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamBrandSchema = zod_1.z.object({
    params: zod_1.z.object({
        master_brand_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
