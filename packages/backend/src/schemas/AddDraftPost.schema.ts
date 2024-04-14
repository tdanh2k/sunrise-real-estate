import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalBoolean,
  OptionalDate,
  OptionalString,
  OptionalUUID,
  RequiredString,
  RequiredURL,
  RequiredUUID,
} from "../utils/ZodUtils";

export const AddDraftPostSchema = z.object({
  Id: OptionalUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalDate,
  TypeId: RequiredUUID,
  Address: RequiredString,
  MapUrl: RequiredURL,
  DraftCurrentDetail: z.array(
    z.object({
      Id: OptionalUUID,
      DetailId: RequiredUUID,
      Value: RequiredString,
      IsNumber: OptionalBoolean,
      CreatedDate: OptionalDate,
    })
  ),
  DraftFeature: z.array(
    z.object({
      Id: OptionalUUID,
      Title: RequiredString,
      Description: RequiredString,
      CreatedDate: OptionalDate,
    })
  ),
  DraftPostImage: z.array(
    z.object({
      Id: OptionalUUID,
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      MimeType: OptionalString,
      CreatedDate: OptionalDate,
    })
  ),
});

export type TypeAddDraftPost = z.infer<typeof AddDraftPostSchema>;
