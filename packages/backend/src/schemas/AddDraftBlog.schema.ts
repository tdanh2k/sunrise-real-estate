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

export const AddDraftBlogSchema = z.object({
  Id: OptionalUUID,
  Code: RequiredString,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  GlobalBlogType: GlobalBlogTypeSchema.optional(),
  DraftBlogImage: z.array(
    z.object({
      Id: OptionalUUID,
      Name: RequiredString,
      Size: NonNegativeIntegerNumber,
      Path: RequiredString,
      BlogId: RequiredUUID,
      MimeType: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypeAddDraftBlog = z.infer<typeof AddDraftBlogSchema>;
