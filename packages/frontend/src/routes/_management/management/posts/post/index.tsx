import { useMantineRTInstance } from "@components/MantineRT";
import { CustomToolbarButtonsPropsType } from "@components/MantineRT/RenderCustomToolbarButton";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import { MantineReactTable } from "mantine-react-table";
import { useCallback, useMemo, useState } from "react";
import { TypePost } from "@sunrise-backend/src/schemas/Post.schema";
import { ModalAddPost } from "./-components/ModalAddPost";
import { nprogress } from "@mantine/nprogress";
import { IconNews } from "@tabler/icons-react";
import { CustomActionMenuItemPropsType, RenderCustomActionMenuItems } from "@components/MantineRT/RenderCustomActionMenuItems";
import { ModalUpdatePost } from "./-components/ModalUpdatePost";
import { ModalConfirmDelete } from "@components/MantineRHF/CustomModal/delete";

export const Route = createFileRoute("/_management/management/posts/post/")({
  onEnter: () => {
    nprogress.complete();
  },
  onLeave: () => {
    nprogress.start();
  },
  staticData: {
    routeName: "Danh sách bài đăng",
    icon: <IconNews />,
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

    const table = useMantineRTInstance<TypePost>({
      columns: [
        {
          accessorKey: "Code",
          header: "Mã quản lý",
          filterFn: "contains",
        },
        {
          accessorKey: "Title",
          header: "Tiêu đề",
          filterFn: "contains",
        },
        {
          accessorKey: "Area",
          header: "Diện tích",
          filterFn: "contains",
        },
        {
          accessorKey: "Price",
          header: "Giá",
          filterFn: "contains",
        },
      ],
      useQuery: privateRoute.management.post.byPage.useQuery,
      topToolbarActionObjectList: tableActions,
      tableProps: {
        enableGrouping: false,
        enableRowSelection: false,
        enableMultiRowSelection: false,
        getRowId: (row) => row.Id,
        enableRowActions: true,
        renderRowActionMenuItems: ({ row }) =>
          RenderCustomActionMenuItems({
            rowId: row.id,
            actionList: tableRowActions(row?.original?.Id),
            //onClickAction: closeMenu,
          }),
      },
    });

    return (
      <>
        <MantineReactTable table={table} />
        <ModalAddPost
          isOpen={openedModalAdd}
          handleClose={handleCloseModalAdd}
        />
        <ModalUpdatePost
          isOpen={openedModalUpdate && Boolean(selectedId)}
          postId={selectedId ?? ""}
          handleClose={handleCloseModalUpdate}
        />
        <ModalConfirmDelete
          opened={openedModalDelete}
          onClose={handleCloseModalDelete}
          data={{ Id: selectedId ?? "" }}
          useMutation={privateRoute.management.post.delete.useMutation}
        />
      </>
    );
  },
});
