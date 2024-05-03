import { useMantineRTInstance } from "@components/MantineRT";
import {
  CustomActionMenuItemPropsType,
  RenderCustomActionMenuItems,
} from "@components/MantineRT/RenderCustomActionMenuItems";
import { useDisclosure } from "@mantine/hooks";
import { TypeDraftPost } from "@sunrise-backend/src/schemas/DraftPost.schema";
import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import { MantineReactTable } from "mantine-react-table";
import { useCallback, useState } from "react";
import { ModalEditDraftPost } from "./-components/ModalEditDraftPost";
import { nprogress } from "@mantine/nprogress";
import { IconNewsOff } from "@tabler/icons-react";

export const Route = createFileRoute("/_management/user/posts/draft_post/")({
  onEnter: () => {
    nprogress.complete();
  },
  onLeave: () => {
    nprogress.start();
  },
  staticData: {
    routeName: "Bài nháp",
    icon: <IconNewsOff />,
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

    const table = useMantineRTInstance<TypeDraftPost>({
      columns: [
        {
          accessorKey: "Title",
          header: "Tiêu đề",
          filterFn: "contains",
        },
        {
          accessorKey: "Code",
          header: "Mã quản lý",
          filterFn: "contains",
        },
        {
          accessorKey: "Price",
          header: "Giá bán",
          filterFn: "contains",
        },
      ],
      useQuery: privateRoute.user.draft_post.byPage.useQuery,
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
        {/* <ModalAddPost
          isOpen={openedModalAdd}
          handleClose={handleCloseModalAdd}
        /> */}
        <ModalEditDraftPost
          isOpen={openedModalUpdate}
          draftPostId={selectedId}
          handleClose={handleCloseModalUpdate}
        />
      </>
    );
  },
});
