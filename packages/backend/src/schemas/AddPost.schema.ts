import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalBoolean,
  OptionalJsDate,
  OptionalNumber,
  OptionalString,
  OptionalUUID,
  RequiredString,
  RequiredURL,
  RequiredUUID,
} from "../utils/ZodUtils";

export const AddPostSchema = z.object({
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  Address: RequiredString,
  Price: OptionalNumber,
  MapUrl: RequiredURL,
  PostCurrentDetail: z.array(
    z.object({
      Id: OptionalUUID,
      DetailId: RequiredUUID,
      Value: RequiredString,
      IsNumber: OptionalBoolean,
      CreatedDate: OptionalJsDate,
    })
  ).optional(),
  PostFeature: z.array(
    z.object({
      Id: OptionalUUID,
      Title: RequiredString,
      Description: RequiredString,
      CreatedDate: OptionalJsDate,
    })
  ).optional(),
  PostImage: z.array(
    z.object({
      Id: OptionalUUID,
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      MimeType: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ).optional(),
});

export type TypeAddPost = z.infer<typeof AddPostSchema>;
