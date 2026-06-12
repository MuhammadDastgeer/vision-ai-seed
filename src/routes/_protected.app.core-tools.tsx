import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/app/core-tools")({
  component: () => <Outlet />,
});
