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

export const AddPostSchema = z.object({
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalDate,
  TypeId: RequiredUUID,
  Address: RequiredString,
  MapUrl: RequiredURL,
  PostCurrentDetail: z.array(
    z.object({
      DetailId: RequiredUUID,
      Value: RequiredString,
      IsNumber: OptionalBoolean,
      CreatedDate: OptionalDate,
    })
  ),
  PostFeature: z.array(
    z.object({
      Title: RequiredString,
      Description: RequiredString,
      CreatedDate: OptionalDate,
    })
  ),
  PostImage: z.array(z.object({
    Name: RequiredString,
    Size: NonNegativeIntegerNumber,
    Path: RequiredString,
    MimeType: OptionalString,
    CreatedDate: OptionalDate,
  }))
});