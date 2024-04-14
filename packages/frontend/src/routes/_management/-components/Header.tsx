import { ComponentPropsWithoutRef, FC, forwardRef } from "react";

import {
  AppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  Text,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import {
  IconChevronRight,
  IconMessageCircle,
  IconPhoto,
  IconSettings,
} from "@tabler/icons-react";

interface UserButtonProps extends ComponentPropsWithoutRef<"button"> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      // style={{
      //   padding: "var(--mantine-spacing-md)",
      //   color: "var(--mantine-color-text)",
      //   borderRadius: "var(--mantine-radius-sm)",
      // }}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {/* {icon || <IconChevronRight size="1rem" />} */}
      </Group>
    </UnstyledButton>
  )
);

export const Header: FC<{ opened: boolean; toggle: () => void }> = ({
  opened,
  toggle,
}) => {
  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <MantineLogo size={30} />
        </Group>
        <Menu withArrow>
          <Menu.Target>
            <UserButton
              image="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
              name="Harriette Spoonlicker"
              email="hspoonlicker@outlook.com"
            />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={
                <IconSettings style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Settings
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconMessageCircle
                  style={{ width: rem(14), height: rem(14) }}
                />
              }
            >
              Messages
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconPhoto style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Gallery
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </AppShell.Header>
  );
};
