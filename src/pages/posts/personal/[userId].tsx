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
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import { appRouter } from "../../../server/trpc/router/_app";
import { createContextInner } from "../../../server/trpc/context";
import superjson from "superjson";
import { prisma } from "../../../server/db/client";

import { showNotification } from "@mantine/notifications";
import { CheckIcon } from "@mantine/core";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import Navigation from "../../components/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { trpc } from "../../../utils/trpc";
import BlogList from "../../components/blog/blogList";
import DynamicList from "../../components/dynamic/dynamicList";
import type { User } from "../../../types/user";
import { useSession } from "next-auth/react";
import RelationList from "../../components/relation/relationList";
export const PersonalSide = (
  props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const session = useSession().data;
  const userId: string = props.id;
  const userData: User = trpc.user.getUserMsg.useQuery({ id: userId })
    .data as User;
  const host: User = trpc.user.getUserMsg.useQuery({
    id: session?.user?.id ?? "",
  }).data as User;
  const isRuler: boolean = session?.user?.id === userId;
  let avatar: string = userData?.avatar ?? "";
  const relations: { followings: string } =
    trpc.userRelation.getRelations.useQuery({
      userId: session?.user?.id ?? "",
      type: "follow",
    }).data as { followings: string };
  const followingsArr = JSON.parse(relations?.followings ?? "[]");
  const [isFollow, setIsFollow] = useState<boolean>();
  useEffect(() => {
    setIsFollow(followingsArr.includes(userId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relations]);
  const form = useForm({
    initialValues: {
      username: userData?.username ?? "",
      password: "",
      rePassword: "",
      description: userData?.description ?? "",
    },

    validate: {
      username: (value: string) =>
        value.length < 3 || value.length > 8 ? "用户名长度只能在3-8位" : null,
      password: (value: string) => (value.length < 3 ? "密码输入不规范" : null),
      rePassword: (value: string) =>
        value.length < 3 ? "密码输入不规范" : null,
      description: (value: string) =>
        value.length === 0 ? "自我描述不能为空" : null,
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
  const { mutate: changeFollowing } =
    trpc.userRelation.updateRelations.useMutation({});
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
      await res.json().then((r) => {
        avatar = r?.imageUrl;
      });
    }
    form.validate();
    if (
      form.getInputProps("password").value !==
      form.getInputProps("rePassword").value
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
    if (form.isValid())
      await mutate({
        id: userId,
        username: form.getInputProps("username").value,
        password: form.getInputProps("password").value,
        description: form.getInputProps("description").value,
        avatar,
      });
  };
  const test = async () => {
    await fetch("www.baidu.com");
  };

  useEffect(() => {
    async () => {
      await test();
    };
  }, []);

  return (
    <>
      <Navigation user={host}></Navigation>
      {userData ? (
        <Container size="xl" bg="#dbdada4c">
          <Flex
            gap="sm"
            justify="flex-start"
            mih={750}
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
                    src={userData.avatar ?? ""}
                    width={400}
                    height={400}
                    style={{ borderRadius: 20 }}
                    alt="avatar"
                  ></Image>
                </Grid.Col>
                <Grid.Col span={5}>
                  <Stack>
                    <Text fz="xl">{userData.username}</Text>
                    <Text c="blue">{userData.email}</Text>
                    <Text fz="sm" c="dimmed" fs="italic">
                      {userData.description}
                    </Text>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack justify="center">
                    <Space h={100}></Space>
                    {session ? (
                      isRuler ? (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setOpened(true);
                          }}
                        >
                          编辑资料
                        </Button>
                      ) : (
                        <Button
                          variant={isFollow ? "default" : "outline"}
                          c={isFollow ? "gray" : "blue"}
                          onClick={() => {
                            if (isFollow) {
                              changeFollowing({
                                userId: session?.user?.id ?? "",
                                following: userId,
                                operate: "remove",
                              });
                              changeFollowing({
                                userId: userId,
                                fan: session?.user?.id ?? "",
                                operate: "remove",
                              });
                            } else {
                              changeFollowing({
                                userId: session?.user?.id ?? "",
                                following: userId,
                                operate: "add",
                              });
                              changeFollowing({
                                userId: userId,
                                fan: session?.user?.id ?? "",
                                operate: "add",
                              });
                            }
                            setIsFollow(!isFollow);
                          }}
                        >
                          {isFollow ? "已关注" : "关注"}
                        </Button>
                      )
                    ) : undefined}
                  </Stack>
                </Grid.Col>
              </Grid>
            </Container>
            <Container w={750} bg="white">
              <Tabs defaultValue="blog">
                <Tabs.List>
                  <Tabs.Tab value="blog">文章</Tabs.Tab>
                  <Tabs.Tab value="dynamic">动态</Tabs.Tab>
                  <Tabs.Tab value="followings">关注</Tabs.Tab>
                  <Tabs.Tab value="fans">粉丝</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="blog" pt="xs">
                  <BlogList userId={userId}></BlogList>
                </Tabs.Panel>

                <Tabs.Panel value="dynamic" pt="xs">
                  <DynamicList userId={userId}></DynamicList>
                </Tabs.Panel>

                <Tabs.Panel value="followings" pt="xs">
                  <RelationList
                    type="followings"
                    userId={userId}
                  ></RelationList>
                </Tabs.Panel>
                <Tabs.Panel value="fans" pt="xs">
                  <RelationList type="fans" userId={userId}></RelationList>
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
                    type="text"
                    withAsterisk
                    placeholder={userData.username}
                    {...form.getInputProps("username")}
                  />
                </Grid.Col>
                <Grid.Col span={1}>
                  <Text align="right" c="dimmed">
                    密码:
                  </Text>
                </Grid.Col>
                <Grid.Col span={11}>
                  <Input
                    name="paasword"
                    type="password"
                    withAsterisk
                    placeholder="请输入密码"
                    {...form.getInputProps("password")}
                  />
                </Grid.Col>
                <Grid.Col span={2} c="dimmed" offset={-1}>
                  <Text align="right">确认密码:</Text>
                </Grid.Col>
                <Grid.Col span={11}>
                  <Input
                    name="rePassword"
                    type="password"
                    withAsterisk
                    placeholder="请再次输入密码"
                    {...form.getInputProps("rePassword")}
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
                    placeholder={userData.description}
                    autosize
                    minRows={4}
                    withAsterisk
                    {...form.getInputProps("description")}
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
      ) : undefined}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await prisma.user.findMany({
    select: {
      id: true,
    },
  });
  const paths = ids.map((item) => ({ params: { userId: item.id } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  await createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({
      session: null,
    }),
    transformer: superjson, // optional - adds superjson serialization
  });
  const id = params?.userId as string;
  return {
    props: { id },
  };
};

export default PersonalSide;
