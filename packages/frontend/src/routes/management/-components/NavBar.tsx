import { FC } from "react";
import { AppShell, NavLink } from "@mantine/core";
import { IconGauge } from "@tabler/icons-react";

export const NavBar: FC = () => {
  return (
    <AppShell.Navbar p="md">
      Navbar
      {/* {Array(15)
        .fill(0)
        .map((_, index) => (
          <Skeleton key={index} h={28} mt="sm" animate={false} />
        ))} */}
      <NavLink
        href="#required-for-focus"
        label="With right section"
        leftSection={<IconGauge size="1rem" stroke={1.5} />}
      />
      <NavLink
        href="#required-for-focus"
        label="First parent link"
        leftSection={<IconGauge size="1rem" stroke={1.5} />}
        childrenOffset={28}
      >
        <NavLink href="#required-for-focus" label="First child link" />
        <NavLink label="Second child link" href="#required-for-focus" />
        <NavLink
          label="Nested parent link"
          childrenOffset={28}
          href="#required-for-focus"
        >
          <NavLink label="First child link" href="#required-for-focus" />
          <NavLink label="Second child link" href="#required-for-focus" />
          <NavLink label="Third child link" href="#required-for-focus" />
        </NavLink>
      </NavLink>
    </AppShell.Navbar>
  );
};
