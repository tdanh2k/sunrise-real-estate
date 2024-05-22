import { useMantineRTInstance } from "@components/MantineRT";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import { MantineReactTable } from "mantine-react-table";
import { useCallback, useState } from "react";
import { nprogress } from "@mantine/nprogress";
import { IconMessages } from "@tabler/icons-react";
import {
  CustomActionMenuItemPropsType,
  RenderCustomActionMenuItems,
} from "@components/MantineRT/RenderCustomActionMenuItems";
import { ModalConfirmDelete } from "@components/MantineRHF/CustomModal/delete";
import { TypeFeedback } from "@sunrise-backend/src/schemas/Feedback.schema";

export const Route = createFileRoute("/_management/management/feedback/")({
  onEnter: () => {
    nprogress.complete();
  },
  onLeave: () => {
    nprogress.start();
  },
  staticData: {
    routeName: "Phản hồi từ khách hàng",
    icon: <IconMessages />,
  },
  component: () => {
    const [selectedId, setSelectedId] = useState<string | undefined>("");
    const [
      openedModalDelete,
      { open: openModalDelete, close: closeModalDelete },
    ] = useDisclosure(false);

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
          id: "Remove",
          label: "Xóa",
          actionType: "Delete",
          onClick: handleOpenModalDelete(Id),
        },
      ],
      [handleOpenModalDelete]
    );

    const table = useMantineRTInstance<TypeFeedback>({
      columns: [
        {
          accessorKey: "Name",
          header: "Khách hàng",
          filterFn: "contains",
        },
        {
          accessorKey: "Title",
          header: "Tiêu đề",
          filterFn: "contains",
        },
        {
          accessorKey: "Email",
          header: "Email",
          filterFn: "contains",
        },
        {
          accessorKey: "Phone",
          header: "Điện thoại",
          filterFn: "contains",
        },
        {
          accessorKey: "Description",
          header: "Phản hồi",
          filterFn: "contains",
        },
      ],
      useQuery: privateRoute.management.feedback.byPage.useQuery,
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
        <ModalConfirmDelete
          opened={openedModalDelete}
          onClose={handleCloseModalDelete}
          data={{ Id: selectedId ?? "" }}
          useMutation={privateRoute.management.feedback.delete.useMutation}
        />
      </>
    );
  },
});
