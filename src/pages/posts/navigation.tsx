import React, { Fragment } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, Button } from "@mantine/core";
import { UserButton } from "../components/userButton";
import { useRouter } from "next/router";
import {
  IconLogout,
  IconUser,
  IconCirclePlus,
  IconExternalLink,
  IconBrandTelegram,
} from "@tabler/icons";
import { NextPage } from "next";
import { trpc } from ".././../utils/trpc";

const navigation = [
  { name: "首页", href: "/", current: true },
  { name: "动态", href: "#", current: false },
  { name: "直播", href: "#", current: false },
  { name: "学习看板", href: "#", current: false },
];

//todo classes Type insert
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const Navigation: NextPage = () => {
  const { data: userData } = useSession();
  const router = useRouter();

  const user = trpc.user.getUserMsg.useQuery({
    id: userData?.user?.id as string,
  });
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium",
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <Menu
                width={200}
                shadow="md"
                transition="rotate-right"
                transitionDuration={150}
              >
                <Menu.Target>
                  <Button color="gray" leftIcon={<IconCirclePlus />}>
                    创作者空间
                  </Button>
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div>
                <Menu
                  withArrow
                  transition="rotate-right"
                  transitionDuration={150}
                >
                  <Menu.Target>
                    <UserButton
                      image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                      name={user.data?.username || ""}
                      email={user.data?.email || ""}
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
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium",
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
