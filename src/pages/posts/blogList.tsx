import { Container } from "@mantine/core";
import { Navigation } from "./navigation";
import { Space } from "@mantine/core";
import { Card, Image, Text, Badge, Button, Group, Stack } from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { CheckIcon } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import { Blog } from "../../types/blog";
export const BlogList: NextPage = () => {
  const { data: blogs } = trpc.blog.getBlogs.useQuery();

  const { isLoading, mutate } = trpc.blog.deleteBlog.useMutation({
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
    mutate({ id: id });
  };
  return (
    <>
      <Navigation />
      <Space h="md"></Space>
      <Space h="md"></Space>

      <Container size="md" px="lg">
        <Stack
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            height: 1800,
          })}
        >
          {blogs ? (
            blogs.map((item) => {
              return (
                <Card shadow="sm" p="lg" radius="md" withBorder key={item.id}>
                  <Card.Section component="a" href="https://mantine.dev/">
                    <Image src={item.firstPicture} height={160} alt="Norway" />
                  </Card.Section>

                  <Group position="apart" mt="md" mb="xs">
                    <Text weight={500}>{item.title}</Text>
                    <Button
                      variant="outline"
                      color="red"
                      loading={isLoading}
                      onClick={() => onDelete(item.id)}
                    >
                      删除
                    </Button>
                  </Group>

                  <Text size="sm" color="dimmed">
                    {item.description}
                  </Text>

                  <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    mt="md"
                    radius="md"
                  >
                    Book classic tour now
                  </Button>
                </Card>
              );
            })
          ) : (
            <h3>无博客</h3>
          )}
        </Stack>
      </Container>
    </>
  );
};
