import { ComboboxData, Select, SelectProps } from "@mantine/core";
import { FC } from "react";
import { Control, useController } from "react-hook-form";

type SelectRHFProps = Omit<SelectProps, "ref" | "value" | "data" | "error"> & {
  control?: Control;
  options: ComboboxData;
};

export const SelectRHF: FC<SelectRHFProps> = ({
  name,
  options,
  control,
  disabled,
  onChange,
  onBlur,
  ...SelectProps
}) => {
  if (name == null || name == undefined) throw new Error("'name' required");

  const {
    field: { onChange: onFieldChange, onBlur: onFieldBlur, value, ref },
    fieldState: { error },
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
      error={error?.message}
      disabled={disabled || isSubmitting}
    />
  );
};
