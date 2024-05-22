import z from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalJsDate,
  OptionalString,
  OptionalUUID,
  RequiredString,
  RequiredUUID,
} from "../utils/ZodUtils.js";

export const AddBlogSchema = z.object({
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
  TypeId: RequiredUUID,
  BlogImage: z.array(
    z.object({
      Id: OptionalUUID,
      Code: OptionalString,
      Name: OptionalString,
      Size: NonNegativeIntegerNumber,
      Path: OptionalString,
      //BlogId: OptionalString,
      MimeType: OptionalString,
      Base64Data: OptionalString,
      CreatedDate: OptionalJsDate,
    })
  ),
});

export type TypeAddBlog = z.infer<typeof AddBlogSchema>;
