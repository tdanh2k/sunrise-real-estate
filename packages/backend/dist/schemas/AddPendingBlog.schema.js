import z from "zod";
import { NonNegativeIntegerNumber, OptionalJsDate, OptionalString, RequiredString, RequiredUUID, } from "../utils/ZodUtils.js";
import { GlobalBlogTypeSchema } from "./GlobalBlogType.schema.js";
export const AddPendingBlogSchema = z.object({
    Code: RequiredString,
    Title: RequiredString,
    Description: RequiredString,
    CreatedDate: OptionalJsDate,
    TypeId: RequiredUUID,
    GlobalBlogType: GlobalBlogTypeSchema.optional(),
    PendingBlogImage: z.array(z.object({
        Id: RequiredUUID,
        Code: OptionalString,
        Name: RequiredString,
        Size: NonNegativeIntegerNumber,
        Path: RequiredString,
        BlogId: RequiredUUID,
        MimeType: OptionalString,
        CreatedDate: OptionalJsDate,
    })),
});
