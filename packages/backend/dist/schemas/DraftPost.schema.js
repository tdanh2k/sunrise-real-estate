import z from "zod";
import { NonNegativeIntegerNumber, NonNegativeNumber, OptionalBoolean, OptionalJsDate, OptionalNumber, OptionalString, RequiredString, RequiredUUID, } from "../utils/ZodUtils.js";
export const DraftPostSchema = z.object({
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
    GlobalPostType: z
        .object({
        Id: RequiredUUID,
        Idx: NonNegativeIntegerNumber,
        Name: RequiredString,
        CreatedDate: OptionalJsDate,
    })
        .optional(),
    DraftPostCurrentDetail: z.array(z.object({
        Id: RequiredUUID,
        DraftId: RequiredUUID,
        DetailId: RequiredUUID,
        Value: RequiredString,
        IsNumber: OptionalBoolean,
        CreatedDate: OptionalJsDate,
    })),
    DraftPostFeature: z.array(z.object({
        Id: RequiredUUID,
        DraftId: RequiredUUID,
        Title: RequiredString,
        Description: RequiredString,
        CreatedDate: OptionalJsDate,
    })),
    DraftPostImage: z.array(z.object({
        Id: RequiredUUID,
        Code: OptionalString,
        Name: RequiredString,
        Size: NonNegativeIntegerNumber,
        Path: RequiredString,
        DraftId: RequiredUUID,
        MimeType: OptionalString,
        Base64Data: OptionalString,
        CreatedDate: OptionalJsDate,
    })),
});
