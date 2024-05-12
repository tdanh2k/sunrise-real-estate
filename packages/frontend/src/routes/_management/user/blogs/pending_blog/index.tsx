import { useMantineRTInstance } from "@components/MantineRT";
import { nprogress } from "@mantine/nprogress";
import { TypePendingBlog } from "@sunrise-backend/src/schemas/PendingBlog.schema";
import { IconCheck, IconInfoCircle, IconX, IconZoomCheck } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import dayjs from "dayjs";
import { MantineReactTable } from "mantine-react-table";

export const Route = createFileRoute("/_management/user/blogs/pending_blog/")({
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

    // const handleOpenModalDelete = (Id?: string) => () => {
    //   setSelectedId(Id);
    //   openModalDelete();
    // };

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

    const table = useMantineRTInstance<TypePendingBlog>({
      columns: [
        {
          accessorKey: "Title",
          header: "Tiêu đề",
          filterFn: "contains",
        },
        {
          accessorKey: "GlobalBlogType.Name",
          header: "Thuộc loại",
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
      useQuery: privateRoute.user.pending_blog.byPage.useQuery,
      //topToolbarActionObjectList: tableActions,
      tableProps: {
        enableGrouping: false,
        enableRowSelection: false,
        enableMultiRowSelection: false,
        getRowId: (row) => row.Id,
      },
    });

    return (
      <>
        <MantineReactTable table={table} />
        {/* <ModalAddPendingBlog
          isOpen={openedModalAdd}
          handleClose={handleCloseModalAdd}
        />
        <CustomDeleteModal
          isOpen={openedModalDelete}
          handleClose={handleCloseModalDelete}
          data={{ Id: selectedId ?? "" }}
          useMutation={privateRoute.user.pending_blog.delete.useMutation}
        /> */}
      </>
    );
  },
});
