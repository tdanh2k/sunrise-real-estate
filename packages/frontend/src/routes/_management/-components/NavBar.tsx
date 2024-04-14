import { FC } from "react";
import { AppShell, NavLink } from "@mantine/core";
import { IconGauge } from "@tabler/icons-react";
import { Link, Route } from "@tanstack/react-router";
import { routeTree } from "../../../routeTree.gen";

const NestedMenu: FC<{
  treeItem?: Route;
  index: number;
}> = ({ treeItem, index }) => {
  return treeItem?.children ? (
    treeItem?.fullPath !== treeItem.parentRoute.fullPath ? (
      <NavLink
        key={`${treeItem?.id}-${index}`}
        href="/#required-for-focus"
        label={treeItem?.to ?? treeItem?.path}
        title={treeItem?.to ?? treeItem?.path}
        leftSection={<IconGauge size="1rem" stroke={1.5} />}
        childrenOffset={28}
      >
        {(treeItem?.children as Route[])?.map((item2, index2) => (
          <NestedMenu key={item2.id} treeItem={item2} index={index2} />
        ))}
      </NavLink>
    ) : (
      (treeItem?.children as Route[])?.map((item2, index2) => (
        <NestedMenu key={item2.id} treeItem={item2} index={index2} />
      ))
    )
  ) : (
    <NavLink
      key={`${treeItem?.id}-${index}`}
      href={treeItem?.to ?? treeItem?.path ?? "#"}
      leftSection={<IconGauge size="1rem" stroke={1.5} />}
      label={treeItem?.to ?? treeItem?.path}
      title={treeItem?.to ?? treeItem?.path}
      renderRoot={(props) => (
        <Link to={treeItem?.to ?? treeItem?.path} {...props} />
      )}
    />
  );
};

export const NavBar: FC = () => {
  //console.log(routeTree.children?.filter((item) => item.id === "/_management"));
  return (
    <AppShell.Navbar p="md">
      {routeTree.children
        ?.filter((item) => item.id === "/_management")
        ?.map((item, index) => (
          <NestedMenu
            key={item.id}
            treeItem={item as unknown as Route}
            index={index}
          />
        ))}
    </AppShell.Navbar>
  );
};
