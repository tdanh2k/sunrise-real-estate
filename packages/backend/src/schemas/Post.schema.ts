import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalBoolean,
  OptionalJsDate,
  OptionalString,
  RequiredString,
  RequiredURL,
  RequiredUUID,
} from "../utils/ZodUtils";

export const PostSchema = z.object({
  Id: RequiredUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  Address: RequiredString,
  MapUrl: RequiredURL,
  PostCurrentDetail: z.array(
    z.object({
      Id: RequiredUUID,
      PostId: RequiredUUID,
      DetailId: RequiredUUID,
      Value: RequiredString,
      IsNumber: OptionalBoolean,
      CreatedDate: OptionalJsDate,
    })
  ),
  PostFeature: z.array(
    z.object({
      Id: RequiredUUID,
      PostId: RequiredUUID,
      Title: RequiredString,
      Description: RequiredString,
      CreatedDate: OptionalJsDate,
    })
  ),
  PostImage: z.array(z.object({
    Id: RequiredUUID,
    Name: RequiredString,
    Size: NonNegativeIntegerNumber,
    Path: RequiredString,
    PostId: RequiredUUID,
    MimeType: OptionalString,
    CreatedDate: OptionalJsDate,
  }))
});

export type TypePost = z.infer<typeof PostSchema>;