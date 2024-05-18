import z from "zod";
import { NonNegativeIntegerNumber, OptionalJsDate, OptionalString, RequiredString, RequiredUUID, } from "../utils/ZodUtils.js";
import { GlobalBlogTypeSchema } from "./GlobalBlogType.schema.js";
export const BlogSchema = z.object({
    Id: RequiredUUID,
    Code: OptionalString,
    Title: RequiredString,
    Description: RequiredString,
    CreatedDate: OptionalJsDate,
    TypeId: RequiredUUID,
    GlobalBlogType: GlobalBlogTypeSchema.optional(),
    BlogImage: z.array(z.object({
        Id: OptionalString,
        Code: OptionalString,
        Name: OptionalString,
        Size: NonNegativeIntegerNumber,
        Path: OptionalString,
        //BlogId: OptionalString,
        MimeType: OptionalString,
        Base64Data: OptionalString,
        CreatedDate: OptionalJsDate,
    })),
});
