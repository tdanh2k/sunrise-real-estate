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
import { IconLogout } from "@tabler/icons-react";
import { useAuth0 } from "@auth0/auth0-react";

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
  const { user, logout } = useAuth0();
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
              //image="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
              image={
                user?.picture ??
                "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
              }
              //name={`${user?.family_name} ${user?.given_name}`}
              name={`Xin chào, ${user?.name}`}
              email={user?.email ?? ""}
            />
          </Menu.Target>
          <Menu.Dropdown>
            {/* <Menu.Item
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
            </Menu.Item> */}
            <Menu.Item
              leftSection={
                <IconLogout style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => {
                if (!window.confirm("Bạn muốn đăng xuất?")) return;

                window.localStorage.clear();
                logout({ logoutParams: { federated: true } });
              }}
            >
              Đăng xuất
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </AppShell.Header>
  );
};
