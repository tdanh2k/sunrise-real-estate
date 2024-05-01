import z from "zod";
import {
  NonNegativeIntegerNumber,
  NonNegativeNumber,
  OptionalBoolean,
  OptionalJsDate,
  OptionalString,
  OptionalUUID,
  RequiredString,
  RequiredURL,
  RequiredUUID,
} from "../utils/ZodUtils";

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
  DraftPostCurrentDetail: z.array(
    z.object({
      Id: OptionalUUID,
      DetailId: RequiredUUID,
      Value: OptionalString,
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
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      Base64Data: OptionalString,
      MimeType: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypeAddDraftPost = z.infer<typeof AddDraftPostSchema>;
