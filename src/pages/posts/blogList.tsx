import { Container, Grid } from "@mantine/core";
import { Navigation } from "./navigation";
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
import { NextPage } from "next";
import { useRouter } from "next/router";
import { CheckIcon } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import { useState, useEffect } from "react";
export const BlogList: NextPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const blogss = trpc.blog.getBlogs.useQuery().data;
  let blogs = blogss
    ? blogss.filter(
        (value, index) =>
          index >= (currentPage - 1) * 4 && index < currentPage * 4,
      )
    : [];
  const changePage = () => {
    blogs = [
      ...(blogss
        ? blogss.filter(
            (value, index) =>
              index >= (currentPage - 1) * 4 && index < currentPage * 4,
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
  const onDelete = (id: string) => {
    deleteBlog({ id: id });
  };

  return (
    <>
      <Space h="md"></Space>
      <Space h="md"></Space>

      <Container size="md" px="lg">
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
                          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                          target="_blank"
                          key={item.id}
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
                          >
                            {item.views}
                          </Button>
                          <Button
                            size="xs"
                            variant="subtle"
                            color="gray"
                            leftIcon={<IconThumbDown />}
                          >
                            {item.views}
                          </Button>
                        </Group>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={2}>
                      <Stack justify="space-around">
                        <Space></Space>
                        <Image
                          src={item.firstPicture}
                          height={100}
                          alt="Norway"
                        />
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={1}>
                      <Button
                        variant="outline"
                        color="red"
                        loading={isLoading}
                        onClick={() => onDelete(item.id)}
                      >
                        删除
                      </Button>
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
          total={10}
          onClick={changePage}
        ></Pagination>
      </Container>
    </>
  );
};

export default BlogList;
