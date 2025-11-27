"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSchema = exports.deleteColorSchema = exports.UpdateColorSchema = exports.GetColorSchema = exports.CreateColorSchema = void 0;
const zod_1 = require("zod");
exports.CreateColorSchema = zod_1.z.object({
    body: zod_1.z.object({
        color_name: zod_1.z.string().max(50),
    })
});
exports.GetColorSchema = zod_1.z.object({
    params: zod_1.z.object({
        color_name: zod_1.z.string().max(50),
    })
});
exports.UpdateColorSchema = zod_1.z.object({
    body: zod_1.z.object({
        color_name: zod_1.z.string().max(50),
    })
});
exports.deleteColorSchema = zod_1.z.object({
    params: zod_1.z.object({
        color_id: zod_1.z.string().max(50),
    })
});
exports.SelectSchema = zod_1.z.object({
    query: zod_1.z.object({ searchText: zod_1.z.string().optional() })
});
