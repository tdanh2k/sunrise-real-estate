import { useMantineRTInstance } from "@components/MantineRT";
import { useDisclosure } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import { TypeDraftBlog } from "@sunrise-backend/src/schemas/DraftBlog.schema";
import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import { MantineReactTable } from "mantine-react-table";
import { useCallback, useMemo, useState } from "react";
import { ModalAddDraftBlog } from "./-components/ModalAddDraftBlog";
import { CustomToolbarButtonsPropsType } from "@components/MantineRT/RenderCustomToolbarButton";
import {
  CustomActionMenuItemPropsType,
  RenderCustomActionMenuItems,
} from "@components/MantineRT/RenderCustomActionMenuItems";
import { CustomDeleteModal } from "@components/MantineRHF/CustomModal/delete";

export const Route = createFileRoute("/_management/user/blogs/draft_blog/")({
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

    const handleOpenModalDelete = (Id?: string) => () => {
      setSelectedId(Id);
      openModalDelete();
    };

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

    const table = useMantineRTInstance<TypeDraftBlog>({
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
          accessorKey: "GlobalDraftBlogType.Name",
          header: "Thuộc loại",
          filterFn: "contains",
        },
      ],
      useQuery: privateRoute.user.draft_blog.byPage.useQuery,
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
            actionList: tableRowActions(row.original.Id),
            //onClickAction: closeMenu,
          }),
      },
    });

    return (
      <>
        <MantineReactTable table={table} />
        <ModalAddDraftBlog
          isOpen={openedModalAdd}
          handleClose={handleCloseModalAdd}
        />
        <CustomDeleteModal
          isOpen={openedModalDelete}
          handleClose={handleCloseModalDelete}
          data={{ Id: selectedId ?? "" }}
          useMutation={privateRoute.user.draft_blog.delete.useMutation}
        />
      </>
    );
  },
});
