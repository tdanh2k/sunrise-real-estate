import { ComboboxData, Select, SelectProps } from "@mantine/core";
import { Control, FieldValues, Path, useController } from "react-hook-form";

export type SelectRHFProps<T extends FieldValues> = Omit<
  SelectProps,
  "ref" | "value" | "data" | "name"
> & {
  name: Path<T>;
  control?: Control<T>;
  options: ComboboxData;
};

export const SelectRHF = <T extends FieldValues>({
  name,
  options,
  control,
  disabled,
  onChange,
  onBlur,
  error,
  ...SelectProps
}: SelectRHFProps<T>) => {
  if (name == null || name == undefined) throw new Error("'name' required");

  const {
    field: { onChange: onFieldChange, onBlur: onFieldBlur, value, ref },
    fieldState: { error: fieldError },
    formState: { isSubmitting },
  } = useController({ name, control });
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
      error={error ?? fieldError?.message}
      disabled={disabled || isSubmitting}
    />
  );
};
