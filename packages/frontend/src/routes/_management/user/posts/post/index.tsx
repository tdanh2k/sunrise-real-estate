import { useMantineRTInstance } from "@components/MantineRT";
import { CustomToolbarButtonsPropsType } from "@components/MantineRT/RenderCustomToolbarButton";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import { MantineReactTable } from "mantine-react-table";
import { useCallback, useMemo } from "react";
import { TypePost } from "@sunrise-backend/src/schemas/Post.schema";
import { ModalAddPost } from "./-components/ModalAddPost";
import { nprogress } from "@mantine/nprogress";
import { IconNews } from "@tabler/icons-react";

export const Route = createFileRoute("/_management/user/posts/post/")({
  onEnter: () => {
    nprogress.complete();
  },
  onLeave: () => {
    nprogress.start();
  },
  staticData: {
    routeName: "Bài đăng",
    icon: <IconNews />,
  },
  component: () => {
    //const [selectedId, setSelectedId] = useState<string | undefined>("");
    const [openedModalAdd, { open: openModalAdd, close: closeModalAdd }] =
      useDisclosure(false);
    // const [
    //   openedModalUpdate,
    //   { open: openModalUpdate, close: closeModalUpdate },
    // ] = useDisclosure(false);
    // const [
    //   openedModalDelete,
    //   { open: openModalDelete, close: closeModalDelete },
    // ] = useDisclosure(false);

    const handleOpenModalAdd = useCallback(() => {
      openModalAdd();
    }, [openModalAdd]);

    const handleCloseModalAdd = () => {
      closeModalAdd();
    };

    // const handleOpenModalUpdate = useCallback(
    //   (Id: string | undefined) => () => {
    //     setSelectedId(Id);
    //     openModalUpdate();
    //   },
    //   [openModalUpdate]
    // );

    // const handleCloseModalUpdate = () => {
    //   setSelectedId("");
    //   closeModalUpdate();
    // };

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

    // const tableRowActions = useCallback(
    //   (Id: string | undefined): CustomActionMenuItemPropsType[] => [
    //     {
    //       id: "Update",
    //       label: "Cập nhật",
    //       actionType: "Update",
    //       onClick: handleOpenModalUpdate(Id),
    //     },
    //     {
    //       id: "Remove",
    //       label: "Xóa",
    //       actionType: "Delete",
    //       onClick: handleOpenModalDelete(Id),
    //     },
    //   ],
    //   [handleOpenModalUpdate, handleOpenModalDelete]
    // );

    const table = useMantineRTInstance<TypePost>({
      columns: [
        {
          accessorKey: "Id",
          header: "Id",
          filterFn: "contains",
        },
        {
          accessorKey: "Code",
          header: "Mã quản lý",
          filterFn: "contains",
        },
      ],
      useQuery: privateRoute.user.post.byPage.useQuery,
      topToolbarActionObjectList: tableActions,
      tableProps: {
        enableGrouping: false,
        enableRowSelection: false,
        enableMultiRowSelection: false,
        getRowId: (row) => row.Id,
        enableRowActions: true,
        // renderRowActionMenuItems: ({ row }) =>
        //   RenderCustomActionMenuItems({
        //     rowId: row.id,
        //     actionList: tableRowActions(row.id),
        //     //onClickAction: closeMenu,
        //   }),
      },
    });

    return (
      <>
        <MantineReactTable table={table} />
        <ModalAddPost
          isOpen={openedModalAdd}
          handleClose={handleCloseModalAdd}
        />
      </>
    );
  },
});
