import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalBoolean,
  OptionalDate,
  OptionalString,
  RequiredString,
  RequiredURL,
  RequiredUUID,
} from "../utils/ZodUtils";

export const DraftPostSchema = z.object({
  Id: RequiredUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalDate,
  TypeId: RequiredUUID,
  Address: RequiredString,
  MapUrl: RequiredURL,
  DraftCurrentDetail: z.array(
    z.object({
      Id: RequiredUUID,
      DraftId: RequiredUUID,
      DetailId: RequiredUUID,
      Value: RequiredString,
      IsNumber: OptionalBoolean,
      CreatedDate: OptionalDate,
    })
  ),
  DraftFeature: z.array(
    z.object({
      Id: RequiredUUID,
      DraftId: RequiredUUID,
      Title: RequiredString,
      Description: RequiredString,
      CreatedDate: OptionalDate,
    })
  ),
  DraftPostImage: z.array(
    z.object({
      Id: RequiredUUID,
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      PostId: RequiredUUID,
      MimeType: OptionalString,
      CreatedDate: OptionalDate,
    })
  ),
});
