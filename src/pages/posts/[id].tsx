import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  Input,
  Container,
  Image,
  Text,
  Menu,
  Divider,
  Card,
  Space,
  Avatar,
  Stack,
} from "@mantine/core";

import { Blog } from "../../types/blog";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { prisma } from "../../server/db/client";
import { appRouter } from "../../server/trpc/router/_app";
import { createContextInner } from "../../server/trpc/context";

import Navigation from "./navigation";
import { useTheme } from "@emotion/react";
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";

const navigation = [
  { name: "首页", href: "/", current: true },
  { name: "动态", href: "#", current: false },
  { name: "直播", href: "#", current: false },
  { name: "学习看板", href: "#", current: false },
];

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await prisma.blog.findMany({
    select: {
      id: true,
    },
  });
  const paths = ids.map((item) => ({ params: { id: item.id } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({
      session: null,
    }),
    transformer: superjson, // optional - adds superjson serialization
  });
  const id = params?.id as string;

  await ssg.blog.getBlogById.prefetch({ id });
  return {
    props: { id, trpcState: ssg.dehydrate() },
    revalidate: 1,
  };
};
const BlogDetail = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const blog: Blog = props.trpcState?.json.queries[0].state.data as Blog;
  const { user } = blog;
  const theme = useTheme();
  const date = new Date(blog.createTime).toUTCString();
  return (
    <>
      <Navigation userJson={user}></Navigation>
      <Container size="xl" bg="#dbdada4c">
        <Space h={1}></Space>
        <Container bg="white">
          <Flex
            sx={{ margin: "10px" }}
            mih={800}
            gap="md"
            justify="flex-start"
            align="flex-start"
            direction="column"
            wrap="wrap"
          >
            <Space h={1}></Space>

            <Text fz="xl" fw={700}>
              {blog?.title}
            </Text>
            <Group position="left">
              <Avatar color="cyan" radius="xl">
                {user.username}
              </Avatar>
              <Stack spacing={0}>
                <Text fz="md">{user.username}</Text>
                <Group>
                  <Text fz="xs" color="dimmed">
                    {date}
                  </Text>
                  <Text fz="xs" color="dimmed">
                    {"浏览量:" + blog.views}
                  </Text>
                </Group>
              </Stack>
            </Group>
            <MdEditor
              htmlPreview
              previewOnly
              modelValue={blog?.content ?? ""}
            ></MdEditor>
          </Flex>
        </Container>
      </Container>
    </>
  );
};

export default BlogDetail;
