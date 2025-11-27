"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParamRepairSchema = exports.GetRepairSchema = exports.UpdateRepairSchema = exports.CreateRepairSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
exports.CreateRepairSchema = zod_1.z.object({
    body: zod_1.z.object({
        master_repair_name: zod_1.z.string().max(50),
        master_group_repair_id: zod_1.z.string().uuid().optional(),
    })
});
exports.UpdateRepairSchema = zod_1.z.object({
    body: zod_1.z.object({
        master_repair_id: commonValidation_1.commonValidations.uuid,
        master_repair_name: zod_1.z.string().max(50),
        master_group_repair_id: zod_1.z.string().uuid().optional(),
    })
});
exports.GetRepairSchema = zod_1.z.object({
    params: zod_1.z.object({
        master_repair_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamRepairSchema = zod_1.z.object({
    params: zod_1.z.object({
        master_repair_id: commonValidation_1.commonValidations.uuid,
    })
});
