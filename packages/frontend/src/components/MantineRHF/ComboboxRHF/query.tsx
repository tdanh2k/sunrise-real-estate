import { ComboboxData, ComboboxItem, Select, SelectProps } from "@mantine/core";
import { TRPCClientErrorLike } from "@trpc/client";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";
import { FC } from "react";
import { Control, useController } from "react-hook-form";
import { AppRouter } from "sunrise-real-estate-backend/src/routers";
import { TypeAPIResponse } from "sunrise-real-estate-backend/src/schemas/APIResponse.schema";

type QuerySelectRHFProps<T> = Omit<
  SelectProps,
  "ref" | "value" | "data" | "error"
> & {
  control?: Control;
  useQuery: () //input: TypePagination
  => UseTRPCQueryResult<TypeAPIResponse<T[]>, TRPCClientErrorLike<AppRouter>>;
  mapOption: (item: T) => ComboboxItem;
};

export const QuerySelectRHF = <T extends Record<string, unknown>>({
  name,
  useQuery,
  mapOption,
  control,
  disabled,
  onChange,
  onBlur,
  ...SelectProps
}: QuerySelectRHFProps<T>) => {
  if (name == null || name == undefined) throw new Error("'name' required");

  const {
    field: { onChange: onFieldChange, onBlur: onFieldBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitting },
  } = useController({ name, control });

  const {data: response,
    isFetching,
    isError,
    error: queryError,} = useQuery();

  return (
    <Select
      {...SelectProps}
      ref={ref}
      value={value}
      data={options}
      onChange={(value, option) => {
        onChange?.(value, option);
        onFieldChange(value);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        onFieldBlur();
      }}
      error={error?.message}
      disabled={disabled || isSubmitting}
    />
  );
};
