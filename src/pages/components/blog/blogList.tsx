import { Pagination, Stack, Space, Container } from "@mantine/core";
import { useState } from "react";
import { Blog } from "../../../types/blog";
import BlogCard from "./blogCard";
export const BlogList = ({ blog }: { blog: Blog[] }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const blogss: Blog[] = trpc.blog.getBlogs.useQuery().data as Blog[];
  const blogsPorps: Blog[] = blog;
  const blogss: Blog[] = blogsPorps.map((item) => {
    return { ...item, isUp: false, isDown: false };
  });

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
