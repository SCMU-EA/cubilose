import { signIn } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { CheckIcon } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { TextInput, Button, Group, Box, Flex, Container } from "@mantine/core";
import { useForm } from "@mantine/form";

import { NextPage } from "next";
import Image from "next/image";
import Logo from "../../../public/cubilose.png";
import cuid from "cuid";
export const Register: NextPage = () => {
  const userId = cuid();
  console.log(userId);
  const form = useForm({
    initialValues: {
      id: userId,
      email: "",
      username: "",
      password: "",
      description: "这个人很懒什么都没有留下",
      rePassword: "",
      avatar: "http://127.0.0.1:9000/image/hacker.jpg",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      username: (value) =>
        value.length < 3 || value.length > 8 ? "用户名长度只能在3-8位" : null,
      password: (value) => (value.length < 3 ? "密码输入不规范" : null),
      rePassword: (value, values) =>
        value !== values.password ? "密码输入不一致" : null,
    },
  });
  const { mutate: initRelation } =
    trpc.userRelation.createRelations.useMutation();
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
      initRelation({ userId: form.values.id });
      signIn("", { callbackUrl: "/" });
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
    if (form.isValid()) {
      mutate(form.values);
    }
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
