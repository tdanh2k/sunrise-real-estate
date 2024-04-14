import { z } from "zod";
import {
  NonNegativeIntegerNumber,
  OptionalBoolean,
  OptionalDate,
  OptionalString,
  RequiredString,
} from "../utils/ZodUtils";

export const Auth0UserSchema = z.object({
  email: RequiredString,
  email_verified: OptionalBoolean,
  username: OptionalString,
  phone_number: OptionalString,
  phone_verified: OptionalBoolean,
  user_id: RequiredString,
  created_at: OptionalDate,
  updated_at: OptionalDate,
  // identities: z.array(
  //   z.object({
  //     connection: OptionalString,
  //     user_id: RequiredString,
  //     provider: OptionalString,
  //     isSocial: OptionalBoolean,
  //   })
  // ),
  // "app_metadata": {},
  // "user_metadata": {},
  picture: OptionalString,
  name: OptionalString,
  // "nickname": "",
  // "multifactor": [
  //   ""
  // ],
  // "last_ip": "",
  // "last_login": "",
  logins_count: NonNegativeIntegerNumber,
  blocked: OptionalBoolean,
  given_name: OptionalString,
  family_name: OptionalString,
});

export type TypeAuth0User = z.infer<typeof Auth0UserSchema>;
