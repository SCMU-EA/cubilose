import React, { useEffect, MutableRefObject, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, Button, Container, Group, Input } from "@mantine/core";
import { UserButton } from "./userButton";
import { useRouter } from "next/router";
import { User } from "../../types/user";
import {
  IconLogout,
  IconUser,
  IconCirclePlus,
  IconExternalLink,
  IconBrandTelegram,
  IconSearch,
} from "@tabler/icons";

import Image from "next/image";
import Logo from "../../../public/cubilose.png";

const navigation = [
  { name: "首页", href: "/", current: true },
  { name: "动态", href: "/posts/dynamic", current: false },
  { name: "热门教学视频", href: "/posts/videos", current: false },
  { name: "工具箱", href: "/posts/tools", current: false },
];

const Navigation = ({
  user,
  getSearchData,
}: {
  user: User;
  getSearchData?: (data: string) => void;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rout, setRout] = useState<boolean>();
  const session = useSession().data;
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputRef: MutableRefObject<any> = useRef(null);
  let searchData: string;
  useEffect(() => {
    navigation.forEach((item) => {
      item.current = item.href === router.asPath ? true : false;
    });
    setRout(true);
  }, [router.asPath]);

  return (
    <>
      <Container size="xl">
        <Group position="apart">
          <Group position="left">
            <Image
              src={Logo}
              quality="4"
              alt="团队logo"
              height={50}
              width={70}
            ></Image>
            {navigation.map((item) => (
              <Button
                variant={item.current ? "light" : "subtle"}
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
            <form
              onSubmit={
                getSearchData
                  ? (event) => {
                      event.preventDefault();
                      getSearchData(searchData);
                      inputRef.current.value = "";
                    }
                  : undefined
              }
            >
              <Input
                icon={<IconSearch />}
                ref={inputRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  searchData = event.target.value;
                }}
              ></Input>
            </form>

            {user ? (
              <>
                <Container sx={{ margin: 0 }}>
                  <Menu
                    width={200}
                    shadow="md"
                    transition="rotate-right"
                    transitionDuration={150}
                  >
                    <Menu.Target>
                      <Button
                        leftIcon={<IconCirclePlus />}
                        onClick={() => {
                          if (!session) alert("请登录");
                        }}
                      >
                        创作者空间
                      </Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        icon={<IconBrandTelegram size={14} />}
                        component="a"
                        href="/posts/blogEditor"
                        target="_blank"
                      >
                        发表博客
                      </Menu.Item>

                      <Menu.Item
                        icon={<IconExternalLink size={14} />}
                        component="a"
                        href="/posts/dynamic"
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
                        name={user?.username ?? ""}
                        email={user?.email ?? ""}
                      />
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        icon={<IconUser size={14} />}
                        component="a"
                        onClick={() => {
                          router.push({
                            pathname: "/posts/personal/[userId]",
                            query: { userId: user.id },
                          });
                        }}
                      >
                        个人中心
                      </Menu.Item>

                      <Menu.Item
                        icon={<IconLogout size={14} />}
                        onClick={async () => {
                          await signOut();
                        }}
                      >
                        账号登出
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Container>
              </>
            ) : (
              <Button
                variant="subtle"
                onClick={() => signIn("", { callbackUrl: "/" })}
              >
                登录
              </Button>
            )}
          </Group>
        </Group>
      </Container>
    </>
  );
};

export default Navigation;
