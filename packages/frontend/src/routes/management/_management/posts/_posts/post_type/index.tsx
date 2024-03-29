import { useMantineRTInstance } from "@components/MantineRT";
import {
  CustomActionMenuItemPropsType,
  RenderCustomActionMenuItems,
} from "@components/MantineRT/RenderCustomActionMenuItems";
import { CustomToolbarButtonsPropsType } from "@components/MantineRT/RenderCustomToolbarButton";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@utils/trpc";
import { MantineReactTable } from "mantine-react-table";
import { FC, useCallback, useMemo, useState } from "react";
import { TypeGlobalPostType } from "@sunrise-backend/src/schemas/GlobalPostType.schema";
import { ModalAddPostType } from "./-components/ModalAddPostType";

const PostType: FC = () => {
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

  const table = useMantineRTInstance<TypeGlobalPostType>({
    columns: [
      {
        accessorKey: "Id",
        header: "Id",
        filterFn: "contains",
      },
      {
        accessorKey: "Idx",
        header: "Thứ tự",
        filterFn: "contains",
      },
      {
        accessorKey: "Name",
        header: "Tên",
        filterFn: "contains",
      },
    ],
    useQuery: trpc.global_post_type.byPage.useQuery,
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
          actionList: tableRowActions(row.id),
          //onClickAction: closeMenu,
        }),
    },
  });

  return (
    <>
      <MantineReactTable table={table} />
      <ModalAddPostType
        isOpen={openedModalAdd}
        handleClose={handleCloseModalAdd}
      />
    </>
  );
};

export const Route = createFileRoute(
  "/management/_management/posts/_posts/post_type/"
)({
  component: PostType,
});
