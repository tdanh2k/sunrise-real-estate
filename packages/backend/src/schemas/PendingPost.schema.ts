import z from "zod";
import {
  NonNegativeIntegerNumber,
  NonNegativeNumber,
  OptionalBoolean,
  OptionalJsDate,
  OptionalNumber,
  OptionalString,
  RequiredString,
  RequiredURL,
  RequiredUUID,
} from "../utils/ZodUtils";

export const PendingPostSchema = z.object({
  Id: RequiredUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  Address: RequiredString,
  Price: OptionalNumber,
  ApprovedBy: OptionalString,
  ApprovedDate: OptionalJsDate,
  MapUrl: RequiredString,
  Area: NonNegativeNumber,
  PendingPostCurrentDetail: z.array(
    z.object({
      Id: RequiredUUID,
      PendingPostId: RequiredUUID,
      DetailId: RequiredUUID,
      Value: RequiredString,
      IsNumber: OptionalBoolean,
      CreatedDate: OptionalJsDate,
    })
  ),
  PendingPostFeature: z.array(
    z.object({
      Id: RequiredUUID,
      PendingPostId: RequiredUUID,
      Title: RequiredString,
      Description: RequiredString,
      CreatedDate: OptionalJsDate,
    })
  ),
  PendingPostImage: z.array(
    z.object({
      Id: RequiredUUID,
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      PendingPostId: RequiredUUID,
      MimeType: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypePendingPost = z.infer<typeof PendingPostSchema>;
