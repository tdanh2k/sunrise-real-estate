"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalPostDetailSchema = void 0;
const zod_1 = require("zod");
const ZodUtils_1 = require("../utils/ZodUtils");
exports.GlobalPostDetailSchema = zod_1.z.object({
    Id: ZodUtils_1.RequiredUUID,
    Code: ZodUtils_1.RequiredString,
    Name: ZodUtils_1.RequiredString,
    Unit: ZodUtils_1.RequiredString,
    IsNumber: ZodUtils_1.OptionalBoolean,
    CreatedDate: ZodUtils_1.OptionalJsDate,
});
