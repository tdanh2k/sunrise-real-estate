import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalJsDate,
  OptionalString,
  RequiredString,
  RequiredUUID,
} from "../utils/ZodUtils";
import { GlobalBlogTypeSchema } from "./GlobalBlogType.schema";

export const BlogSchema = z.object({
  Id: RequiredUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  GlobalBlogType: GlobalBlogTypeSchema.optional(),
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
