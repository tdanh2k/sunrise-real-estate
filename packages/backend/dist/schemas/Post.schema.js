import z from "zod";
import { NonNegativeIntegerNumber, NonNegativeNumber, OptionalBoolean, OptionalJsDate, OptionalNumber, OptionalString, OptionalUUID, RequiredString, RequiredUUID, } from "../utils/ZodUtils.js";
import { GlobalPostTypeSchema } from "./GlobalPostType.schema.js";
export const PostSchema = z.object({
    Id: RequiredUUID,
    Code: RequiredString,
    Title: RequiredString,
    Description: RequiredString,
    CreatedDate: OptionalJsDate,
    TypeId: RequiredUUID,
    Address: RequiredString,
    Price: OptionalNumber,
    MapUrl: RequiredString,
    Area: NonNegativeNumber,
    PostType: GlobalPostTypeSchema.optional(),
    PostCurrentDetail: z.array(z.object({
        Id: RequiredUUID,
        PostId: RequiredUUID,
        DetailId: RequiredUUID,
        Value: RequiredString,
        IsNumber: OptionalBoolean,
        CreatedDate: OptionalJsDate,
    })),
    PostFeature: z.array(z.object({
        Id: RequiredUUID,
        PostId: RequiredUUID,
        Title: RequiredString,
        Description: RequiredString,
        CreatedDate: OptionalJsDate,
    })),
    PostImage: z.array(z.object({
        Id: OptionalUUID,
        Code: OptionalString,
        Name: OptionalString,
        Size: NonNegativeIntegerNumber,
        Path: OptionalString,
        PostId: OptionalUUID,
        MimeType: OptionalString,
        CreatedDate: OptionalJsDate,
    })),
});
