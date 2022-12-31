import {
  Pagination,
  Stack,
  Space,
  Container,
  Group,
  Button,
  Text,
  createStyles,
  Divider,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Blog } from "../../../types/blog";
import BlogCard from "./blogCard";
import { trpc } from "../../../utils/trpc";
const useStyles = createStyles((theme) => ({
  header: {
    fontWeight: "normal",
    fontSize: 14,
    color: theme.colors.gray[7],
    "&:hover": {
      color: theme.colors.blue,
    },
  },
}));
export const BlogList = ({
  blog,
  userId,
}: {
  blog?: Blog[];
  userId?: string;
}) => {
  const { classes } = useStyles();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const blogss: Blog[] = blog
    ? blog.map((item) => {
        return { ...item, isUp: false, isDown: false };
      })
    : (trpc.blog.getBlogs.useQuery({ userId }).data as Blog[]);

  const pageSize = 4;
  const [blogs, setBlogs] = useState<Blog[]>(
    blogss
      ? blogss.filter(
          (value, index) =>
            index >= (currentPage - 1) * pageSize &&
            index < currentPage * pageSize,
        )
      : [],
  );

  const pageNum = Math.ceil(blogss ? blogss?.length / pageSize : 1);
  const changePage = () => {
    if (blogss)
      setBlogs([
        ...blogss.filter(
          (value, index) =>
            index >= (currentPage - 1) * pageSize &&
            index < currentPage * pageSize,
        ),
      ]);
  };
  const sortBlog = (stragy: string) => {
    if (stragy === "recommend") {
      setBlogs([...blogs.sort((a, b) => b.ups - a.ups)]);
    } else if (stragy === "time") {
      setBlogs([
        ...blogs.sort(
          (a, b) =>
            new Date(b.createTime).getTime() - new Date(a.createTime).getTime(),
        ),
      ]);
    } else if (stragy === "hot") {
      setBlogs([...blogs.sort((a, b) => b.views - a.views)]);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(changePage, blog ? [currentPage] : [blogss, currentPage]);
  return (
    <>
      <Container size="md" px="lg" bg="white">
        <Space h={10}></Space>
        {blog ? (
          <>
            {" "}
            <Group spacing={0}>
              <Button
                variant="white"
                onClick={() => {
                  sortBlog("recommend");
                }}
                className={classes.header}
                compact
              >
                推荐
              </Button>
              <Text c="gray.5" size={14}>
                |
              </Text>
              <Button
                variant="white"
                className={classes.header}
                onClick={() => sortBlog("time")}
                compact
              >
                最新
              </Button>
              <Text c="gray.5" size={14}>
                |
              </Text>
              <Button
                variant="white"
                className={classes.header}
                onClick={() => sortBlog("hot")}
                compact
              >
                热榜
              </Button>
            </Group>
            <Space h={5}></Space>
            <Divider p={5}></Divider>
          </>
        ) : undefined}

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
              return <BlogCard key={item.id} blog={item} />;
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
