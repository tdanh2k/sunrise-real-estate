import { ComboboxItem } from "@mantine/core";
import { TRPCClientErrorLike } from "@trpc/client";
import {
  UseTRPCQueryOptions,
  UseTRPCQueryResult,
} from "@trpc/react-query/shared";
import { useMemo } from "react";
import { FieldValues } from "react-hook-form";
import { AppRouter } from "@sunrise-backend/src/routers";
import { TypeAPIResponse } from "@sunrise-backend/src/schemas/APIResponse.schema";
import { SelectRHF, SelectRHFProps } from ".";

// type UseQuery<T, InputType> = (
//   input: InputType,
//   opts?: UseTRPCQueryOptions<TypeAPIResponse<T[]>, InputType, Error>
// ) => UseTRPCQueryResult<TypeAPIResponse<T[]>, TRPCClientErrorLike<AppRouter>>;

// type UseQueryWithoutInput<T> = (
//   opts?: UseTRPCQueryOptions<TypeAPIResponse<T[]>, void, Error>
// ) => UseTRPCQueryResult<TypeAPIResponse<T[]>, TRPCClientErrorLike<AppRouter>>;

type QuerySelectRHFProps<
  T extends FieldValues,
  DataRType extends Record<string, unknown>,
> = Omit<SelectRHFProps<T>, "options"> & {
  // useQuery: (
  //   input?: InputType,
  //   opts?: UseTRPCQueryOptions<TypeAPIResponse<T[]>, InputType, Error>
  // ) => UseTRPCQueryResult<TypeAPIResponse<T[]>, TRPCClientErrorLike<AppRouter>>;
  useQuery: // | ((
  //     input?: InputType
  //   ) => UseTRPCQueryResult<
  //     TypeAPIResponse<DataRType[]>,
  //     TRPCClientErrorLike<AppRouter>
  //   >)
  // | ((
  //     input?: InputType,
  //     opts?: UseTRPCQueryOptions<
  //       TypeAPIResponse<DataRType[]>,
  //       InputType,
  //       Error
  //     >
  //   ) => UseTRPCQueryResult<
  //     TypeAPIResponse<DataRType[]>,
  //     TRPCClientErrorLike<AppRouter>
  //   >)
  | (() => UseTRPCQueryResult<
        TypeAPIResponse<DataRType[]>,
        TRPCClientErrorLike<AppRouter>
      >)
    | ((
        input: void,
        opts?: UseTRPCQueryOptions<TypeAPIResponse<DataRType[]>, void, Error>
      ) => UseTRPCQueryResult<
        TypeAPIResponse<DataRType[]>,
        TRPCClientErrorLike<AppRouter>
      >);
  //queryInput?: InputType | void;
  queryOptions?: UseTRPCQueryOptions<TypeAPIResponse<DataRType[]>, void, Error>;
  mapOption: (item: DataRType) => ComboboxItem;
};

export const QuerySelectRHF = <
  T extends FieldValues,
  //InputType extends Record<string, unknown> | void,
  DataRType extends Record<string, unknown>,
>({
  name,
  useQuery,
  //queryInput,
  queryOptions,
  mapOption,
  control,
  disabled,
  ...SelectProps
}: QuerySelectRHFProps<T, DataRType>) => {
  if (name == null || name == undefined) throw new Error("'name' required");

  const {
    data: response,
    isFetching,
    error: queryError,
  } = useQuery(undefined, {
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
      options={options ?? []}
      control={control}
      error={queryError?.message}
      disabled={disabled || isFetching}
    />
  );
};
