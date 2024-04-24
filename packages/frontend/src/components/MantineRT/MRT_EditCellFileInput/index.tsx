import {
  type FocusEvent,
  type KeyboardEvent,
  useState,
  ForwardedRef,
} from "react";
import { type FileInputProps, FileInput } from "@mantine/core";
import {
  MRT_Cell,
  MRT_CellValue,
  MRT_RowData,
  MRT_TableInstance,
} from "mantine-react-table";

const parseFromValuesOrFunc = <T, U>(
  fn: ((arg: U) => T) | T | undefined,
  arg: U
): T | undefined => (fn instanceof Function ? fn(arg) : fn);

type Props<
  TData extends MRT_RowData,
  TValue = MRT_CellValue,
> = FileInputProps & {
  cell: MRT_Cell<TData, TValue>;
  table: MRT_TableInstance<TData>;
  //ref?: ForwardedRef<HTMLButtonElement>;
};

export const MRT_EditCellFileInput = <TData extends MRT_RowData>({
  cell,
  table,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: { createDisplayMode, editDisplayMode },
    //refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { creatingRow, editingRow } = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;
  //const isSelectEdit = columnDef.editVariant === "select";

  const [value, setValue] = useState(() => cell.getValue<any>());
  const [internalValue, setInternalValue] = useState<File | null>(null);

  //const arg = { cell, column, row, table };
  //   const textInputProps = {
  //     ...parseFromValuesOrFunc(mantineEditTextInputProps, arg),
  //     ...parseFromValuesOrFunc(columnDef.mantineEditTextInputProps, arg),
  //     ...rest,
  //   };

  //   const selectProps = {
  //     ...parseFromValuesOrFunc(mantineEditSelectProps, arg),
  //     ...parseFromValuesOrFunc(columnDef.mantineEditSelectProps, arg),
  //     ...rest,
  //   };

  const saveInputValueToRowCache = (newValue: null | string) => {
    //@ts-ignore
    row._valuesCache[column.id] = newValue;
    if (isCreating) {
      setCreatingRow(row);
    } else if (isEditing) {
      setEditingRow(row);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
    rest?.onBlur?.(event);
    saveInputValueToRowCache(value);
    setEditingCell(null);
  };

  //   const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
  //     //textInputProps.onKeyDown?.(event);
  //     if (event.key === "Enter") {
  //       editInputRefs.current[cell.id]?.blur();
  //     }
  //   };

  // if (columnDef.Edit) {
  //   return columnDef.Edit?.({ cell, column, row, table });
  // }

  //   const commonProps = {
  //     disabled: parseFromValuesOrFunc(columnDef.enableEditing, row) === false,
  //     label: ["custom", "modal"].includes(
  //       (isCreating ? createDisplayMode : editDisplayMode) as string
  //     )
  //       ? column.columnDef.header
  //       : undefined,
  //     name: cell.id,
  //     onClick: (e: any) => {
  //       e.stopPropagation();
  //       textInputProps?.onClick?.(e);
  //     },
  //     placeholder: !["custom", "modal"].includes(
  //       (isCreating ? createDisplayMode : editDisplayMode) as string
  //     )
  //       ? columnDef.header
  //       : undefined,
  //     value,
  //     variant: editDisplayMode === "table" ? "unstyled" : "default",
  //   } as const;

  //   if (isSelectEdit) {
  //     return (
  //       // @ts-ignore
  //       <Select
  //         {...commonProps}
  //         searchable
  //         value={value}
  //         {...selectProps}
  //         onBlur={handleBlur}
  //         onChange={(value) => {
  //           selectProps.onChange?.(value as any);
  //           setValue(value);
  //         }}
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           selectProps?.onClick?.(e);
  //         }}
  //         ref={(node) => {
  //           if (node) {
  //             editInputRefs.current[cell.id] = node;
  //             if (selectProps.ref) {
  //               selectProps.ref.current = node;
  //             }
  //           }
  //         }}
  //       />
  //     );
  //   }

  return (
    <FileInput
      disabled={parseFromValuesOrFunc(columnDef.enableEditing, row) === false}
      label={
        ["custom", "modal"].includes(
          (isCreating ? createDisplayMode : editDisplayMode) as string
        )
          ? column.columnDef.header
          : undefined
      }
      placeholder={
        !["custom", "modal"].includes(
          (isCreating ? createDisplayMode : editDisplayMode) as string
        )
          ? columnDef.header
          : undefined
      }
      variant={editDisplayMode === "table" ? "unstyled" : "default"}
      name={cell.id}
      //onKeyDown={handleEnterKeyDown}
      //{...rest}
      value={internalValue}
      onBlur={handleBlur}
      onChange={(file) => {
        if (!file) return;

        rest?.onChange?.(file);
        setInternalValue(file);

        const reader = new FileReader();
        reader.readAsDataURL(file as Blob);
        reader.onload = () => {
          setValue(reader.result);
        };
        reader.onerror = (error) => {
          console.log("Error: ", error);
        };
      }}
      // onClick={(event) => {
      //   event.stopPropagation();
      //   rest?.onClick?.(event);
      // }}
      //   ref={(node) => {
      //     if (node) {
      //       editInputRefs.current[cell.id] = node;
      //       if (rest.ref) {
      //         rest.ref.current = node;
      //       }
      //     }
      //   }}
    />
  );
};
