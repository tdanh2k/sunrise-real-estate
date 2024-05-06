import { TextInput, TextInputProps } from "@mantine/core";
import { PickByType } from "@custom_types/PickByType";
import { Control, FieldValues, Path, useController } from "react-hook-form";

type TextInputRHFProps<T extends FieldValues> = Omit<
  TextInputProps,
  "ref" | "value" | "error" | "name"
> & {
  name?: Path<PickByType<T, string | undefined>>; 
  //name: Path<T>;
  control?: Control<T>;
};

export const TextInputRHF = <T extends FieldValues>({
  name,
  control,
  disabled,
  onChange,
  onBlur,
  ...textInputProps
}: TextInputRHFProps<T>) => {
  if (name == null || control == null) throw new Error("'name' and 'control' are required");

  const {
    field: { onChange: onFieldChange, onBlur: onFieldBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitting },
  } = useController({ name: name as Path<T>, control });
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
