import z from "zod";
import { NonNegativeIntegerNumber, NonNegativeNumber, OptionalBoolean, OptionalJsDate, OptionalNumber, OptionalString, RequiredString, RequiredUUID, } from "../utils/ZodUtils.js";
export const AddPendingPostSchema = z.object({
    Title: RequiredString,
    Description: RequiredString,
    CreatedDate: OptionalJsDate,
    TypeId: RequiredUUID,
    Address: RequiredString,
    Price: OptionalNumber,
    ApprovedByUserId: OptionalString,
    ApprovedDate: OptionalJsDate,
    MapUrl: RequiredString,
    Area: NonNegativeNumber.optional(),
    PendingCurrentDetail: z.array(z.object({
        Id: RequiredUUID,
        //PendingPostId: RequiredUUID,
        DetailId: RequiredUUID,
        Value: RequiredString,
        IsNumber: OptionalBoolean,
        CreatedDate: OptionalJsDate,
    })),
    PendingFeature: z.array(z.object({
        Id: RequiredUUID,
        //PendingPostId: RequiredUUID,
        Title: RequiredString,
        Description: RequiredString,
        CreatedDate: OptionalJsDate,
    })),
    PendingPostImage: z.array(z.object({
        Id: RequiredUUID,
        Name: RequiredString,
        Size: NonNegativeIntegerNumber,
        Path: RequiredString,
        //PendingPostId: RequiredUUID,
        MimeType: OptionalString,
        CreatedDate: OptionalJsDate,
    })),
});
