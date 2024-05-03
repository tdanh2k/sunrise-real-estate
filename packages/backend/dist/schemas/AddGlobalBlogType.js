"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddGlobalBlogTypeSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ZodUtils_1 = require("../utils/ZodUtils");
exports.AddGlobalBlogTypeSchema = zod_1.default.object({
    Idx: ZodUtils_1.NonNegativeIntegerNumber,
    Name: ZodUtils_1.RequiredString,
    CreatedDate: ZodUtils_1.OptionalJsDate,
});
