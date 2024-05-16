import { z } from "zod";
import { NonNegativeIntegerNumber, OptionalBoolean, OptionalString, RequiredString, } from "../utils/ZodUtils.js";
export const RemoteAuth0UserSchema = z.object({
    email: RequiredString,
    email_verified: OptionalBoolean,
    username: OptionalString,
    phone_number: OptionalString,
    phone_verified: OptionalBoolean,
    user_id: RequiredString,
    created_at: OptionalString,
    updated_at: OptionalString,
    picture: OptionalString,
    name: OptionalString,
    nickname: OptionalString,
    last_ip: OptionalString,
    last_login: OptionalString,
    logins_count: NonNegativeIntegerNumber.optional(),
    blocked: OptionalBoolean,
    given_name: OptionalString,
    family_name: OptionalString,
});
