import { redirect } from "@tanstack/react-router";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { createPrivateClient } from "@utils/trpc";
import { NotFoundComponent } from "../-components/NotFound";

export const Route = createFileRoute("/_management/management")({
  component: () => <Outlet />,
  notFoundComponent: () => <NotFoundComponent />,
  beforeLoad: async ({ context }) => {
    try {
      const response = await createPrivateClient(
        context.auth0
      ).management.verifyRoles.query({
        role_ids: [import.meta.env.VITE_ADMIN_ROLE_ID],
      });

      if (!response?.data)
        throw redirect({
          to: "/",
        });
    } catch (error) {
      console.log(error);
      throw redirect({
        to: "/",
      });
    }
  },
});
