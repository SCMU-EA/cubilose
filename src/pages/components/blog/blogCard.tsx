import { Avatar, Space } from "@mantine/core";
import { Card, Text, Button, Divider, Group, Stack, Grid } from "@mantine/core";
import { Blog } from "../../../types/blog";
import { trpc } from "../../../utils/trpc";
import { IconEye, IconThumbUp, IconThumbDown } from "@tabler/icons";
import Image from "next/image";
import { formatPassedTime } from "../../utils";
import Link from "next/link";
const BlogCard = ({ blog }: { blog: Blog }) => {
  const item: Blog = blog;
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
                  href={"/posts/personal/" + blog.user?.id}
                  target="_blank"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Group>
                    <Avatar
                      size={30}
                      radius={25}
                      src={item.user?.avatar}
                    ></Avatar>
                    <Text size="sm">{item.user?.username}</Text>
                  </Group>
                </Card.Section>
              </Card>

              <Text size={6} c="gray.4">
                |
              </Text>
              <Text size={10} c="dimmed">
                {formatPassedTime(item.createTime)}
              </Text>
              <Text size={6} c="gray.4">
                |
              </Text>
              <Text size={10} color="dimmed">
                {item.type?.name}
              </Text>
              <Text size={6} c="gray.4">
                |
              </Text>
              <Text size={10} color="dimmed">
                {item.tags ? item.tags.map((item) => item.name + " · ") : ""}
              </Text>
            </Group>
            <Card
              p="lg"
              component="a"
              href={"/posts/blog/" + item.id}
              key={item.id}
              onClick={() => {
                changeBlogState({
                  blogId: item.id,
                  type: "views",
                  num: item.views + 1,
                });
              }}
            >
              <Grid>
                <Grid.Col span={8}>
                  <Text weight={500}>{item.title}</Text>

                  <Text size="sm" color="dimmed">
                    {item.description}
                  </Text>
                </Grid.Col>
              </Grid>
            </Card>

            <Group position="left" align="center" spacing={8}>
              <IconEye size={18} color="gray"></IconEye>
              <Text color="dimmed" size="xs" inline={true}>
                {item.views}
              </Text>
              <Button
                size="xs"
                variant="white"
                compact
                c={item.isUp ? "blue" : "gray"}
                onClick={() => {
                  item.ups = item.isUp ? item.ups - 1 : item.ups + 1;
                  item.isUp = !item.isUp;

                  changeBlogState({
                    blogId: item.id,
                    type: "ups",
                    num: item.ups,
                  });
                }}
              >
                <IconThumbUp size={18}></IconThumbUp>
                <Text>{"  " + item.ups}</Text>
              </Button>
              <Button
                size="xs"
                variant="white"
                compact
                c={item.isDown ? "orange" : "gray"}
                onClick={() => {
                  item.downs = item.isDown ? item.downs - 1 : item.downs + 1;
                  changeBlogState({
                    blogId: item.id,
                    type: "downs",
                    num: item.downs,
                  });
                  item.isDown = !item.isDown;
                }}
              >
                <IconThumbDown size={18} />

                <Text>{item.downs}</Text>
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack justify="space-around">
            <Space></Space>
            <Image
              quality={6}
              src={item.firstPicture as string}
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
