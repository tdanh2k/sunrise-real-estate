import { FC, MouseEventHandler } from "react";
import {
  IconEdit,
  IconPlus,
  IconQuestionMark,
  IconTrash,
} from "@tabler/icons-react";
import { Button, ButtonProps } from "@mantine/core";

export type CustomToolbarButtonsPropsType = ButtonProps & {
  label: string;
  actionType?: "Add" | "Update" | "Delete" | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export type RenderCustomToolbarButtonsPropsType = {
  actionList: CustomToolbarButtonsPropsType[];
  onClickAction?: () => void;
  isLoading?: boolean;
};

export const RenderCustomToolbarButtons: FC<
  RenderCustomToolbarButtonsPropsType
> = ({ actionList, onClickAction, isLoading }) => {
  const actionTypeIcon = (actionType?: string) => {
    switch (actionType) {
      case "Add":
        return <IconPlus />;
      case "Update":
        return <IconEdit />;
      case "Delete":
        return <IconTrash />;
      default:
        return <IconQuestionMark />;
    }
  };

  const actionTypeColor = (actionType?: string) => {
    switch (actionType) {
      case "Add":
        return "primary";
      case "Update":
        return "warning";
      case "Delete":
        return "error";
      default:
        return "inherit";
    }
  };

  return (
    <>
      {actionList?.map(({ label, actionType, ...buttonProps }, index) => (
        <Button
          {...buttonProps}
          key={index}
          size="small"
          variant="subtle"
          disabled={buttonProps?.disabled || isLoading}
          leftSection={buttonProps?.leftSection ?? actionTypeIcon(actionType)}
          color={buttonProps?.color ?? actionTypeColor(actionType)}
          onClick={(event) => {
            buttonProps?.onClick?.(event);
            onClickAction?.();
          }}
        >
          {label}
        </Button>
      ))}
    </>
  );
};
