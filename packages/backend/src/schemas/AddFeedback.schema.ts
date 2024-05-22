import z from "zod";
import {
  OptionalJsDate,
  RequiredEmail,
  RequiredString,
} from "../utils/ZodUtils.js";

export const AddFeedbackSchema = z.object({
  Name: RequiredString,
  Phone: RequiredString,
  Email: RequiredEmail,
  Title: RequiredString,
  Description: RequiredString,
  CreatedDate: OptionalJsDate,
});

export type TypeAddFeedback = z.infer<typeof AddFeedbackSchema>;
