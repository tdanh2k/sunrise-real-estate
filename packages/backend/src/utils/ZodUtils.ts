import { z, ZodType } from "zod";
// import { matchIsValidTel } from "mui-tel-input";

// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
// import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin

// dayjs.extend(utc);
// dayjs.extend(timezone);

export const RequiredString = z
  .string({
    invalid_type_error: "Không phải dạng chuỗi",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
  })
  .min(1, "Vui lòng không bỏ trống dữ liệu này")
  .regex(/(?!^\s+$)/, "Chuỗi chỉ chứa khoảng trằng");
//.regex(/(.|\s)*\S(.|\s)*/, "Chuỗi chỉ chứa khoảng trằng");

export const OptionalString = z
  .string({
    invalid_type_error: "Không phải dạng chuỗi",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
  })
  .regex(/(?!^\s+$)/, "Chuỗi chỉ chứa khoảng trằng")
  .optional();

export const RequiredBase64 = RequiredString.base64("Không phải chuỗi Base64");

export const OptionalBase64 = RequiredString.base64(
  "Không phải chuỗi Base64"
).optional();

export const RequiredUUID = RequiredString.uuid("Mã UUID không hợp lệ");

export const OptionalUUID = RequiredUUID.optional().or(z.literal(""));

export const RequiredEmail = RequiredString.email(
  "Định dạng email không hợp lệ"
);

export const OptionalEmail = RequiredEmail.optional();

// export const RequiredPhone = RequiredString.refine(
//   (value) => matchIsValidTel(value),
//   "Số điện thoại không hợp lệ"
// );

// export const OptionalPhone = OptionalString.refine(
//   (value) => matchIsValidTel(value ?? ""),
//   "Số điện thoại không hợp lệ"
// );

export const RequiredNumber = z.number({
  invalid_type_error: "Dữ liệu này không phải dạng số",
  required_error: "Vui lòng không bỏ trống dữ liệu này",
});

export const OptionalNumber = RequiredNumber.optional();

export const PositiveNumber = z
  .number({
    invalid_type_error: "Dữ liệu này không phải dạng số",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
  })
  .positive("Số này phải > 0");

export const PositiveIntegerNumber = z
  .number({
    invalid_type_error: "Dữ liệu này không phải dạng số",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
  })
  .int("Số này phải là số nguyên")
  .positive("Số này phải > 0");

export const NonNegativeNumber = z
  .number({
    invalid_type_error: "Dữ liệu này không phải dạng số",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
  })
  .nonnegative("Số phải >= 0");

export const NonNegativeIntegerNumber = z
  .number({
    invalid_type_error: "Dữ liệu này không phải dạng số",
    required_error: "Vui lòng không bỏ trống dữ liệu này",
  })
  .int("Số này phải là số nguyên")
  .nonnegative("Số này phải >= 0");

export const NonNegativeBigInt = z.bigint({
  invalid_type_error: "Dữ liệu này không phải dạng số",
  required_error: "Vui lòng không bỏ trống dữ liệu này",
});

export const RequiredBoolean = z.boolean({
  invalid_type_error: "Không phải dạng true | false",
  required_error: "Vui lòng không bỏ trống dữ liệu này",
});

export const OptionalBoolean = RequiredBoolean.optional().nullable();

export const RequiredArray = (elementType: ZodType) =>
  z.array(elementType).min(1, "Vui lòng không bỏ trống dữ liệu này");

export const OptionalArray = (elementType: ZodType) =>
  z.array(elementType).optional();

export const RequiredDate = RequiredString.datetime({
  message: "Không phải dạng ngày",
  offset: true,
});

export const OptionalDate = RequiredDate.optional();

export const OptionalJsDate = z
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

export const RequiredIp = RequiredString.ip({
  message: "Địa chỉ IP không hợp lệ",
});

export const OptionalIp = RequiredIp.optional();

export const RequiredPort = RequiredIp.max(65535, {
  message: "Cổng không hợp lệ",
});

export const OptionalPort = RequiredPort.optional();

export const RequiredURL = RequiredString.url({
  message: "Không phải URL hợp lệ",
});

export const OptionalURL = RequiredURL.optional();
