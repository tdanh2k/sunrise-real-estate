import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalBoolean,
  OptionalJsDate,
  OptionalNumber,
  OptionalString,
  RequiredString,
  RequiredURL,
  RequiredUUID,
} from "../utils/ZodUtils";

export const AddPendingPostSchema = z.object({
  //Id: RequiredUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  Address: RequiredString,
  Price: OptionalNumber,
  ApprovedBy: OptionalString,
  ApprovedDate: OptionalJsDate,
  MapUrl: RequiredURL,
  PendingCurrentDetail: z.array(
    z.object({
      Id: RequiredUUID,
      PendingId: RequiredUUID,
      DetailId: RequiredUUID,
      Value: RequiredString,
      IsNumber: OptionalBoolean,
      CreatedDate: OptionalJsDate,
    })
  ),
  PendingFeature: z.array(
    z.object({
      Id: RequiredUUID,
      PendingId: RequiredUUID,
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
      PostId: RequiredUUID,
      MimeType: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypeAddPendingPost = z.infer<typeof AddPendingPostSchema>;
