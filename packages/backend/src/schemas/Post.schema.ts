import z from "zod";
import {
  NonNegativeIntegerNumber,
  NonNegativeNumber,
  OptionalBoolean,
  OptionalJsDate,
  OptionalNumber,
  OptionalString,
  RequiredString,
  RequiredUUID,
} from "../utils/ZodUtils.js";

export const PostSchema = z.object({
  Id: RequiredUUID,
  Code: RequiredString,
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
  PostImage: z.array(
    z.object({
      Id: RequiredUUID,
      Code: OptionalString,
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      PostId: RequiredUUID,
      MimeType: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypePost = z.infer<typeof PostSchema>;
