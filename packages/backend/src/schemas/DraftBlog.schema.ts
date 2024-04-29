import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalJsDate,
  OptionalString,
  OptionalUUID,
  RequiredString,
  RequiredUUID,
} from "../utils/ZodUtils";
import { GlobalBlogTypeSchema } from "./GlobalBlogType.schema";

export const DraftBlogSchema = z.object({
  Id: RequiredUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  GlobalBlogType: GlobalBlogTypeSchema.optional(),
  DraftBlogImage: z.array(
    z.object({
      Id: OptionalUUID,
      Code: OptionalString,
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      BlogId: OptionalUUID,
      MimeType: OptionalString,
      Base64Data: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypeDraftBlog = z.infer<typeof DraftBlogSchema>;
