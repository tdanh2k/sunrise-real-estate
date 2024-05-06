import { FileInput, FileInputProps } from "@mantine/core";
import { PickByType } from "@custom_types/PickByType";
import { Control, FieldValues, Path, useController } from "react-hook-form";

type FileInputRHFProps<T extends FieldValues> = Omit<
  FileInputProps<false>,
  "ref" | "value" | "error" | "name"
> &
  (
    | {
        name?: Path<PickByType<T, File | null>>;
        returnBase64URI: false;
        //name: Path<T>;
        control?: Control<T>;
      }
    | {
        name?: Path<PickByType<T, string | undefined>>;
        returnBase64URI: true;
        //name: Path<T>;
        control?: Control<T>;
      }
  );

export const FileInputRHF = <T extends FieldValues>({
  name,
  control,
  disabled,
  onChange,
  onBlur,
  returnBase64URI,
  ...textInputProps
}: FileInputRHFProps<T>) => {
  if (name == null || control == null)
    throw new Error("'name' and 'control' are required");

  const {
    field: { onChange: onFieldChange, onBlur: onFieldBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitting },
  } = useController({ name: name as Path<T>, control });

  return (
    <FileInput
      {...textInputProps}
      ref={ref}
      value={value}
      multiple={false}
      onChange={(file) => {
        if (returnBase64URI) {
          const reader = new FileReader();
          reader.readAsDataURL(file as Blob);
          reader.onload = () => {
            onFieldChange(reader.result);
          };
          reader.onerror = (error) => {
            console.log("Error: ", error);
          };
        } else {
          onFieldChange(file);
        }

        onChange?.(file as File | null);
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
