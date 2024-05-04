"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDraftBlogSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ZodUtils_1 = require("../utils/ZodUtils");
const GlobalBlogType_schema_1 = require("./GlobalBlogType.schema");
exports.AddDraftBlogSchema = zod_1.default.object({
    Id: ZodUtils_1.OptionalUUID,
    Code: ZodUtils_1.OptionalString,
    Title: ZodUtils_1.OptionalString,
    Description: ZodUtils_1.OptionalString,
    CreatedDate: ZodUtils_1.OptionalJsDate,
    TypeId: ZodUtils_1.OptionalUUID,
    GlobalBlogType: GlobalBlogType_schema_1.GlobalBlogTypeSchema.optional(),
    DraftBlogImage: zod_1.default.array(zod_1.default.object({
        Id: ZodUtils_1.OptionalUUID,
        Code: ZodUtils_1.OptionalString,
        Name: ZodUtils_1.OptionalString,
        Size: ZodUtils_1.NonNegativeIntegerNumber,
        Path: ZodUtils_1.OptionalString,
        BlogId: ZodUtils_1.OptionalUUID,
        MimeType: ZodUtils_1.OptionalString,
        Base64Data: ZodUtils_1.OptionalString,
        CreatedDate: ZodUtils_1.OptionalJsDate,
    })),
});
