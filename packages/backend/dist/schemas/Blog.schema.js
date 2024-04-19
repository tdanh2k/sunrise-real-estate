"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ZodUtils_1 = require("../utils/ZodUtils");
exports.BlogSchema = zod_1.default.object({
    Id: ZodUtils_1.RequiredUUID,
    Code: ZodUtils_1.RequiredString,
    Title: ZodUtils_1.RequiredString,
    Description: ZodUtils_1.RequiredString,
    CreatedDate: ZodUtils_1.OptionalJsDate,
    TypeId: ZodUtils_1.RequiredUUID,
    Address: ZodUtils_1.RequiredString,
    BlogImage: zod_1.default.array(zod_1.default.object({
        Id: ZodUtils_1.RequiredUUID,
        Name: ZodUtils_1.RequiredString,
        Size: ZodUtils_1.NonNegativeIntegerNumber,
        Path: ZodUtils_1.RequiredString,
        BlogId: ZodUtils_1.RequiredUUID,
        MimeType: ZodUtils_1.OptionalString,
        CreatedDate: ZodUtils_1.OptionalJsDate,
    })),
});
