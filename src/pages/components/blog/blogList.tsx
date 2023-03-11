import {
  Stack,
  Space,
  Container,
  Group,
  Button,
  Text,
  createStyles,
  Divider,
  Loader,
} from "@mantine/core";
import { useState, useEffect } from "react";
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
let oldBlogs: Blog[] = [];
export const BlogList = ({
  userId,
  searchData,
}: {
  userId?: string;
  searchData?: string;
}) => {
  const { classes } = useStyles();
  const [index, setIndex] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<string>("ups");
  const [refresh, setRefresh] = useState<boolean>();
  const blogs: Blog[] = trpc.blog.getBlogs.useQuery({
    userId,
    size: 8,
    index: index,
    searchData,
    orderBy,
  }).data as Blog[];

  const sortBlog = (stragy: string) => {
    oldBlogs = [];
    setOrderBy(stragy);
    setIndex(1);
  };
  useEffect(() => {
    oldBlogs = [];
    setIndex(1);
    if (blogs) oldBlogs.push(...blogs);
    setRefresh(!refresh);
  }, [searchData]);
  useEffect(() => {
    window.onscroll = function () {
      // scrollTop是滚动条滚动时，距离顶部的距离
      const visionHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      const scrolledHeight =
        document.documentElement.scrollTop || document.body.scrollTop;

      const trueHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const result = visionHeight + scrolledHeight;
      console.log("r:", result, "t:", trueHeight, result > trueHeight);
      if (result + 1 >= trueHeight) {
        if (blogs) {
          setIndex(index + 1);
          oldBlogs.push(...blogs);
        }
      }
    };
  }, [blogs, index]);
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
          {oldBlogs.length !== 0
            ? oldBlogs.map((item) => {
                return <BlogCard key={item.id} blog={item} />;
              })
            : blogs
            ? blogs.map((item) => {
                return <BlogCard key={item.id} blog={item} />;
              })
            : undefined}
          {!blogs ? <Loader size="sm" /> : undefined}
        </Stack>
      </Container>
    </>
  );
};

export default BlogList;
