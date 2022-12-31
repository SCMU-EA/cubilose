import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  Input,
  Container,
  Text,
  Divider,
} from "@mantine/core";
import Link from "next/link";
import { getCsrfToken } from "next-auth/react";
import { NextPage } from "next";
import Image from "next/image";
import Logo from "../../../public/cubilose.png";
import { useRouter } from "next/router";
const Login: NextPage = ({ csrfToken }: any) => {
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
        <Group spacing="xs">
          <Text size="sm" color="dimmed">
            没有账号？请
          </Text>
          <Link href="/posts/register">注册</Link>
        </Group>

        <Box sx={{ minWidth: 300 }} mx="auto">
          <form method="POST" action="/api/auth/callback/credentials">
            <Input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <TextInput
              name="email"
              type="email"
              withAsterisk
              label="Email"
              placeholder="请输入邮箱"
            />
            <TextInput
              name="password"
              type="password"
              withAsterisk
              label="密码"
              placeholder="请输入你的密码"
            />

            <Group position="center" mt="md">
              <Button type="submit">登录</Button>
            </Group>
          </form>
        </Box>
        <Container>
          <Divider
            my="md"
            label="或者，你可以选择邮箱验证"
            labelPosition="center"
          ></Divider>
        </Container>

        <Box>
          <form method="POST" action="/api/auth/signin/email">
            <Input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <TextInput
              name="email"
              type="email"
              withAsterisk
              label="Email"
              placeholder="请输入邮箱"
            />

            <Group position="center" mt="md">
              <Button type="submit">发送验证邮件</Button>
            </Group>
          </form>
        </Box>
      </Flex>
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
