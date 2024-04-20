import { useMantineRTInstance } from "@components/MantineRT";
import {
  CustomActionMenuItemPropsType,
  RenderCustomActionMenuItems,
} from "@components/MantineRT/RenderCustomActionMenuItems";
import { CustomToolbarButtonsPropsType } from "@components/MantineRT/RenderCustomToolbarButton";
import { useDisclosure } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import { TypeAuth0User } from "@sunrise-backend/src/schemas/Auth0User.schema";
import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import { MantineReactTable } from "mantine-react-table";
import { useCallback, useMemo, useState } from "react";

export const Route = createFileRoute("/_management/management/user/")({
  onEnter: () => {
    nprogress.complete();
  },
  onLeave: () => {
    nprogress.start();
  },
  component: () => {
    const [selectedId, setSelectedId] = useState<string | undefined>("");

    const [openedModalAdd, { open: openModalAdd, close: closeModalAdd }] =
      useDisclosure(false);
    const [
      openedModalUpdate,
      { open: openModalUpdate, close: closeModalUpdate },
    ] = useDisclosure(false);
    const [
      openedModalDelete,
      { open: openModalDelete, close: closeModalDelete },
    ] = useDisclosure(false);

    const handleOpenModalAdd = useCallback(() => {
      openModalAdd();
    }, [openModalAdd]);

    const handleCloseModalAdd = () => {
      closeModalAdd();
    };

    const handleOpenModalUpdate = useCallback(
      (Id: string | undefined) => () => {
        setSelectedId(Id);
        openModalUpdate();
      },
      [openModalUpdate]
    );

    const handleCloseModalUpdate = () => {
      setSelectedId("");
      closeModalUpdate();
    };

    const handleOpenModalDelete = useCallback(
      (Id: string | undefined) => () => {
        setSelectedId(Id);
        openModalDelete();
      },
      [openModalDelete]
    );

    const handleCloseModalDelete = () => {
      setSelectedId("");
      closeModalDelete();
    };

    const tableActions = useMemo<CustomToolbarButtonsPropsType[]>(
      () => [
        {
          label: "Thêm",
          actionType: "Add",
          onClick: handleOpenModalAdd,
        },
      ],
      [handleOpenModalAdd]
    );

    const tableRowActions = useCallback(
      (Id: string | undefined): CustomActionMenuItemPropsType[] => [
        {
          id: "Update",
          label: "Cập nhật",
          actionType: "Update",
          onClick: handleOpenModalUpdate(Id),
        },
        {
          id: "Remove",
          label: "Xóa",
          actionType: "Delete",
          onClick: handleOpenModalDelete(Id),
        },
      ],
      [handleOpenModalUpdate, handleOpenModalDelete]
    );

    const table = useMantineRTInstance<TypeAuth0User>({
      columns: [
        {
          accessorKey: "username",
          header: "Username",
          filterFn: "contains",
        },
        {
          accessorKey: "email",
          header: "Email",
          filterFn: "contains",
        },
        {
          accessorKey: "name",
          header: "Tên",
          filterFn: "contains",
        },
        {
          accessorKey: "phone_number",
          header: "Số điện thoại",
          filterFn: "contains",
        },
      ],
      useQuery: privateRoute.management.admin_user.byPage.useQuery,
      topToolbarActionObjectList: tableActions,
      tableProps: {
        enableGrouping: false,
        enableRowSelection: false,
        enableMultiRowSelection: false,
        getRowId: (row) => row.user_id,
        enableRowActions: true,
        renderRowActionMenuItems: ({ row }) =>
          RenderCustomActionMenuItems({
            rowId: row.id,
            actionList: tableRowActions(row.id),
            //onClickAction: closeMenu,
          }),
      },
    });

    return (
      <>
        <MantineReactTable table={table} />
        {/* <ModalAddPostType
          isOpen={openedModalAdd}
          handleClose={handleCloseModalAdd}
        /> */}
      </>
    );
  },
});