import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalBoolean,
  OptionalDate,
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
  CreatedDate: OptionalDate,
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
      CreatedDate: OptionalDate,
    })
  ).optional(),
  PostFeature: z.array(
    z.object({
      Id: OptionalUUID,
      Title: RequiredString,
      Description: RequiredString,
      CreatedDate: OptionalDate,
    })
  ).optional(),
  PostImage: z.array(
    z.object({
      Id: OptionalUUID,
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      MimeType: OptionalString,
      CreatedDate: OptionalDate,
    })
  ).optional(),
});

export type TypeAddPost = z.infer<typeof AddPostSchema>;
