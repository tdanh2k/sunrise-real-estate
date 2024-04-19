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

export const DraftPostSchema = z.object({
  Id: RequiredUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  Address: RequiredString,
  Price: OptionalNumber,
  MapUrl: RequiredURL,
  GlobalPostType: z
    .object({
      Id: RequiredUUID,
      Idx: NonNegativeIntegerNumber,
      Name: RequiredString,
      CreatedDate: OptionalJsDate,
    })
    .optional(),
  DraftPostCurrentDetail: z.array(
    z.object({
      Id: RequiredUUID,
      DraftId: RequiredUUID,
      DetailId: RequiredUUID,
      Value: RequiredString,
      IsNumber: OptionalBoolean,
      CreatedDate: OptionalJsDate,
    })
  ),
  DraftPostFeature: z.array(
    z.object({
      Id: RequiredUUID,
      DraftId: RequiredUUID,
      Title: RequiredString,
      Description: RequiredString,
      CreatedDate: OptionalJsDate,
    })
  ),
  DraftPostImage: z.array(
    z.object({
      Id: RequiredUUID,
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      DraftId: RequiredUUID,
      MimeType: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypeDraftPost = z.infer<typeof DraftPostSchema>;
