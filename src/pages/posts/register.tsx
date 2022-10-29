import { CheckIcon } from "@mantine/core";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import type { User } from "../../types/utils";
import { useRouter } from "next/router";
import { Button } from "@mantine/core";
export default function Register() {
  const [registerInfo, setRegisterInfo] = useState<User>({
    email: "",
    username: "",
    password: "",
  });
  const router = useRouter();
  const inputOberver = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInfo({
      ...registerInfo,
      [event.target.name]: event.target.value,
    });
  };
  const { isLoading, mutate } = trpc.auth.registerUser.useMutation({
    onSuccess() {
      showNotification({
        id: "register-success",
        color: "teal",
        title: "注册成功",
        message: "您已成功注册，正在跳转至主页面",
        icon: <CheckIcon />,
        autoClose: 2000,
      });
      const user = {
        email: registerInfo.email,
        username: registerInfo.username,
      };
      window.localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    },
    onError() {
      showNotification({
        id: "register-error",
        color: "red",
        title: "注册失败",
        message: "邮箱已注册",
        autoClose: 2000,
      });
    },
  });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    mutate(registerInfo);
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Register to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <a
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => {
                  router.push("/");
                }}
              >
                Login
              </a>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={(event) => submit(event)}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="space-y-6 rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  onChange={(e) => inputOberver(e)}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  username
                </label>
                <input
                  id="user-name"
                  name="username"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="user name"
                  onChange={(e) => inputOberver(e)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                  onChange={(e) => inputOberver(e)}
                />
              </div>
            </div>

            <div>
              <Button
                loading={isLoading}
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
