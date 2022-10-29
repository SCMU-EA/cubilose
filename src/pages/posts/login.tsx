import { signIn } from "next-auth/react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import { CheckIcon } from "@mantine/core";
import { Button } from "@mantine/core";
import { useRouter } from "next/router";
import type { User } from "../../types/utils";
export default function Login({ setUser }) {
  const [loginInfo, setLoginInfo] = useState<User>({
    email: "",
    password: "",
    username: "",
  });
  const router = useRouter();
  const inputOberver = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({
      ...loginInfo,
      [event.target.name]: event.target.value,
    });
  };

  const { isLoading, mutate } = trpc.auth.getUser.useMutation({
    onSuccess() {
      showNotification({
        id: "login-success",
        color: "teal",
        title: "登录成功",
        message: "您已成功登录，正在跳转至主页面",
        icon: <CheckIcon />,
        autoClose: 2000,
      });
      const user = {
        email: loginInfo.email,
      };
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser();
    },
    onError() {
      showNotification({
        id: "login-error",
        color: "red",
        title: "登录失败",
        message: "用户名或密码错误",
        autoClose: 2000,
      });
    },
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    mutate(loginInfo);
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
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <a
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => signIn()}
              >
                Login with your Email
              </a>
            </p>
          </div>
          <form
            className="mt-8 space-y-6"
            action="#"
            method="POST"
            onSubmit={(e) => submit(e)}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
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
                Sign in
              </Button>
            </div>
            <div>
              <button
                onClick={() => {
                  router.push("/posts/register");
                }}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
