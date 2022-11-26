import { Container, Grid } from "@mantine/core";
import { Space } from "@mantine/core";
import {
  Card,
  Image,
  Text,
  Button,
  Divider,
  Group,
  Pagination,
  Stack,
} from "@mantine/core";
import { IconEye, IconThumbUp, IconThumbDown } from "@tabler/icons";
import { CheckIcon } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Blog } from "../../types/blog";

export const BlogList = ({ blog, type }: any) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const blogss: Blog[] = trpc.blog.getBlogs.useQuery().data as Blog[];
  const blogss: Blog[] = blog;
  const pageSize = 4;
  let blogs: Blog[] = blogss
    ? blogss.filter(
        (value, index) =>
          index >= (currentPage - 1) * pageSize &&
          index < currentPage * pageSize,
      )
    : [];
  const pageNum = Math.ceil(blogss ? blogss?.length / 4 : 1);

  const changePage = () => {
    blogs = [
      ...(blogss
        ? blogss.filter(
            (value, index) =>
              index >= (currentPage - 1) * pageSize &&
              index < currentPage * pageSize,
          )
        : []),
    ];
  };
  const { isLoading, mutate: deleteBlog } = trpc.blog.deleteBlog.useMutation({
    onSuccess() {
      showNotification({
        id: "delete-success",
        color: "teal",
        title: "删除成功",
        message: "",
        icon: <CheckIcon />,
        autoClose: 2000,
      });
    },
  });
  const { mutate: changeBlogState } = trpc.blog.updateBlogState.useMutation();
  const onDelete = (id: string) => {
    deleteBlog({ id: id });
  };

  return (
    <>
      <Container size="md" px="lg" bg="white">
        <Stack
          spacing={0}
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.white,
          })}
        >
          {blogs ? (
            blogs.map((item) => {
              return (
                <>
                  <Grid>
                    <Grid.Col span={8}>
                      <Stack spacing={0}>
                        <Group position="left">
                          <Text size="sm" color="blue">
                            {item.user?.username}
                          </Text>
                          <Text size="sm" color="teal">
                            {item.type?.name}
                          </Text>
                          <Text size="sm" color="orange">
                            {item.tags
                              ? item.tags.map((item) => item.name + " · ")
                              : ""}
                          </Text>
                        </Group>
                        <Card
                          p="lg"
                          component="a"
                          href={"/posts/" + item.id}
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
                          <IconEye
                            width={22}
                            color="gray"
                            height={22}
                          ></IconEye>
                          <Text color="dimmed" size="xs" inline={true}>
                            {item.views}
                          </Text>
                          <Button
                            size="xs"
                            variant="subtle"
                            color="gray"
                            leftIcon={<IconThumbUp />}
                            onClick={() => {
                              changeBlogState({
                                blogId: item.id,
                                type: "ups",
                                num: item.ups + 1,
                              });
                            }}
                          >
                            {item.ups}
                          </Button>
                          <Button
                            size="xs"
                            variant="subtle"
                            color="gray"
                            leftIcon={<IconThumbDown />}
                            onClick={() => {
                              changeBlogState({
                                blogId: item.id,
                                type: "downs",
                                num: item.downs + 1,
                              });
                            }}
                          >
                            {item.downs}
                          </Button>
                        </Group>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Stack justify="space-around">
                        <Space></Space>
                        <Image
                          src={item.firstPicture}
                          height={100}
                          alt="Norway"
                        />
                      </Stack>
                    </Grid.Col>
                  </Grid>
                  <Divider my="sm"></Divider>
                </>
              );
            })
          ) : (
            <h3>无博客</h3>
          )}
        </Stack>
        <Pagination
          page={currentPage}
          onChange={setCurrentPage}
          total={pageNum}
          onClick={changePage}
        ></Pagination>
        <Space h="md"></Space>
        <Space h="md"></Space>
      </Container>
    </>
  );
};

export default BlogList;
