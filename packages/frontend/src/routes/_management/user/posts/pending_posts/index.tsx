import { useMantineRTInstance } from "@components/MantineRT";
import { nprogress } from "@mantine/nprogress";
import { TypePendingPost } from "@sunrise-backend/src/schemas/PendingPost.schema";
import { IconCheck, IconInfoCircle, IconX, IconZoomCheck } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import dayjs from "dayjs";
import { MantineReactTable } from "mantine-react-table";

export const Route = createFileRoute("/_management/user/posts/pending_posts/")({
  onEnter: () => {
    nprogress.complete();
  },
  onLeave: () => {
    nprogress.start();
  },
  staticData: {
    routeName: "Bài chờ duyệt",
    icon: <IconZoomCheck />,
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

    const table = useMantineRTInstance<TypePendingPost>({
      columns: [
        {
          accessorKey: "Title",
          header: "Tiêu đề",
          filterFn: "contains",
        },
        {
          accessorKey: "Area",
          header: "Diện tích (m2)",
          filterFn: "contains",
        },
        {
          accessorKey: "Price",
          header: "Giá",
          filterFn: "contains",
        },
        {
          accessorKey: "GlobalBlogType.Name",
          header: "Thuộc loại",
          filterFn: "contains",
        },
        {
          accessorKey: "Auth0Profile.name",
          header: "Đăng bởi",
          filterFn: "contains",
        },
        {
          accessorKey: "CreatedDate",
          header: "Đăng ngày",
          filterFn: "contains",
          Cell: ({ cell }) =>
            cell.getValue<string>()
              ? dayjs(cell.getValue<string>()).format("DD/MM/YYYY")
              : undefined,
        },
        {
          accessorKey: "ApprovedDate",
          header: "Ngày xác nhận",
          filterFn: "contains",
          Cell: ({ cell }) =>
            cell.getValue<string>()
              ? dayjs(cell.getValue<string>()).format("DD/MM/YYYY")
              : undefined,
        },
        {
          header: "Trạng thái",
          Cell: ({ row }) =>
            row.original.ApprovedByUserId != null ? (
              row.original.ApprovedByUserId ? (
                <IconCheck color="green" />
              ) : (
                <IconX color="red" />
              )
            ) : (
              <IconInfoCircle />
            ),
        },
      ],
      useQuery: privateRoute.user.pending_post.byPage.useQuery,
      tableProps: {
        enableGrouping: false,
        enableRowSelection: false,
        enableMultiRowSelection: false,
        getRowId: (row) => row.Id,
        //enableRowActions: true,
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
        {/* <ModalEditPendingPost
          isOpen={openedModalUpdate && Boolean(selectedId)}
          editId={selectedId}
          handleClose={handleCloseModalUpdate}
        /> */}
      </>
    );
  },
});
