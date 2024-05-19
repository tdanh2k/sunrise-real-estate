import { Outlet, createFileRoute } from "@tanstack/react-router";
import { NotFoundComponent } from "../../-components/NotFound";
import { IconScript } from "@tabler/icons-react";

export const Route = createFileRoute("/_management/management")({
  staticData: {
    routeName: "Admin",
    icon: <IconScript />,
    required_role: import.meta.env.VITE_ADMIN_ROLE_ID,
  },
  component: () => <Outlet />,
  notFoundComponent: NotFoundComponent,
  // beforeLoad: async ({ context }) => {
  //   try {
  //     const response = await createPrivateClient(
  //       context.auth0
  //     ).management.verifyRoles.query({
  //       role_ids: [import.meta.env.VITE_ADMIN_ROLE_ID],
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
