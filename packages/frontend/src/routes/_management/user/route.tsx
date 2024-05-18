import { IconUser } from "@tabler/icons-react";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_management/user")({
  staticData: {
    routeName: "Người dùng",
    icon: <IconUser />,
    required_role: import.meta.env.VITE_USER_ROLE_ID,
  },
  component: () => <Outlet />,
  // beforeLoad: async ({ context }) => {
  //   try {
  //     const response = await createPrivateClient(
  //       context.auth0
  //     ).management.verifyRoles.query({
  //       role_ids: [
  //         import.meta.env.VITE_USER_ROLE_ID,
  //         import.meta.env.VITE_ADMIN_ROLE_ID,
  //       ],
  //     });

  //     if (!response?.data)
  //       throw redirect({
  //         to: "/",
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     throw redirect({
  //       to: "/",
  //     });
  //   }
  // },
});
