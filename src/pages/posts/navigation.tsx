import React, { Fragment } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, Button, Container, Group, Divider } from "@mantine/core";
import { UserButton } from "../components/userButton";
import { useRouter } from "next/router";
import {
  IconLogout,
  IconUser,
  IconCirclePlus,
  IconExternalLink,
  IconBrandTelegram,
} from "@tabler/icons";
import Image from "next/image";
import Logo from "../../../public/cubilose.png";
const navigation = [
  { name: "首页", href: "/", current: true },
  { name: "动态", href: "#", current: false },
  { name: "直播", href: "#", current: false },
  { name: "学习看板", href: "#", current: false },
];

export const Navigation = ({ userJson }: any) => {
  const router = useRouter();
  const user = userJson.json ? userJson.json : userJson;
  return (
    <>
      <Container size="xl">
        <Group position="apart">
          <Group position="left">
            <Image src={Logo} alt="团队logo" height={50} width={70}></Image>
            {navigation.map((item) => (
              <Button
                variant="subtle"
                key={item.name}
                onClick={() => {
                  router.push(item.href);
                }}
              >
                {item.name}
              </Button>
            ))}
          </Group>
          <Group position="right" spacing="xs">
            <Container sx={{ margin: 0 }}>
              <Menu
                width={200}
                shadow="md"
                transition="rotate-right"
                transitionDuration={150}
              >
                <Menu.Target>
                  <Button leftIcon={<IconCirclePlus />}>创作者空间</Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconBrandTelegram size={14} />}
                    component="a"
                    onClick={() => {
                      router.push("/posts/blogEditor");
                    }}
                  >
                    发表博客
                  </Menu.Item>

                  <Menu.Item
                    icon={<IconExternalLink size={14} />}
                    component="a"
                    href="https://mantine.dev"
                    target="_blank"
                  >
                    分享动态
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Container>

            <Container px={0} sx={{ margin: 0 }}>
              <Menu
                withArrow
                transition="rotate-right"
                transitionDuration={150}
              >
                <Menu.Target>
                  <UserButton
                    image={user?.avatar ?? ""}
                    name={user.username ?? ""}
                    email={user.email ?? ""}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconUser size={14} />}
                    component="a"
                    href="https://mantine.dev"
                  >
                    个人中心
                  </Menu.Item>

                  <Menu.Item
                    icon={<IconLogout size={14} />}
                    onClick={async () => {
                      await signOut();
                      signIn();
                    }}
                  >
                    账号登出
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Container>
          </Group>
        </Group>
      </Container>
    </>
  );
};
export default Navigation;
