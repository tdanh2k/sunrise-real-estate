import z from "zod";
import { NonNegativeIntegerNumber, OptionalJsDate, OptionalString, OptionalUUID, RequiredString, RequiredUUID, } from "../utils/ZodUtils.js";
import { GlobalBlogTypeSchema } from "./GlobalBlogType.schema.js";
import { Auth0UserSchema } from "./Auth0User.schema.js";
export const PendingBlogSchema = z.object({
    Id: RequiredUUID,
    Code: OptionalString,
    Title: RequiredString,
    Description: RequiredString,
    CreatedDate: OptionalJsDate,
    TypeId: RequiredUUID,
    ApprovedByUserId: OptionalString,
    ApprovedDate: OptionalJsDate,
    GlobalBlogType: GlobalBlogTypeSchema.optional(),
    Auth0Profile: Auth0UserSchema.optional(),
    PendingBlogImage: z.array(z.object({
        Id: OptionalUUID,
        Code: OptionalString,
        Name: OptionalString,
        Size: NonNegativeIntegerNumber,
        Path: OptionalString,
        //PendingBlogId: OptionalUUID,
        MimeType: OptionalString,
        CreatedDate: OptionalJsDate,
    })),
});
