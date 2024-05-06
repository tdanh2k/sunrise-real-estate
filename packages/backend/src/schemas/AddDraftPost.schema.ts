import z from "zod";
import {
  NonNegativeIntegerNumber,
  NonNegativeNumber,
  OptionalBoolean,
  OptionalJsDate,
  OptionalString,
  OptionalUUID,
  RequiredString,
  RequiredUUID,
} from "../utils/ZodUtils.js";

export const AddDraftPostSchema = z.object({
  Id: OptionalUUID,
  Code: OptionalString,
  Title: OptionalString,
  Description: OptionalString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  Address: OptionalString,
  Price: NonNegativeNumber,
  MapUrl: OptionalString,
  Area: NonNegativeNumber.optional(),
  DraftPostCurrentDetail: z.array(
    z.object({
      Id: OptionalUUID,
      DetailId: RequiredUUID,
      Value: RequiredString,
      IsNumber: OptionalBoolean,
      CreatedDate: OptionalJsDate,
    })
  ),
  DraftPostFeature: z.array(
    z.object({
      Id: OptionalUUID,
      Title: RequiredString,
      Description: RequiredString,
      CreatedDate: OptionalJsDate,
    })
  ),
  DraftPostImage: z.array(
    z.object({
      Id: OptionalUUID,
      Code: OptionalString,
      Name: OptionalString,
      Size: NonNegativeIntegerNumber,
      Path: OptionalString,
      Base64Data: OptionalString,
      MimeType: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypeAddDraftPost = z.infer<typeof AddDraftPostSchema>;
