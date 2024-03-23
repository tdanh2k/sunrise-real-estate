import { useState } from "react";
import {
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
  MRT_TableOptions,
  MRT_ColumnFiltersState,
  MRT_ColumnFilterFnsState,
  MRT_RowSelectionState,
} from "mantine-react-table";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";
import { AppRouter } from "sunrise-real-estate-backend/src/routers";
import { TypePagination } from "sunrise-real-estate-backend/src/schemas/Pagination.schema";
import { TypeAPIResponse } from "sunrise-real-estate-backend/src/schemas/APIResponse.schema";
import { TRPCClientErrorLike } from "@trpc/client";
import {
  CustomToolbarButtonsPropsType,
  RenderCustomToolbarButtons,
} from "./RenderCustomToolbarButton";
import { Group } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { MRT_Localization_VI } from "mantine-react-table/locales/vi/index.esm.mjs";

export type MantineRTProps<T extends MRT_RowData> = {
  columns: MRT_ColumnDef<T>[];
  useQuery: (
    input: TypePagination
  ) => UseTRPCQueryResult<TypeAPIResponse<T>, TRPCClientErrorLike<AppRouter>>;

  //useQueryOptions: (props: TypePagination) => UseTRPCQueryResult<T, Error>;
  //extraQueryParams?: Record<string, unknown>;
  //querySkip?: boolean;
  tableProps?: Omit<MRT_TableOptions<T>, "columns" | "data">;
  externalLoading?: boolean;
  topToolbarActionObjectList?: CustomToolbarButtonsPropsType[];
  onRowSelectionChange?: (rowSelection: MRT_RowSelectionState) => void;
};

export const useMantineRTInstance = <T extends MRT_RowData>({
  columns,
  useQuery,
  tableProps,
  externalLoading = false,
  topToolbarActionObjectList = [],
  onRowSelectionChange,
}: MantineRTProps<T>) => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [columnFilterFns, setColumnFilterFns] =
    useState<MRT_ColumnFilterFnsState>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  //const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const {
    data: response,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    paging: {
      page_size: pagination.pageSize,
      page_index: pagination.pageIndex + 1,
    },
    filters: [
      // ...(!checkEmpty(globalFilter)
      //   ? columns
      //       ?.filter((column) => column.enableGlobalFilter !== false)
      //       ?.map((column) => ({
      //         column_name: column.id as string,
      //         operator_type: "or",
      //         value: globalFilter,
      //       })) ?? []
      //   : []),
      ...(columnFilters
        ? columnFilters?.map((column) => ({
            column_name: column.id as string,
            //operator_type: columnFilterFns?.[column?.id],
            value: Array.isArray(column.value)
              ? column?.value?.[0]
              : column?.value,
          })) ?? []
        : []),
    ],
  });

  return useMantineReactTable({
    ...tableProps,
    columns,
    data: response?.data ?? [],
    getRowId: (row) => row?.id as string,
    positionGlobalFilter: "right",
    enableColumnFilterModes: true,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: false,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onColumnFilterFnsChange: setColumnFilterFns,
    //onSortingChange:setSorting,
    rowCount: response?.paging?.row_count ?? 0,
    onRowSelectionChange: (updater) => {
      setRowSelection((prev) => {
        onRowSelectionChange?.(
          updater instanceof Function ? updater(prev) : updater
        );
        return updater instanceof Function ? updater(prev) : updater;
      });
    },
    localization: MRT_Localization_VI,
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: `${
            error?.data?.code ?? error?.data?.httpStatus
          } - ${error?.message}`,
        }
      : undefined,
    state: {
      globalFilter,
      columnFilters,
      columnFilterFns,
      pagination,
      //sorting,
      rowSelection,
      isLoading: isFetching || externalLoading,
      showSkeletons: isLoading || externalLoading,
      showAlertBanner: isError || externalLoading,
      showProgressBars: isFetching || externalLoading,
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Group>
        <RenderCustomToolbarButtons
          actionList={[
            {
              label: "Làm mới",
              variant: "subtle",
              color: "success",
              leftSection: <IconRefresh />,
              loading: isFetching || isLoading || externalLoading,
              onClick: () => {
                table?.resetRowSelection();
                refetch();
              },
            },
            ...(topToolbarActionObjectList ?? []),
          ]}
        />
      </Group>
    ),
  });
};
