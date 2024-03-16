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

export const PostSchema = z.object({
  Id: RequiredUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalDate,
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
      CreatedDate: OptionalDate,
    })
  ),
  PostFeature: z.array(
    z.object({
      Id: RequiredUUID,
      PostId: RequiredUUID,
      Title: RequiredString,
      Description: RequiredString,
      CreatedDate: OptionalDate,
    })
  ),
  PostImage: z.array(z.object({
    Id: RequiredUUID,
    Name: RequiredString,
    Size: NonNegativeIntegerNumber,
    Path: RequiredString,
    PostId: RequiredUUID,
    MimeType: OptionalString,
    CreatedDate: OptionalDate,
  }))
});
