import { useMantineRTInstance } from "@components/MantineRT";
import { nprogress } from "@mantine/nprogress";
import { TypePendingPost } from "@sunrise-backend/src/schemas/PendingPost.schema";
import { IconZoomCheckFilled } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import { MantineReactTable } from "mantine-react-table";

export const Route = createFileRoute("/_management/management/posts/pending_post/")({
  onEnter: () => {
    nprogress.complete();
  },
  onLeave: () => {
    nprogress.start();
  },
  staticData: {
    routeName: "Bài chờ duyệt",
    icon: <IconZoomCheckFilled />,
  },
  component: () => {
    // const [selectedId, setSelectedId] = useState<string | undefined>("");
    // const [openedModalAdd, { open: openModalAdd, close: closeModalAdd }] =
    //   useDisclosure(false);
    // const [
    //   openedModalUpdate,
    //   { open: openModalUpdate, close: closeModalUpdate },
    // ] = useDisclosure(false);
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

    // const tableRowActions = useCallback(
    //   (Id: string | undefined): CustomActionMenuItemPropsType[] => [
    //     {
    //       id: "Update",
    //       label: "Duyệt",
    //       actionType: "Update",
    //       onClick: handleOpenModalUpdate(Id),
    //     },
    //     // {
    //     //   id: "Remove",
    //     //   label: "Xóa",
    //     //   actionType: "Delete",
    //     //   onClick: handleOpenModalDelete(Id),
    //     // },
    //   ],
    //   [handleOpenModalUpdate, handleOpenModalDelete]
    // );

    const table = useMantineRTInstance<TypePendingPost>({
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
      useQuery: privateRoute.management.post.byPage.useQuery,
      //topToolbarActionObjectList: tableActions,
      tableProps: {
        enableGrouping: false,
        enableRowSelection: false,
        enableMultiRowSelection: false,
        getRowId: (row) => row.Id,
        // enableRowActions: true,
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
        {/* <ModalAddPost
          isOpen={openedModalAdd}
          handleClose={handleCloseModalAdd}
        /> */}
      </>
    );
  },
});
