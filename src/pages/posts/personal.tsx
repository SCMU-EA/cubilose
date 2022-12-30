import {
  Container,
  Modal,
  Textarea,
  Space,
  Text,
  Stack,
  Grid,
  Input,
  Flex,
  useMantineTheme,
  Tabs,
  Button,
} from "@mantine/core";
import { serialize } from "superjson";
import { showNotification } from "@mantine/notifications";
import { CheckIcon } from "@mantine/core";

import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import Navigation from "../components/navigation";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { trpc } from "../../utils/trpc";
import BlogList from "../components/blog/blogList";
import DynamicList from "../components/dynamic/dynamicList";
export const PersonalSide = ({ user }: any) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(user.avatar);
  const [file, setFile] = useState<File>();

  const modalForm = useForm({
    initialValues: {
      username: user.username,
      password: user.password,
      rePassword: user.password,
      description: user.description,
    },

    validate: {
      username: (value) =>
        value.length < 3 || value.length > 8 ? "用户名长度只能在3-8位" : null,
      password: (value) => (value.length < 3 ? "密码输入不规范" : null),
    },
  });
  const { isLoading, mutate } = trpc.user.updateUserMsg.useMutation({
    onSuccess() {
      showNotification({
        id: "register-success",
        color: "teal",
        title: "修改成功",
        message: "您已成功修改，正在跳转至个人中心",
        icon: <CheckIcon />,
        autoClose: 2000,
      });
      setOpened(false);
    },
    onError() {
      showNotification({
        id: "register-error",
        color: "red",
        title: "修改失败",
        message: "修改失败，请注意输入",
        autoClose: 2000,
      });
    },
  });
  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target?.files[0]) {
        setFile(e.target.files[0]);
      }
    }
  };
  const onSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("picture", file);
      const res = await fetch("http://localhost:3000/api/uploadImage", {
        method: "POST",
        body: formData,
      });
      res.json().then((r) => {
        setAvatar(r?.imageUrl);
      });
    }
    modalForm.validate();
    if (
      modalForm.getInputProps("password").value !==
      modalForm.getInputProps("rePassword").value
    ) {
      showNotification({
        id: "register-error",
        color: "red",
        title: "修改失败",
        message: "两次密码不一致",
        autoClose: 2000,
      });
      return;
    }
    if (modalForm.isValid())
      await mutate({
        id: user.id,
        username: modalForm.getInputProps("username").value,
        password: modalForm.getInputProps("password").value,
        description: modalForm.getInputProps("description").value,
        avatar: avatar,
      });
  };
  return (
    <>
      <Navigation user={user}></Navigation>
      <Container size="xl" bg="#dbdada4c">
        <Flex
          mih={750}
          gap="sm"
          justify="flex-start"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Space></Space>

          <Container bg="white" w={750}>
            <Space h={10}></Space>
            <Grid>
              <Grid.Col span={3}>
                <Image
                  src={user.avatar}
                  width={400}
                  height={400}
                  style={{ borderRadius: 20 }}
                  alt="avatar"
                ></Image>
              </Grid.Col>
              <Grid.Col span={5}>
                <Stack>
                  <Text fz="xl">{user.username}</Text>
                  <Text fz="sm" c="dimmed" fs="italic">
                    {user.description}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={4}>
                <Stack justify="center">
                  <Space h={100}></Space>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpened(true);
                    }}
                  >
                    编辑资料
                  </Button>
                </Stack>
              </Grid.Col>
            </Grid>
          </Container>
          <Container w={750} bg="white">
            <Tabs defaultValue="blog">
              <Tabs.List>
                <Tabs.Tab value="blog">文章</Tabs.Tab>
                <Tabs.Tab value="dynamic">动态</Tabs.Tab>
                <Tabs.Tab value="follow">关注</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="blog" pt="xs">
                <BlogList userId={user.id}></BlogList>
              </Tabs.Panel>

              <Tabs.Panel value="dynamic" pt="xs">
                <DynamicList userId={user.id}></DynamicList>
              </Tabs.Panel>

              <Tabs.Panel value="settings" pt="xs">
                Settings tab content
              </Tabs.Panel>
            </Tabs>
          </Container>
        </Flex>
        <Modal
          size="xl"
          opened={opened}
          onClose={() => {
            setOpened(false);
          }}
          overlayColor={
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2]
          }
          overlayOpacity={0.55}
          overlayBlur={3}
          title={"编辑个人信息"}
        >
          <Container>
            <Grid>
              <Grid.Col span={2} offset={-1}>
                <Text align="right" c="dimmed">
                  用户名:
                </Text>
              </Grid.Col>

              <Grid.Col span={11}>
                <Input
                  name="username"
                  type="text"
                  withAsterisk
                  placeholder={user.username}
                  {...modalForm.getInputProps("username")}
                />
              </Grid.Col>
              <Grid.Col span={1}>
                <Text align="right" c="dimmed">
                  密码:
                </Text>
              </Grid.Col>
              <Grid.Col span={11}>
                <Input
                  name="username"
                  type="password"
                  withAsterisk
                  placeholder="请输入密码"
                  {...modalForm.getInputProps("password")}
                />
              </Grid.Col>
              <Grid.Col span={2} c="dimmed" offset={-1}>
                <Text align="right">确认密码:</Text>
              </Grid.Col>
              <Grid.Col span={11}>
                <Input
                  name="reusername"
                  type="password"
                  withAsterisk
                  placeholder="请再次输入密码"
                  {...modalForm.getInputProps("rePassword")}
                />
              </Grid.Col>
              <Grid.Col span={2} offset={-1}>
                <Text align="right" c="dimmed">
                  上传头像:
                </Text>
              </Grid.Col>
              <Grid.Col span={11}>
                <input
                  type="file"
                  id="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onUpload(e)
                  }
                ></input>
              </Grid.Col>
              <Grid.Col span={2} offset={-1}>
                <Text align="right" c="dimmed">
                  自我描述:
                </Text>
              </Grid.Col>
              <Grid.Col span={10}>
                <Textarea
                  placeholder={user.description}
                  autosize
                  minRows={4}
                  withAsterisk
                  {...modalForm.getInputProps("description")}
                />
              </Grid.Col>
              <Grid.Col span={2} offset={10}>
                <Button
                  loading={isLoading}
                  variant="outline"
                  onClick={onSubmit}
                >
                  确认
                </Button>
              </Grid.Col>
            </Grid>
          </Container>
        </Modal>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );
  if (!session) {
    return { props: { user: null, blog: null } };
  }
  const userModel = await prisma?.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    select: {
      username: true,
      email: true,
      id: true,
      description: true,
      password: true,
      avatar: true,
    },
  });

  const user = await serialize(userModel).json;

  return {
    props: { user },
  };
};

export default PersonalSide;
