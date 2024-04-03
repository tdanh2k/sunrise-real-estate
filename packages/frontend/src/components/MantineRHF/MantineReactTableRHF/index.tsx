import { ActionIcon, Button, Fieldset, Group, Tooltip } from "@mantine/core";
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
  useFieldArray,
} from "react-hook-form";

type MantineReactTableRHFProps<
  T extends FieldValues
  //N extends ArrayPath<T>,
> = {
  name: ArrayPath<T>;
  control?: Control<T>;
  legendLabel?: string;
  //methods: UseFieldArrayReturn<T, N>;
  columns: MRT_ColumnDef<FieldArrayWithId<T, ArrayPath<T>>>[];
  tableProps?: Omit<
    MRT_TableOptions<FieldArrayWithId<T, ArrayPath<T>>>,
    "columns" | "data"
  >;
  externalLoading?: boolean;
  //data: FieldArrayWithId<T, N>[];
  onCreate?: MRT_TableOptions<
    FieldArrayWithId<T, ArrayPath<T>>
  >["onCreatingRowSave"];
  onEdit?: MRT_TableOptions<
    FieldArrayWithId<T, ArrayPath<T>>
  >["onEditingRowSave"];
  onDelete?: (row: MRT_Row<FieldArrayWithId<T, ArrayPath<T>>>) => void;
};

export const MantineReactTableRHF = <
  T extends FieldValues
  //N extends ArrayPath<T>,
>({
  name,
  control,
  legendLabel,
  //methods,
  columns,
  tableProps,
  //data,
  externalLoading,
  onCreate,
  onEdit,
  onDelete,
}: MantineReactTableRHFProps<T>) => {
  //const { fields, insert, append, update, remove } = methods;
  if (name == null || control == null)
    throw new Error("'name' and 'control' required");
  const { fields, insert, append, update, remove } = useFieldArray({
    name,
    control,
  });

  const table = useMantineReactTable({
    ...tableProps,
    columns,
    data: fields ?? [],
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "row", // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enableSorting: false,
    getRowId: (row) => row?.id as string,
    positionGlobalFilter: "right",
    //onSortingChange:setSorting,
    localization: MRT_Localization_VI,
    state: {
      isLoading: externalLoading,
      showSkeletons: externalLoading,
      showAlertBanner: externalLoading,
      showProgressBars: externalLoading,
    },
    // renderEditRowModalContent: ({ internalEditComponents }) => {
    //   return <>{internalEditComponents}</>;
    // },
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        size="small"
        variant="subtle"
        onClick={() => {
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
          <ActionIcon
            color="red"
            onClick={() => {
              if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

              remove(fields.findIndex((r) => r.id === row.original.id));
              onDelete?.(row);
            }}
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Group>
    ),
    onCreatingRowSave: ({ table, exitCreatingMode, values, ...rest }) => {
      onCreate?.({ table, exitCreatingMode, values, ...rest });
      append(values as FieldArray<T, ArrayPath<T>>);
      exitCreatingMode();
    },
    onEditingRowSave: ({ table, exitEditingMode, values, row, ...rest }) => {
      update(
        fields.findIndex((r) => r.id === row.original.id),
        values as FieldArray<T, ArrayPath<T>>
      );
      onEdit?.({ table, exitEditingMode, values, row, ...rest });
      exitEditingMode();
    },
  });

  return (
    <Fieldset legend={legendLabel}>
      <MantineReactTable table={table} />
    </Fieldset>
  );
};
