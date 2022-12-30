import { signIn } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { CheckIcon } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { TextInput, Button, Group, Box, Flex, Container } from "@mantine/core";
import { useForm } from "@mantine/form";

import { NextPage } from "next";
import Image from "next/image";
import Logo from "../../../public/cubilose.png";
export const Register: NextPage = () => {
  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      rePassword: "",
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      username: (value) =>
        value.length < 3 || value.length > 8 ? "用户名长度只能在3-8位" : null,
      password: (value) => (value.length < 3 ? "密码输入不规范" : null),
    },
  });

  const router = useRouter();

  const { isLoading, mutate } = trpc.auth.registerUser.useMutation({
    onSuccess() {
      showNotification({
        id: "register-success",
        color: "teal",
        title: "注册成功，正在跳转登录界面",
        message: "您已成功注册，正在跳转至主页面",
        icon: <CheckIcon />,
        autoClose: 2000,
      });

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
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    form.validate();
    if (
      form.getInputProps("password").value !==
      form.getInputProps("rePassword").value
    ) {
      showNotification({
        id: "password-error",
        color: "red",
        title: "密码输入不一致",
        message: "",
        autoClose: 2000,
      });
      return;
    }
    const initAvatarUrl =
      "http://124.223.220.83:9000/image/a9511243-cafd-48dc-99b3-1d40f0432272.jpg";

    const registerInfo = {
      email: form.getInputProps("email").value,
      username: form.getInputProps("username").value,
      password: form.getInputProps("password").value,
      description: "这个人很懒什么都没有留下",
      avatar: initAvatarUrl,
    };
    if (form.isValid()) mutate(registerInfo);
  };

  return (
    <>
      <Flex
        justify="center"
        align="center"
        direction="column"
        gap={4}
        mih={600}
        wrap="wrap"
      >
        <Image src={Logo} width={120} height={90} alt="logo"></Image>
        <Container>
          <Button
            variant="subtle"
            onClick={() => {
              signIn();
            }}
          >
            返回登录界面
          </Button>
        </Container>
        <Box sx={{ minWidth: 300 }} mx="auto">
          <form onSubmit={submit}>
            <TextInput
              name="email"
              withAsterisk
              label="Email"
              placeholder="请输入邮箱"
              {...form.getInputProps("email")}
            />
            <TextInput
              name="usename"
              type="text"
              withAsterisk
              label="用户名"
              placeholder="请输入用户名"
              {...form.getInputProps("username")}
            />
            <TextInput
              name="password"
              type="password"
              withAsterisk
              label="密码"
              placeholder="请输入你的密码"
              {...form.getInputProps("password")}
            />
            <TextInput
              name="rePassword"
              type="password"
              withAsterisk
              label="确认密码"
              placeholder="请输入你的密码"
              {...form.getInputProps("rePassword")}
            />

            <Group position="center" mt="md">
              <Button loading={isLoading} type="submit">
                注册
              </Button>
            </Group>
          </form>
        </Box>
      </Flex>
      );
    </>
  );
};
export default Register;
