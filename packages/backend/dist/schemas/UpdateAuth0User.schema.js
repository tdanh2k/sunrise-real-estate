import { z } from "zod";
import { OptionalBoolean, OptionalString, RequiredEmail, } from "../utils/ZodUtils.js";
export const UpdateAuth0UserSchema = z.object({
    email: RequiredEmail,
    //username: OptionalString,
    password: OptionalString,
    phone_number: OptionalString,
    //user_id: RequiredString,
    picture: OptionalString,
    name: OptionalString,
    nickname: OptionalString,
    blocked: OptionalBoolean,
    given_name: OptionalString.nullable(),
    family_name: OptionalString.nullable(),
});
