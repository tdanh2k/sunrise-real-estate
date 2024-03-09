import { createLazyFileRoute } from "@tanstack/react-router";

export const ManagementIndex = () => {
    return <>Management</>
}

export const Route = createLazyFileRoute("/management/")({
    component: ManagementIndex,
  });