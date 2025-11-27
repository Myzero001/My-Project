"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.UpdateCategorySchema = exports.GetCategorySchema = exports.CreatetoolSchema = void 0;
const zod_1 = require("zod");
exports.CreatetoolSchema = zod_1.z.object({
    body: zod_1.z.object({
        tool: zod_1.z.string().max(20),
    }),
});
exports.GetCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        tool_id: zod_1.z.string().uuid(),
        //tool: z.string()
    })
});
exports.UpdateCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        tool_id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        tool: zod_1.z.string()
    })
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
