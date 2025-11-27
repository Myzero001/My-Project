"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetParamGroupRepairSchema = exports.GetGroupRepairSchema = exports.UpdateGroupRepairSchema = exports.CreateGroupRepairSchema = void 0;
const commonValidation_1 = require("@common/utils/commonValidation");
const zod_1 = require("zod");
exports.CreateGroupRepairSchema = zod_1.z.object({
    body: zod_1.z.object({
        group_repair_name: zod_1.z.string().max(50),
    })
});
exports.UpdateGroupRepairSchema = zod_1.z.object({
    body: zod_1.z.object({
        master_group_repair_id: zod_1.z.string().uuid(),
        group_repair_name: zod_1.z.string().max(50),
    })
});
exports.GetGroupRepairSchema = zod_1.z.object({
    params: zod_1.z.object({
        master_group_repair_id: commonValidation_1.commonValidations.uuid,
    })
});
exports.GetParamGroupRepairSchema = zod_1.z.object({
    params: zod_1.z.object({
        master_group_repair_id: commonValidation_1.commonValidations.uuid,
    })
});
