import z from "zod";
import {
  NonNegativeIntegerNumber,
  NonNegativeNumber,
  OptionalBoolean,
  OptionalJsDate,
  OptionalNumber,
  OptionalString,
  OptionalUUID,
  RequiredString,
  RequiredUUID,
} from "../utils/ZodUtils.js";

export const AddPostSchema = z.object({
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  Address: RequiredString,
  Price: OptionalNumber,
  MapUrl: RequiredString,
  Area: NonNegativeNumber,
  PostCurrentDetail: z.array(
    z.object({
      Id: OptionalUUID,
      DetailId: RequiredUUID,
      Value: RequiredString,
      IsNumber: OptionalBoolean,
      CreatedDate: OptionalJsDate,
    })
  ),
  PostFeature: z.array(
    z.object({
      Id: OptionalUUID,
      Title: RequiredString,
      Description: RequiredString,
      CreatedDate: OptionalJsDate,
    })
  ),
  PostImage: z.array(
    z.object({
      Id: OptionalUUID,
      Code: OptionalString,
      Name: OptionalString,
      Size: NonNegativeIntegerNumber,
      Path: OptionalString,
      MimeType: OptionalString,
      Base64Data: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypeAddPost = z.infer<typeof AddPostSchema>;
