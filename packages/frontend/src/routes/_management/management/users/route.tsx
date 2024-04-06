import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_management/management/users')({
  component: () => <Outlet />
})