import { TextInput, TextInputProps } from "@mantine/core";
import { FC } from "react";
import { Control, useController } from "react-hook-form";

type TextInputRHFProps = Omit<TextInputProps, "ref" | "value" | "error"> & {
  control?: Control;
};

export const TextInputRHF: FC<TextInputRHFProps> = ({
  name,
  control,
  disabled,
  onChange,
  onBlur,
  ...textInputProps
}) => {
  if (name == null || name == undefined) throw new Error("'name' required");

  const {
    field: { onChange: onFieldChange, onBlur: onFieldBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitting },
  } = useController({ name, control });
  return (
    <TextInput
      {...textInputProps}
      ref={ref}
      value={value}
      onChange={(event) => {
        onChange?.(event);
        onFieldChange(event);
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
