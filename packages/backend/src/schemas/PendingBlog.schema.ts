import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalJsDate,
  OptionalString,
  OptionalUUID,
  RequiredString,
  RequiredUUID,
} from "../utils/ZodUtils.js";
import { GlobalBlogTypeSchema } from "./GlobalBlogType.schema.js";

export const PendingBlogSchema = z.object({
  Id: RequiredUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  GlobalBlogType: GlobalBlogTypeSchema.optional(),
  PendingBlogImage: z.array(
    z.object({
      Id: RequiredUUID,
      Code: OptionalString,
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      BlogId: OptionalUUID,
      MimeType: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypePendingBlog = z.infer<typeof PendingBlogSchema>;
