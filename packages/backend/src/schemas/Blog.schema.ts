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

export const BlogSchema = z.object({
  Id: RequiredUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  Address: RequiredString,
  BlogImage: z.array(
    z.object({
      Id: RequiredUUID,
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      BlogId: RequiredUUID,
      MimeType: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypeBlog = z.infer<typeof BlogSchema>;
