import { type FocusEvent, type KeyboardEvent, useState } from "react";
import {
  Select,
  SelectProps,
  TextInput,
  type TextInputProps,
} from "@mantine/core";
import {
  MRT_Cell,
  MRT_CellValue,
  MRT_RowData,
  MRT_TableInstance,
} from "mantine-react-table";
import { Control } from "react-hook-form";

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue>
  extends TextInputProps {
  cell: MRT_Cell<TData, TValue>;
  table: MRT_TableInstance<TData>;
  control: Control<TData>;
}

const parseFromValuesOrFunc = <T, U>(
  fn: ((arg: U) => T) | T | undefined,
  arg: U
): T | undefined => (fn instanceof Function ? fn(arg) : fn);

export const CustomMRT_EditCellTextInput = <TData extends MRT_RowData>({
  cell,
  table,
  control,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      mantineEditSelectProps,
      mantineEditTextInputProps,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { creatingRow, editingRow } = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;
  const isSelectEdit = columnDef.editVariant === "select";

  const [value, setValue] = useState(() =>
    cell.getValue<string | null | undefined>()
  );

  const arg = { cell, column, row, table };
  const textInputProps = {
    ...parseFromValuesOrFunc(mantineEditTextInputProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineEditTextInputProps, arg),
    ...rest,
  };

  const selectProps = {
    ...parseFromValuesOrFunc(mantineEditSelectProps, arg),
    ...parseFromValuesOrFunc(columnDef.mantineEditSelectProps, arg),
    ...rest,
  };

  const saveInputValueToRowCache = (newValue?: string | null) => {
    //@ts-expect-error no type
    row._valuesCache[column.id] = newValue;
    if (isCreating) {
      setCreatingRow(row);
    } else if (isEditing) {
      setEditingRow(row);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    textInputProps.onBlur?.(event);
    saveInputValueToRowCache(value);
    setEditingCell(null);
  };

  const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    textInputProps.onKeyDown?.(event);
    if (event.key === "Enter") {
      editInputRefs.current[cell.id]?.blur();
    }
  };

  if (columnDef.Edit) {
    return columnDef.Edit?.({ cell, column, row, table });
  }

  const commonProps = {
    disabled: parseFromValuesOrFunc(columnDef.enableEditing, row) === false,
    label: ["custom", "modal"].includes(
      (isCreating ? createDisplayMode : editDisplayMode) as string
    )
      ? column.columnDef.header
      : undefined,
    name: cell.id,
    onClick: (e: any) => {
      e.stopPropagation();
      textInputProps?.onClick?.(e);
    },
    placeholder: !["custom", "modal"].includes(
      (isCreating ? createDisplayMode : editDisplayMode) as string
    )
      ? columnDef.header
      : undefined,
    value,
    variant: editDisplayMode === "table" ? "unstyled" : "default",
  } as const;

  if (isSelectEdit) {
    return (
      <Select
        {...commonProps}
        searchable
        value={value as string | null | undefined}
        {...selectProps}
        onBlur={handleBlur}
        onChange={(value, option) => {
          (selectProps.onChange as SelectProps["onChange"])?.(value, option);
          setValue(value);
        }}
        onClick={(e) => {
          e.stopPropagation();
          selectProps?.onClick?.(e);
        }}
        ref={(node) => {
          if (node) {
            editInputRefs.current[cell.id] = node;
            if (selectProps.ref) {
              selectProps.ref.current = node;
            }
          }
        }}
      />
    );
  }

  return (
    <TextInput
      {...commonProps}
      onKeyDown={handleEnterKeyDown}
      value={value ?? ""}
      {...textInputProps}
      onBlur={handleBlur}
      onChange={(event) => {
        textInputProps.onChange?.(event);
        setValue(event.target.value);
      }}
      onClick={(event) => {
        event.stopPropagation();
        textInputProps?.onClick?.(event);
      }}
      ref={(node) => {
        if (node) {
          editInputRefs.current[cell.id] = node;
          if (textInputProps.ref) {
            textInputProps.ref.current = node;
          }
        }
      }}
    />
  );
};
