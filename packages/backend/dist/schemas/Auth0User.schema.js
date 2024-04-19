"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth0UserSchema = void 0;
const zod_1 = require("zod");
const ZodUtils_1 = require("../utils/ZodUtils");
exports.Auth0UserSchema = zod_1.z.object({
    email: ZodUtils_1.RequiredString,
    email_verified: ZodUtils_1.OptionalBoolean,
    username: ZodUtils_1.OptionalString,
    phone_number: ZodUtils_1.OptionalString,
    phone_verified: ZodUtils_1.OptionalBoolean,
    user_id: ZodUtils_1.RequiredString,
    created_at: ZodUtils_1.OptionalJsDate,
    updated_at: ZodUtils_1.OptionalJsDate,
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
    picture: ZodUtils_1.OptionalString,
    name: ZodUtils_1.OptionalString,
    // "nickname": "",
    // "multifactor": [
    //   ""
    // ],
    // "last_ip": "",
    // "last_login": "",
    logins_count: ZodUtils_1.NonNegativeIntegerNumber,
    blocked: ZodUtils_1.OptionalBoolean,
    given_name: ZodUtils_1.OptionalString,
    family_name: ZodUtils_1.OptionalString,
});
