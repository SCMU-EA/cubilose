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
  LoadingOverlay,
} from "@mantine/core";
import { useState } from "react";
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
export const BlogList = ({ userId }: { blog?: Blog[]; userId?: string }) => {
  const { classes } = useStyles();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<string>("ups");
  const pageSize = 4;

  const blogs: Blog[] = trpc.blog.getBlogs.useQuery({
    userId,
    size: pageSize,
    index: currentPage,
    orderBy,
  }).data as Blog[];
  const count: number = trpc.blog.getAllBlogsNum.useQuery({ userId })
    .data as number;
  const pageNum = Math.ceil(count / pageSize);

  const sortBlog = (stragy: string) => {
    setOrderBy(stragy);
  };
  return (
    <>
      <Container size="md" px="lg" bg="white">
        <Space h={10}></Space>
        {userId ? undefined : (
          <>
            {" "}
            <Group spacing={0}>
              <Button
                variant="white"
                onClick={() => {
                  sortBlog("ups");
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
                onClick={() => sortBlog("createTime")}
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
                onClick={() => sortBlog("views")}
                compact
              >
                热榜
              </Button>
            </Group>
            <Space h={5}></Space>
            <Divider p={5}></Divider>
          </>
        )}

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
            <LoadingOverlay visible={true} overlayBlur={2}></LoadingOverlay>
          )}
        </Stack>
        <Pagination
          page={currentPage}
          onChange={setCurrentPage}
          total={pageNum}
        ></Pagination>
        <Space h="md"></Space>
        <Space h="md"></Space>
      </Container>
    </>
  );
};

export default BlogList;
