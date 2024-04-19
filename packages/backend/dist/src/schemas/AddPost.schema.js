"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPostSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ZodUtils_1 = require("../utils/ZodUtils");
exports.AddPostSchema = zod_1.default.object({
    Code: ZodUtils_1.RequiredString,
    Title: ZodUtils_1.RequiredString,
    Description: ZodUtils_1.RequiredString,
    CreatedDate: ZodUtils_1.OptionalJsDate,
    TypeId: ZodUtils_1.RequiredUUID,
});
