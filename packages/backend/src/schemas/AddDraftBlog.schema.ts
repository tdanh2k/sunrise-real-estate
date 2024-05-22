import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalJsDate,
  OptionalString,
  OptionalUUID,
} from "../utils/ZodUtils.js";
import { GlobalBlogTypeSchema } from "./GlobalBlogType.schema.js";

export const AddDraftBlogSchema = z.object({
  Id: OptionalUUID,
  Title: OptionalString,
  Description: OptionalString,
  CreatedDate: OptionalJsDate,
  TypeId: OptionalUUID,
  GlobalBlogType: GlobalBlogTypeSchema.optional(),
  DraftBlogImage: z.array(
    z.object({
      Id: OptionalUUID,
      Code: OptionalString,
      Name: OptionalString,
      Size: NonNegativeIntegerNumber,
      Path: OptionalString,
      //BlogId: OptionalUUID,
      MimeType: OptionalString,
      Base64Data: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypeAddDraftBlog = z.infer<typeof AddDraftBlogSchema>;
