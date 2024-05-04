"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ZodUtils_1 = require("../utils/ZodUtils");
exports.DraftPostSchema = zod_1.default.object({
    Id: ZodUtils_1.RequiredUUID,
    Code: ZodUtils_1.RequiredString,
    Title: ZodUtils_1.RequiredString,
    Description: ZodUtils_1.RequiredString,
    CreatedDate: ZodUtils_1.OptionalJsDate,
    TypeId: ZodUtils_1.RequiredUUID,
    Address: ZodUtils_1.RequiredString,
    Price: ZodUtils_1.OptionalNumber,
    MapUrl: ZodUtils_1.RequiredString,
    Area: ZodUtils_1.NonNegativeNumber,
    GlobalPostType: zod_1.default
        .object({
        Id: ZodUtils_1.RequiredUUID,
        Idx: ZodUtils_1.NonNegativeIntegerNumber,
        Name: ZodUtils_1.RequiredString,
        CreatedDate: ZodUtils_1.OptionalJsDate,
    })
        .optional(),
    DraftPostCurrentDetail: zod_1.default.array(zod_1.default.object({
        Id: ZodUtils_1.RequiredUUID,
        DraftId: ZodUtils_1.RequiredUUID,
        DetailId: ZodUtils_1.RequiredUUID,
        Value: ZodUtils_1.RequiredString,
        IsNumber: ZodUtils_1.OptionalBoolean,
        CreatedDate: ZodUtils_1.OptionalJsDate,
    })),
    DraftPostFeature: zod_1.default.array(zod_1.default.object({
        Id: ZodUtils_1.RequiredUUID,
        DraftId: ZodUtils_1.RequiredUUID,
        Title: ZodUtils_1.RequiredString,
        Description: ZodUtils_1.RequiredString,
        CreatedDate: ZodUtils_1.OptionalJsDate,
    })),
    DraftPostImage: zod_1.default.array(zod_1.default.object({
        Id: ZodUtils_1.RequiredUUID,
        Code: ZodUtils_1.OptionalString,
        Name: ZodUtils_1.RequiredString,
        Size: ZodUtils_1.NonNegativeIntegerNumber,
        Path: ZodUtils_1.RequiredString,
        DraftId: ZodUtils_1.RequiredUUID,
        MimeType: ZodUtils_1.OptionalString,
        Base64Data: ZodUtils_1.OptionalString,
        CreatedDate: ZodUtils_1.OptionalJsDate,
    })),
});
