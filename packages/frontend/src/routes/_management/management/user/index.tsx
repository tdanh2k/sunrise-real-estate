import { useMantineRTInstance } from "@components/MantineRT";
import {
  CustomActionMenuItemPropsType,
  RenderCustomActionMenuItems,
} from "@components/MantineRT/RenderCustomActionMenuItems";
import { nprogress } from "@mantine/nprogress";
import { TypeAuth0User } from "@sunrise-backend/src/schemas/Auth0User.schema";
import { IconUsers } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import { MantineReactTable } from "mantine-react-table";
import { ModalUpdateAuth0User } from "./-components/ModalUpdateUser";
import { useCallback, useState } from "react";
import { useDisclosure } from "@mantine/hooks";

export const Route = createFileRoute("/_management/management/user/")({
  onEnter: () => {
    nprogress.complete();
  },
  onLeave: () => {
    nprogress.start();
  },
  staticData: {
    routeName: "Quản lý tài khoản",
    icon: <IconUsers />,
  },
  component: () => {
    const [selectedId, setSelectedId] = useState<string | undefined>("");

    // const [openedModalAdd, { open: openModalAdd, close: closeModalAdd }] =
    //   useDisclosure(false);
    const [
      openedModalUpdate,
      { open: openModalUpdate, close: closeModalUpdate },
    ] = useDisclosure(false);
    // const [
    //   openedModalDelete,
    //   { open: openModalDelete, close: closeModalDelete },
    // ] = useDisclosure(false);

    // const handleOpenModalAdd = useCallback(() => {
    //   openModalAdd();
    // }, [openModalAdd]);

    // const handleCloseModalAdd = () => {
    //   closeModalAdd();
    // };

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

    // const handleOpenModalDelete = useCallback(
    //   (Id: string | undefined) => () => {
    //     setSelectedId(Id);
    //     openModalDelete();
    //   },
    //   [openModalDelete]
    // );

    // const handleCloseModalDelete = () => {
    //   setSelectedId("");
    //   closeModalDelete();
    // };

    // const tableActions = useMemo<CustomToolbarButtonsPropsType[]>(
    //   () => [
    //     {
    //       label: "Thêm",
    //       actionType: "Add",
    //       onClick: handleOpenModalAdd,
    //     },
    //   ],
    //   [handleOpenModalAdd]
    // );

    const tableRowActions = useCallback(
      (Id: string | undefined): CustomActionMenuItemPropsType[] => [
        {
          id: "Update",
          label: "Cập nhật",
          actionType: "Update",
          onClick: handleOpenModalUpdate(Id),
        },
        // {
        //   id: "Remove",
        //   label: "Xóa",
        //   actionType: "Delete",
        //   onClick: handleOpenModalDelete(Id),
        // },
      ],
      [handleOpenModalUpdate]
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
      //topToolbarActionObjectList: tableActions,
      tableProps: {
        enableGrouping: false,
        enableRowSelection: false,
        enableMultiRowSelection: false,
        getRowId: (row) => row.user_id,
        enableRowActions: true,
        renderRowActionMenuItems: ({ row }) =>
          RenderCustomActionMenuItems({
            rowId: row.id,
            actionList: tableRowActions(row.original.user_id),
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
        <ModalUpdateAuth0User
          isOpen={openedModalUpdate && Boolean(selectedId)}
          userId={selectedId ?? ""}
          handleClose={handleCloseModalUpdate}
        />
      </>
    );
  },
});
