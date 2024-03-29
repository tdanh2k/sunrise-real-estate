import { Switch, SwitchProps } from "@mantine/core";
import { PickByType } from "@custom_types/PickByType";
import { Control, FieldValues, Path, useController } from "react-hook-form";

type SwitchRHFProps<T extends FieldValues> = Omit<
  SwitchProps,
  "ref" | "value" | "error" | "name"
> & {
  name?: Path<PickByType<T, boolean>>;
  //name: Path<T>;
  control?: Control<T>;
};

export const SwitchRHF = <T extends FieldValues>({
  name,
  control,
  disabled,
  onChange,
  onBlur,
  ...switchProps
}: SwitchRHFProps<T>) => {
  if (name == null || control == null)
    throw new Error("'name' and 'control' are required");

  const {
    field: { onChange: onFieldChange, onBlur: onFieldBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitting },
  } = useController({ name: name as Path<T>, control });
  return (
    <Switch
      {...switchProps}
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
