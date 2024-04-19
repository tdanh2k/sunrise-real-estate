"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddGlobalPostDetailSchema = void 0;
const zod_1 = require("zod");
const ZodUtils_1 = require("../utils/ZodUtils");
exports.AddGlobalPostDetailSchema = zod_1.z.object({
    Code: ZodUtils_1.RequiredString,
    Name: ZodUtils_1.RequiredString,
    Unit: ZodUtils_1.RequiredString,
    IsNumber: ZodUtils_1.RequiredBoolean,
    CreatedDate: ZodUtils_1.OptionalJsDate,
});
