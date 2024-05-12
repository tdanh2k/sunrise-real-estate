import { Menu, MenuItemProps } from "@mantine/core";
import {
  IconEdit,
  IconPlus,
  IconQuestionMark,
  IconTrash,
} from "@tabler/icons-react";

export type CustomActionMenuItemPropsType = {
  id?: string;
  label: string;
  actionType?: "Add" | "Update" | "Delete" | string;
  disabled?: boolean;
  menuItemProps?: MenuItemProps;
  onClick: () => void;
};

export type RenderCustomActionMenuItemsPropsType = {
  rowId: string | number;
  actionList: CustomActionMenuItemPropsType[];
  onClickAction?: () => void;
  isLoading?: boolean;
};

export const RenderCustomActionMenuItems = ({
  rowId,
  actionList,
  onClickAction,
  isLoading,
}: RenderCustomActionMenuItemsPropsType) => {
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

  return actionList?.map(
    ({ label, actionType, menuItemProps, disabled, onClick }, index) => (
      <Menu.Item
        {...menuItemProps}
        key={`${rowId}-${index}`}
        onClick={() => {
          onClick();
          onClickAction?.();
        }}
        leftSection={menuItemProps?.leftSection ?? actionTypeIcon(actionType)}
        color={actionTypeColor(actionType)}
        disabled={disabled || isLoading}
      >
        {label}
      </Menu.Item>
    )
  );
};
