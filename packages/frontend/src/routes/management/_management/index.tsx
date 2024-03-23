import { createFileRoute } from "@tanstack/react-router";

export const Dashboard = () => {
  return <></>;
};

export const Route = createFileRoute("/management/_management/")({
  component: Dashboard,
});
