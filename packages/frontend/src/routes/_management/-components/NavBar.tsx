import { FC } from "react";
import { AppShell, NavLink } from "@mantine/core";
import { IconGauge } from "@tabler/icons-react";
import { Link, Route } from "@tanstack/react-router";
import { routeTree } from "../../../routeTree.gen";
import { privateRoute } from "@utils/trpc";

const NestedMenu: FC<{
  treeItem?: Route;
  index: number;
  roles?: {
    id: string;
    name: string;
    description: string;
  }[];
}> = ({ treeItem, index, roles }) => {
  return treeItem?.options?.staticData?.required_role == null ||
    roles?.some(
      (r) => r.id === treeItem?.options?.staticData?.required_role
    ) ? (
    treeItem?.children ? (
      treeItem?.fullPath !== treeItem.parentRoute.fullPath ? (
        <NavLink
          key={`${treeItem?.id}-${index}`}
          href="/#required-for-focus"
          label={treeItem?.options?.staticData?.routeName ?? treeItem?.path}
          title={treeItem?.options?.staticData?.routeName ?? treeItem?.path}
          leftSection={
            treeItem?.options?.staticData?.icon ?? (
              <IconGauge size="1rem" stroke={1.5} />
            )
          }
          childrenOffset={28}
        >
          {(treeItem?.children as Route[])?.map((item2, index2) => (
            <NestedMenu
              key={item2.id}
              treeItem={item2}
              index={index2}
              roles={roles}
            />
          ))}
        </NavLink>
      ) : (
        (treeItem?.children as Route[])?.map((item2, index2) => (
          <NestedMenu
            key={item2.id}
            treeItem={item2}
            index={index2}
            roles={roles}
          />
        ))
      )
    ) : (
      <NavLink
        key={`${treeItem?.id}-${index}`}
        href={treeItem?.to ?? treeItem?.path ?? "#"}
        leftSection={
          treeItem?.options?.staticData?.icon ?? (
            <IconGauge size="1rem" stroke={1.5} />
          )
        }
        label={treeItem?.options?.staticData?.routeName ?? treeItem?.path}
        title={treeItem?.options?.staticData?.routeName ?? treeItem?.path}
        renderRoot={(props) => (
          <Link to={treeItem?.to ?? treeItem?.path} {...props} />
        )}
      />
    )
  ) : null;
};

export const NavBar: FC = () => {
  const [{ data }] =
    privateRoute.management.getCurrentUserRoles.useSuspenseQuery();
  return (
    <AppShell.Navbar p="md">
      {(
        (routeTree.children as unknown as Array<Route>)?.[1]
          ?.children as unknown as Array<Route>
      )?.map((item, index) => (
        <NestedMenu
          key={item.id}
          treeItem={item as unknown as Route}
          index={index}
          roles={data}
        />
      ))}
    </AppShell.Navbar>
  );
};
