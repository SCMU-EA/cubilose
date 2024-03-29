import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import {
  Group,
  Flex,
  Container,
  Text,
  Space,
  Avatar,
  Button,
  Stack,
  Card,
} from "@mantine/core";
import { Blog } from "../../../types/blog";

import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { prisma } from "../../../server/db/client";
import { appRouter } from "../../../server/trpc/router/_app";
import { createContextInner } from "../../../server/trpc/context";
import { CheckIcon } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import Navigation from "../../components/navigation";
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useSession } from "next-auth/react";
import BlogEditor from "../blogEditor";
import { useState, useEffect } from "react";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import CommentSection from "../../components/comment/CommentSection";
import Image from "next/image";
import { User } from "../../../types/user";
import { CommentWithChildren } from "../../../types/comment";
import { baseApi } from "../blogEditor";
export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await prisma.blog.findMany({
    select: {
      id: true,
    },
  });
  const paths = ids.map((item) => ({ params: { blogId: item.id } }));
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
  const id = params?.blogId as string;

  await ssg.blog.getBlogById.prefetch({ id });
  await ssg.comment.allComments.prefetch({ hostId: id, type: "blog" });
  return {
    props: { id, trpcState: ssg.dehydrate() },
  };
};

const BlogDetail = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const blog: Blog = props.trpcState?.json.queries[0].state.data as Blog;
  const comments: CommentWithChildren[] =
    props.trpcState?.json.queries[1].state.data;
  const { user: author } = blog;
  const session = useSession().data;
  const user: User = trpc.user.getUserMsg.useQuery({
    id: session?.user?.id ?? "",
  }).data as User;
  const isRuler = blog.user.id === session?.user?.id;
  const date = new Date(blog.createTime).toUTCString();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const relations: { followings: string } =
    trpc.userRelation.getRelations.useQuery({
      userId: session?.user?.id ?? "",
      type: "follow",
    }).data as { followings: string };
  const { mutate } = trpc.userRelation.updateRelations.useMutation({});

  const followings = relations?.followings ?? "[]";
  const followingsArr = JSON.parse(followings);
  const [isFollow, setIsFollow] = useState<boolean>();
  useEffect(() => {
    setIsFollow(followingsArr.includes(blog.user.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relations]);
  const router = useRouter();
  const { mutate: deleteBlog } = trpc.blog.deleteBlog.useMutation({
    onSuccess() {
      showNotification({
        id: "delete-success",
        color: "teal",
        title: "删除成功",
        message: "删除成功，正在跳转主界面",
        icon: <CheckIcon />,
        autoClose: 2000,
      });
      router.push("/");
    },
    onError() {
      showNotification({
        id: "delete-error",
        color: "red",
        title: "删除失败",
        message: "服务器问题",
        autoClose: 2000,
      });
    },
  });
  const removeBlog = async (id: string, firstPicture: string) => {
    await fetch(`${baseApi}removeImage`, {
      method: "GET",
      headers: {
        firstPicture,
      },
    });
    await deleteBlog({ id: id });
  };
  const addNewComment = (comment: CommentWithChildren) => {
    comments.unshift(comment);
    setRefresh(!refresh);
  };
  return (
    <>
      {editMode ? (
        <BlogEditor blog={blog} user={user} />
      ) : (
        <>
          <Navigation user={user}></Navigation>
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
                <Group position="apart" spacing={400}>
                  <Group position="left">
                    <Card>
                      <Card.Section
                        component="a"
                        target="_blank"
                        href={"/posts/personal/" + author?.id}
                      >
                        <Avatar
                          color="cyan"
                          radius="xl"
                          src={author?.avatar ?? ""}
                        ></Avatar>
                      </Card.Section>
                    </Card>

                    <Stack spacing={0}>
                      <Text fz="md">{author.username}</Text>
                      <Group>
                        <Text fz="xs" color="dimmed">
                          {date}
                        </Text>
                        <Text fz="xs" color="dimmed">
                          {"浏览量:" + blog.views}
                        </Text>
                        {isRuler || user?.role === "管理员" ? (
                          <>
                            <Text c="blue" fz="xs"></Text>
                            <Button
                              variant="white"
                              style={{ fontWeight: "normal", fontSize: 13 }}
                              compact
                              onClick={() => setEditMode(true)}
                            >
                              编辑
                            </Button>
                            <Button
                              variant="white"
                              c="red"
                              style={{ fontWeight: "normal", fontSize: 13 }}
                              compact
                              onClick={() => {
                                removeBlog(
                                  blog.id,
                                  blog.firstPicture as string,
                                );
                              }}
                            >
                              删除
                            </Button>
                          </>
                        ) : (
                          <Text></Text>
                        )}
                      </Group>
                    </Stack>
                  </Group>
                  {session ? (
                    <Button
                      variant={isFollow ? "default" : "outline"}
                      c={isFollow ? "gray" : "blue"}
                      onClick={() => {
                        if (isFollow) {
                          mutate({
                            userId: session?.user?.id ?? "",
                            following: blog.user.id,
                            operate: "remove",
                          });
                          mutate({
                            userId: blog.user.id,
                            fan: session?.user?.id ?? "",
                            operate: "remove",
                          });
                        } else {
                          mutate({
                            userId: session?.user?.id ?? "",
                            following: blog.user.id,
                            operate: "add",
                          });
                          mutate({
                            userId: blog.user.id,
                            fan: session?.user?.id ?? "",
                            operate: "add",
                          });
                        }

                        setIsFollow(!isFollow);
                      }}
                    >
                      {isFollow ? "已关注" : "关注"}
                    </Button>
                  ) : undefined}
                </Group>
                {blog.firstPicture ? (
                  <Image
                    src={blog.firstPicture as string}
                    alt="image"
                    width={950}
                    height={300}
                  ></Image>
                ) : undefined}

                <MdEditor
                  htmlPreview
                  previewOnly
                  modelValue={blog?.content ?? ""}
                ></MdEditor>
              </Flex>
              <CommentSection
                data={comments}
                addNewComment={addNewComment}
                hostId={blog.id}
                type="blog"
              ></CommentSection>
            </Container>
          </Container>
        </>
      )}
    </>
  );
};

export default BlogDetail;
