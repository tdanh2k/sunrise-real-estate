import { ComboboxItem } from "@mantine/core";
import { TRPCClientErrorLike } from "@trpc/client";
import {
  UseTRPCQueryOptions,
  UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import { useMemo } from "react";
import { FieldValues } from "react-hook-form";
import { AppRouter } from "sunrise-real-estate-backend/src/routers";
import { TypeAPIResponse } from "sunrise-real-estate-backend/src/schemas/APIResponse.schema";
import { SelectRHF, SelectRHFProps } from ".";

// type UseQuery<T, InputType> = (
//   input: InputType,
//   opts?: UseTRPCQueryOptions<TypeAPIResponse<T[]>, InputType, Error>
// ) => UseTRPCQueryResult<TypeAPIResponse<T[]>, TRPCClientErrorLike<AppRouter>>;

// type UseQueryWithoutInput<T> = (
//   opts?: UseTRPCQueryOptions<TypeAPIResponse<T[]>, void, Error>
// ) => UseTRPCQueryResult<TypeAPIResponse<T[]>, TRPCClientErrorLike<AppRouter>>;

type QuerySelectRHFProps<
  InputType,
  T extends FieldValues,
> = SelectRHFProps<T> & {
  useQuery: (
    input?: InputType,
    opts?: UseTRPCQueryOptions<TypeAPIResponse<T[]>, InputType, Error>
  ) => UseTRPCQueryResult<TypeAPIResponse<T[]>, TRPCClientErrorLike<AppRouter>>;
  queryInput?: InputType;
  queryOptions?: UseTRPCQueryOptions<TypeAPIResponse<T[]>, InputType, Error>;
  mapOption: (item: T) => ComboboxItem;
};

export const QuerySelectRHF = <
  T extends FieldValues,
  InputType extends Record<string, unknown> | void,
>({
  name,
  useQuery,
  queryInput,
  queryOptions,
  mapOption,
  control,
  disabled,
  ...SelectProps
}: QuerySelectRHFProps<InputType, T>) => {
  if (name == null || name == undefined) throw new Error("'name' required");

  const {
    data: response,
    isFetching,
    error: queryError,
  } = useQuery(queryInput, {
    ...queryOptions,
    enabled: queryOptions?.enabled && !disabled,
  });

  const options = useMemo(
    () => response?.data?.map(mapOption),
    [response, mapOption]
  );

  return (
    <SelectRHF
      {...SelectProps}
      name={name}
      options={options}
      control={control}
      error={queryError?.message}
      disabled={disabled || isFetching}
    />
  );
};
