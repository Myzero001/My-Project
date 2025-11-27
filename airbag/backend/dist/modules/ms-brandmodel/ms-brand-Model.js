"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.GetParamBrandModelSchema = exports.UpdateBrandModelSchema = exports.FindByBrandSchema = exports.CreateBrandModelSchema = void 0;
const zod_1 = require("zod");
exports.CreateBrandModelSchema = zod_1.z.object({
    body: zod_1.z.object({
        brandmodel_name: zod_1.z.string(),
        master_brand_id: zod_1.z.string().uuid().optional(),
    }),
});
exports.FindByBrandSchema = zod_1.z.object({
    body: zod_1.z.object({
        master_brand_id: zod_1.z.string().uuid().optional(),
    }),
});
exports.UpdateBrandModelSchema = zod_1.z.object({
    body: zod_1.z.object({
        ms_brandmodel_id: zod_1.z.string().uuid(),
        brandmodel_name: zod_1.z.string().max(50),
        master_brand_id: zod_1.z.string().uuid().optional(),
    }),
});
exports.GetParamBrandModelSchema = zod_1.z.object({
    params: zod_1.z.object({
        ms_brandmodel_id: zod_1.z.string().uuid(),
    }),
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() }),
    params: zod_1.z.object({ brand_id: zod_1.z.string() })
});
