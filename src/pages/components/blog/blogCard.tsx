import { Avatar, Space } from "@mantine/core";
import { Card, Text, Button, Divider, Group, Stack, Grid } from "@mantine/core";
import { Blog } from "../../../types/blog";
import { trpc } from "../../../utils/trpc";
import { IconEye, IconThumbUp, IconThumbDown } from "@tabler/icons";

import Image from "next/image";
import { formatPassedTime } from "../../utils";
const BlogCard = ({ blog }: { blog: Blog }) => {
  const { mutate: changeBlogState } = trpc.blog.updateBlogState.useMutation();

  return (
    <>
      <Grid>
        <Grid.Col span={8}>
          <Stack spacing={0}>
            <Group position="left" spacing={8}>
              <Card>
                <Card.Section
                  component="a"
                  href={"/posts/personal/" + blog?.user?.id}
                  target="_blank"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Group>
                    <Avatar
                      size={30}
                      radius={25}
                      src={blog?.user?.avatar}
                    ></Avatar>
                    <Text size="sm">{blog?.user?.username}</Text>
                  </Group>
                </Card.Section>
              </Card>

              <Text size={6} c="gray.4">
                |
              </Text>
              <Text size={10} c="dimmed">
                {formatPassedTime(blog?.createTime)}
              </Text>
              <Text size={6} c="gray.4">
                |
              </Text>
              <Text size={10} color="dimmed">
                {blog?.type?.name}
              </Text>
              <Text size={6} c="gray.4">
                |
              </Text>
              <Text size={10} color="dimmed">
                {blog?.tags ? blog?.tags.map((blog) => blog?.name + " · ") : ""}
              </Text>
            </Group>
            <Card
              p="lg"
              component="a"
              href={"/posts/blog/" + blog?.id}
              key={blog?.id}
              onClick={() => {
                changeBlogState({
                  blogId: blog?.id,
                  type: "views",
                  num: blog?.views + 1,
                });
              }}
            >
              <Grid>
                <Grid.Col span={8}>
                  <Text weight={500}>{blog?.title}</Text>

                  <Text size="sm" color="dimmed">
                    {blog?.description}
                  </Text>
                </Grid.Col>
              </Grid>
            </Card>

            <Group position="left" align="center" spacing={8}>
              <IconEye size={18} color="gray"></IconEye>
              <Text color="dimmed" size="xs" inline={true}>
                {blog?.views}
              </Text>
              <Button
                size="xs"
                variant="white"
                compact
                c={blog?.isUp ? "blue" : "gray"}
                onClick={() => {
                  blog.ups = blog?.isUp ? blog?.ups - 1 : blog?.ups + 1;
                  blog.isUp = !blog?.isUp;

                  changeBlogState({
                    blogId: blog?.id,
                    type: "ups",
                    num: blog?.ups,
                  });
                }}
              >
                <IconThumbUp size={18}></IconThumbUp>
                <Text>{"  " + blog?.ups}</Text>
              </Button>

              <Button
                size="xs"
                variant="white"
                compact
                c={blog?.isDown ? "orange" : "gray"}
                onClick={() => {
                  blog.downs = blog?.isDown ? blog?.downs - 1 : blog?.downs + 1;
                  changeBlogState({
                    blogId: blog?.id,
                    type: "downs",
                    num: blog?.downs,
                  });
                  blog.isDown = !blog?.isDown;
                }}
              >
                <IconThumbDown size={18} />

                <Text>{blog?.downs}</Text>
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack justify="space-around">
            <Space></Space>
            <Image
              quality={6}
              src={blog?.firstPicture as string}
              height={100}
              width={100}
              alt="Norway"
            />
          </Stack>
        </Grid.Col>
      </Grid>
      <Divider my="sm"></Divider>
    </>
  );
};

export default BlogCard;
