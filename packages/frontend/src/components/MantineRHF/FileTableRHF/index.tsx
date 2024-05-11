import {
  ActionIcon,
  Fieldset,
  FileButton,
  Group,
  Image,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEye, IconFileUpload, IconTrash } from "@tabler/icons-react";
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

type FileTableRHFProps<
  T extends FieldValues,
  //N extends ArrayPath<T>,
> = {
  name: ArrayPath<T>;
  control?: Control<T>;
  disableEditing?: boolean;
  saveMapping?: ({
    file,
    base64File,
  }: {
    file: File;
    base64File?: string;
  }) => FieldArray<T, ArrayPath<T>>;
  legendLabel?: string;
  //methods: UseFieldArrayReturn<T, N>;
  columns: MRT_ColumnDef<FieldArrayWithId<T, ArrayPath<T>>>[];
  tableProps?: Omit<
    MRT_TableOptions<FieldArrayWithId<T, ArrayPath<T>>>,
    "columns" | "data"
  >;
  externalLoading?: boolean;
  //data: FieldArrayWithId<T, N>[];
  onDelete?: (row: MRT_Row<FieldArrayWithId<T, ArrayPath<T>>>) => void;
};

type BaseFileType = {
  Size: number;
  CreatedDate?: Date;
  Name?: string;
  Path?: string;
  MimeType?: string;
  Base64Data?: string;
};

export const FileTableRHF = <
  T extends FieldValues,
  //N extends ArrayPath<T>,
>({
  name,
  control,
  legendLabel,
  disableEditing,
  //methods,
  columns,
  tableProps,
  //data,
  externalLoading,
  saveMapping,
  onDelete,
}: FileTableRHFProps<T>) => {
  //const { fields, insert, append, update, remove } = methods;
  if (name == null || control == null)
    throw new Error("'name' and 'control' required");
  const { fields, append, remove } = useFieldArray({
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
      columnVisibility: {},
    },
    // renderEditRowModalContent: ({ internalEditComponents }) => {
    //   return <>{internalEditComponents}</>;
    // },
    renderTopToolbarCustomActions: () =>
      !disableEditing && (
        <FileButton
          onChange={(file) => {
            if (file == null) return;

            const reader = new FileReader();
            reader.readAsDataURL(file as Blob);
            reader.onload = () => {
              if (saveMapping)
                append(
                  saveMapping({ file, base64File: reader.result as string })
                );
            };
            reader.onerror = (error) => {
              console.log("Error: ", error);
            };
          }}
        >
          {({ onClick }) => (
            <Tooltip label="Upload file">
              <ActionIcon onClick={onClick}>
                <IconFileUpload />
              </ActionIcon>
            </Tooltip>
          )}
        </FileButton>
      ),
    renderRowActions: ({ row }) => (
      <Group>
        <Tooltip label="Xem file">
          <ActionIcon
            color="green"
            onClick={() => {
              modals.open({
                title:
                  (row?.original as unknown as BaseFileType)?.Name ??
                  "Xem file",
                size: "xl",
                children: (
                  <>
                    <Image
                      src={
                        (row?.original as unknown as BaseFileType)?.Path ??
                        (row?.original as unknown as BaseFileType)?.Base64Data
                      }
                      fit="fill"
                      alt="Image"
                    />
                  </>
                ),
              });
            }}
          >
            <IconEye />
          </ActionIcon>
        </Tooltip>
        {!disableEditing && (
          <Tooltip label="Xóa file">
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
        )}
      </Group>
    ),
  });

  return (
    <Fieldset legend={legendLabel}>
      <MantineReactTable table={table} />
    </Fieldset>
  );
};
