"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalURL = exports.RequiredURL = exports.OptionalPort = exports.RequiredPort = exports.OptionalIp = exports.RequiredIp = exports.OptionalJsDate = exports.OptionalDate = exports.RequiredDate = exports.OptionalArray = exports.RequiredArray = exports.OptionalBoolean = exports.RequiredBoolean = exports.NonNegativeBigInt = exports.NonNegativeIntegerNumber = exports.NonNegativeNumber = exports.PositiveIntegerNumber = exports.PositiveNumber = exports.OptionalNumber = exports.RequiredNumber = exports.OptionalEmail = exports.RequiredEmail = exports.OptionalUUID = exports.RequiredUUID = exports.OptionalBase64 = exports.RequiredBase64 = exports.OptionalString = exports.RequiredString = void 0;
const zod_1 = require("zod");
// import { matchIsValidTel } from "mui-tel-input";
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
// dayjs.extend(utc);
// dayjs.extend(timezone);
exports.RequiredString = zod_1.z
    .string({
    invalid_type_error: "Không phải dạng chuỗi",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
})
    .min(1, "Vui lòng không bỏ trống dữ liệu này")
    .regex(/(?!^\s+$)/, "Chuỗi chỉ chứa khoảng trằng");
//.regex(/(.|\s)*\S(.|\s)*/, "Chuỗi chỉ chứa khoảng trằng");
exports.OptionalString = zod_1.z
    .string({
    invalid_type_error: "Không phải dạng chuỗi",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
})
    .regex(/(?!^\s+$)/, "Chuỗi chỉ chứa khoảng trằng")
    .optional();
exports.RequiredBase64 = exports.RequiredString.base64("Không phải chuỗi Base64");
exports.OptionalBase64 = exports.RequiredString.base64("Không phải chuỗi Base64").optional();
exports.RequiredUUID = exports.RequiredString.uuid("Mã UUID không hợp lệ");
exports.OptionalUUID = exports.RequiredUUID.optional().or(zod_1.z.literal(""));
exports.RequiredEmail = exports.RequiredString.email("Định dạng email không hợp lệ");
exports.OptionalEmail = exports.RequiredEmail.optional();
// export const RequiredPhone = RequiredString.refine(
//   (value) => matchIsValidTel(value),
//   "Số điện thoại không hợp lệ"
// );
// export const OptionalPhone = OptionalString.refine(
//   (value) => matchIsValidTel(value ?? ""),
//   "Số điện thoại không hợp lệ"
// );
exports.RequiredNumber = zod_1.z.number({
    invalid_type_error: "Dữ liệu này không phải dạng số",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
});
exports.OptionalNumber = exports.RequiredNumber.optional();
exports.PositiveNumber = zod_1.z
    .number({
    invalid_type_error: "Dữ liệu này không phải dạng số",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
})
    .positive("Số này phải > 0");
exports.PositiveIntegerNumber = zod_1.z
    .number({
    invalid_type_error: "Dữ liệu này không phải dạng số",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
})
    .int("Số này phải là số nguyên")
    .positive("Số này phải > 0");
exports.NonNegativeNumber = zod_1.z
    .number({
    invalid_type_error: "Dữ liệu này không phải dạng số",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
})
    .nonnegative("Số phải >= 0");
exports.NonNegativeIntegerNumber = zod_1.z
    .number({
    invalid_type_error: "Dữ liệu này không phải dạng số",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
})
    .int("Số này phải là số nguyên")
    .nonnegative("Số này phải >= 0");
exports.NonNegativeBigInt = zod_1.z.bigint({
    invalid_type_error: "Dữ liệu này không phải dạng số",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
});
exports.RequiredBoolean = zod_1.z.boolean({
    invalid_type_error: "Không phải dạng true | false",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
});
exports.OptionalBoolean = exports.RequiredBoolean.optional();
const RequiredArray = (elementType) => zod_1.z.array(elementType).min(1, "Vui lòng không bỏ trống dữ liệu này");
exports.RequiredArray = RequiredArray;
const OptionalArray = (elementType) => zod_1.z.array(elementType).optional();
exports.OptionalArray = OptionalArray;
exports.RequiredDate = exports.RequiredString.datetime({
    message: "Không phải dạng ngày",
    offset: true,
});
exports.OptionalDate = exports.RequiredDate.optional();
exports.OptionalJsDate = zod_1.z
    .date({
    invalid_type_error: "Không phải dạng ngày",
})
    .optional();
// export const RequiredMinDate = (minDate: Date | string, message?: string) =>
//   RequiredDate.refine((val) => new Date(val) > new Date(minDate), {
//     message: message ?? `Ngày phải sau ${dayjs(minDate).format("dd/MM/yyyy")}`,
//   });
// export const OptionalMinDate = (minDate: Date | string, message?: string) =>
//   RequiredDate.refine((val) => new Date(val) > new Date(minDate), {
//     message: message ?? `Ngày phải sau ${dayjs(minDate).format("dd/MM/yyyy")}`,
//   }).optional();
// export const RequiredMaxDate = (maxDate: Date | string, message?: string) =>
//   RequiredDate.refine((val) => new Date(val) < new Date(maxDate), {
//     message:
//       message ?? `Ngày phải trước ${dayjs(maxDate).format("dd/MM/yyyy")}`,
//   });
// export const OptionalMaxDate = (maxDate: Date | string, message?: string) =>
//   RequiredDate.refine((val) => new Date(val) < new Date(maxDate), {
//     message:
//       message ?? `Ngày phải trước ${dayjs(maxDate).format("dd/MM/yyyy")}`,
//   }).optional();
exports.RequiredIp = exports.RequiredString.ip({
    message: "Địa chỉ IP không hợp lệ",
});
exports.OptionalIp = exports.RequiredIp.optional();
exports.RequiredPort = exports.RequiredIp.max(65535, {
    message: "Cổng không hợp lệ",
});
exports.OptionalPort = exports.RequiredPort.optional();
exports.RequiredURL = exports.RequiredString.url({
    message: "Không phải URL hợp lệ",
});
exports.OptionalURL = exports.RequiredURL.optional();
