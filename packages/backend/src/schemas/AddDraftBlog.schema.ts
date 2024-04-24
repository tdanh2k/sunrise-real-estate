import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalJsDate,
  OptionalString,
  OptionalUUID,
} from "../utils/ZodUtils";
import { GlobalBlogTypeSchema } from "./GlobalBlogType.schema";

export const AddDraftBlogSchema = z.object({
  Id: OptionalUUID,
  Code: OptionalString,
  Title: OptionalString,
  Description: OptionalString,
  CreatedDate: OptionalJsDate,
  TypeId: OptionalUUID,
  GlobalBlogType: GlobalBlogTypeSchema.optional(),
  DraftBlogImage: z.array(
    z.object({
      Id: OptionalUUID,
      Name: OptionalString,
      Size: NonNegativeIntegerNumber,
      Path: OptionalString,
      BlogId: OptionalUUID,
      MimeType: OptionalString,
      Base64Data: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypeAddDraftBlog = z.infer<typeof AddDraftBlogSchema>;
