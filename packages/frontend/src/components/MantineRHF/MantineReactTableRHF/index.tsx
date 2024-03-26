import { PickByType } from "@custom_types/PickByType";
import { ActionIcon, Button, Group, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableOptions,
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import { MRT_Localization_VI } from "mantine-react-table/locales/vi/index.esm.mjs";
import {
  ArrayPath,
  Control,
  FieldArray,
  FieldArrayWithId,
  FieldValues,
  Path,
  useFieldArray,
} from "react-hook-form";

type MantineReactTableRHFProps<
  T extends FieldValues,
  N extends ArrayPath<T>,
> = {
  //name: ArrayPath<T>;
  //control?: Control<T>;
  columns: MRT_ColumnDef<FieldArrayWithId<T, N>>[];
  data: FieldArrayWithId<T, N>[];
  onCreate?: MRT_TableOptions<FieldArrayWithId<T, N>>["onCreatingRowSave"];
  onEdit?: MRT_TableOptions<FieldArrayWithId<T, N>>["onEditingRowSave"];
  onDelete?: (row: MRT_Row<FieldArrayWithId<T, N>>) => void;
};

export const MantineReactTableRHF = <
  T extends FieldValues,
  N extends ArrayPath<T>,
>({
  //name,
  //control,
  columns,
  data,
  onCreate,
  onEdit,
  onDelete,
}: MantineReactTableRHFProps<T, N>) => {
  if (name == null) throw new Error("'name' required");
  //   const { fields, append, remove, } = useFieldArray({
  //     name,
  //     control,
  //   });

  const table = useMantineReactTable({
    columns,
    data: data ?? [],
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "row", // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    getRowId: (row) => row?.id as string,
    positionGlobalFilter: "right",
    //onSortingChange:setSorting,
    localization: MRT_Localization_VI,
    // state: {
    //   isLoading: isFetching || externalLoading,
    //   showSkeletons: isLoading || externalLoading,
    //   showAlertBanner: isError || externalLoading,
    //   showProgressBars: isFetching || externalLoading,
    // },
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        size="small"
        variant="subtle"
        onClick={(event) => {
          table.setCreatingRow(true);
        }}
      >
        Add
      </Button>
    ),
    renderRowActions: ({ row, table }) => (
      <Group>
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => onDelete?.(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Group>
    ),
    onCreatingRowSave: ({ table, exitCreatingMode, ...rest }) => {
      onCreate?.({ table, exitCreatingMode, ...rest });
      exitCreatingMode();
    },
    onEditingRowSave: ({ table, exitEditingMode, ...rest }) => {
      onEdit?.({ table, exitEditingMode, ...rest });
      exitEditingMode();
    },
  });

  return <MantineReactTable table={table} />;
};
