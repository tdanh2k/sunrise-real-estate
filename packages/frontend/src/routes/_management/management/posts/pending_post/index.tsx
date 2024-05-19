import { useMantineRTInstance } from "@components/MantineRT";
import { nprogress } from "@mantine/nprogress";
import { TypePendingPost } from "@sunrise-backend/src/schemas/PendingPost.schema";
import { IconCheck, IconInfoCircle, IconX, IconZoomCheck, IconZoomCheckFilled } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { privateRoute } from "@utils/trpc";
import { MantineReactTable } from "mantine-react-table";
import { useCallback, useState } from "react";
import { ModalVerifyPost } from "./-components/ModalVerifyPost";
import { CustomActionMenuItemPropsType, RenderCustomActionMenuItems } from "@components/MantineRT/RenderCustomActionMenuItems";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";

export const Route = createFileRoute(
  "/_management/management/posts/pending_post/"
)({
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
    const [selectedId, setSelectedId] = useState<string | undefined>("");
    const [
      openedModalVerify,
      { open: openModalVerify, close: closeModalVerify },
    ] = useDisclosure(false);
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

    const handleOpenModalVerify = useCallback(
      (Id: string | undefined) => () => {
        setSelectedId(Id);
        openModalVerify();
      },
      [openModalVerify]
    );

    const handleCloseModalVerify = () => {
      setSelectedId("");
      closeModalVerify();
    };

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

    const tableRowActions = useCallback(
      (Id: string | undefined): CustomActionMenuItemPropsType[] => [
        {
          id: "Verify",
          label: "Xác nhận",
          onClick: handleOpenModalVerify(Id),
          menuItemProps: {
            leftSection: <IconZoomCheck />,
          },
        },
        // {
        //   id: "Update",
        //   label: "Cập nhật",
        //   actionType: "Update",
        //   onClick: handleOpenModalUpdate(Id),
        // },
        // {
        //   id: "Remove",
        //   label: "Xóa",
        //   actionType: "Delete",
        //   onClick: handleOpenModalDelete(Id),
        // },
      ],
      [handleOpenModalVerify]
    );

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
      useQuery: privateRoute.management.pending_post.byPage.useQuery,
      //topToolbarActionObjectList: tableActions,
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
        <ModalVerifyPost
          isOpen={openedModalVerify && Boolean(selectedId)}
          postId={selectedId ?? ""}
          handleClose={handleCloseModalVerify}
        />
        {/* <ModalAddPost
          isOpen={openedModalAdd}
          handleClose={handleCloseModalAdd}
        /> */}
      </>
    );
  },
});
