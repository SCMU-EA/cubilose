import { LockClosedIcon } from "@heroicons/react/20/solid";
// import { useState } from "react";
// import { trpc } from "../../utils/trpc";
// import { showNotification } from "@mantine/notifications";
// import { CheckIcon } from "@mantine/core";
import { Button } from "@mantine/core";
import { useRouter } from "next/router";
// import type { User } from "../../types/utils";
import { getCsrfToken } from "next-auth/react";
import { Divider } from "@mantine/core";
import { NextPage } from "next";
const Login: NextPage = ({ csrfToken }: any) => {
  // const [loginInfo, setLoginInfo] = useState<User>({
  //   email: "",
  //   password: "",
  //   username: "",
  // });
  const router = useRouter();
  // const inputOberver = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setLoginInfo({
  //     ...loginInfo,
  //     [event.target.name]: event.target.value,
  //   });
  // };

  // const { isLoading, mutate } = trpc.auth.getUser.useMutation({
  //   onSuccess() {
  //     showNotification({
  //       id: "login-success",
  //       color: "teal",
  //       title: "登录成功",
  //       message: "您已成功登录，正在跳转至主页面",
  //       icon: <CheckIcon />,
  //       autoClose: 2000,
  //     });
  //     const user = {
  //       email: loginInfo.email,
  //     };
  //     window.localStorage.setItem("user", JSON.stringify(user));
  //     setUser();
  //   },
  //   onError() {
  //     showNotification({
  //       id: "login-error",
  //       color: "red",
  //       title: "登录失败",
  //       message: "用户名或密码错误",
  //       autoClose: 2000,
  //     });
  //   },
  // });

  // const submit = (event: React.FormEvent) => {
  //   // event.preventDefault();
  //   // mutate(loginInfo);
  // };
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
              登录你的账号
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              或者{" "}
              <button
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => {
                  router.push("/posts/register");
                }}
              >
                注册一个新用户
              </button>
            </p>
          </div>
          <form
            className="mt-8 space-y-6"
            method="POST"
            action="/api/auth/callback/credentials"
            // onSubmit={(e) => submit(e)}
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="space-y-6 rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  邮箱
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="请输入电子邮件"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="请输入密码"
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
                  记住我
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  忘记密码?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                登录
              </Button>
            </div>
          </form>
          <Divider
            my="md"
            label="或者你可以使用邮箱进行验证登录"
            labelPosition="center"
          />
          <form
            className="mt-8 space-y-6"
            method="POST"
            action="/api/auth/signin/email"
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  邮箱
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="请输入电子邮件"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                登录
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default Login;
