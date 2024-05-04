"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPendingPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ZodUtils_1 = require("../utils/ZodUtils");
exports.AddPendingPostSchema = zod_1.default.object({
    //Id: RequiredUUID,
    Code: ZodUtils_1.RequiredString,
    Title: ZodUtils_1.RequiredString,
    Description: ZodUtils_1.RequiredString,
    CreatedDate: ZodUtils_1.OptionalJsDate,
    TypeId: ZodUtils_1.RequiredUUID,
    Address: ZodUtils_1.RequiredString,
    Price: ZodUtils_1.OptionalNumber,
    ApprovedBy: ZodUtils_1.OptionalString,
    ApprovedDate: ZodUtils_1.OptionalJsDate,
    MapUrl: ZodUtils_1.RequiredString,
    Area: ZodUtils_1.NonNegativeNumber.optional(),
    PendingCurrentDetail: zod_1.default.array(zod_1.default.object({
        Id: ZodUtils_1.RequiredUUID,
        PendingPostId: ZodUtils_1.RequiredUUID,
        DetailId: ZodUtils_1.RequiredUUID,
        Value: ZodUtils_1.RequiredString,
        IsNumber: ZodUtils_1.OptionalBoolean,
        CreatedDate: ZodUtils_1.OptionalJsDate,
    })),
    PendingFeature: zod_1.default.array(zod_1.default.object({
        Id: ZodUtils_1.RequiredUUID,
        PendingPostId: ZodUtils_1.RequiredUUID,
        Title: ZodUtils_1.RequiredString,
        Description: ZodUtils_1.RequiredString,
        CreatedDate: ZodUtils_1.OptionalJsDate,
    })),
    PendingPostImage: zod_1.default.array(zod_1.default.object({
        Id: ZodUtils_1.RequiredUUID,
        Name: ZodUtils_1.RequiredString,
        Size: ZodUtils_1.NonNegativeIntegerNumber,
        Path: ZodUtils_1.RequiredString,
        PostId: ZodUtils_1.RequiredUUID,
        MimeType: ZodUtils_1.OptionalString,
        CreatedDate: ZodUtils_1.OptionalJsDate,
    })),
});
