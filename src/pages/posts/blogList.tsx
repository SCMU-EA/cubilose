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
  Stack,
} from "@mantine/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { CheckIcon } from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { showNotification } from "@mantine/notifications";
export const BlogList: NextPage = () => {
  const { data: blogs } = trpc.blog.getBlogs.useQuery();
  const router = useRouter();
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
          spacing={0}
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.white,
            height: 1800,
          })}
        >
          {blogs ? (
            blogs.map((item) => {
              return (
                <>
                  <Grid>
                    <Grid.Col span={11}>
                      <Stack spacing={0}>
                        <Group position="left">
                          <Text>{item.user?.username}</Text>
                          <Text>{item.type?.name}</Text>
                          <Text>
                            {item.tags.map((item) => item.name + "  ")}
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
                            <Grid.Col offset={2} span={2}>
                              <Image
                                src={item.firstPicture}
                                height={100}
                                alt="Norway"
                              />
                            </Grid.Col>
                          </Grid>
                        </Card>

                        <Text>view</Text>
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
      </Container>
    </>
  );
};
