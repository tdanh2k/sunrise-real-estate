import { PickByType } from "@custom_types/PickByType";
import { NumberInput, NumberInputProps } from "@mantine/core";
import { Control, FieldValues, Path, useController } from "react-hook-form";

type NumberInputRHFProps<T extends FieldValues> = Omit<
  NumberInputProps,
  "ref" | "value" | "error" | "name"
> & {
  name?: Path<PickByType<T, number | undefined>>;
  //name: Path<T>;
  control?: Control<T>;
};

export const NumberInputRHF = <T extends FieldValues>({
  name,
  control,
  disabled,
  onChange,
  onBlur,
  ...numberInputProps
}: NumberInputRHFProps<T>) => {
  if (name == null || control == null)
    throw new Error("'name' and 'control' are required");

  const {
    field: { onChange: onFieldChange, onBlur: onFieldBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitting },
  } = useController({ name: name as Path<T>, control });

  return (
    <NumberInput
      {...numberInputProps}
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
