import type { NextPage } from "next";
import { Guide } from "./posts/guide";
import { BlogList } from "./components/blog/blogList";
import Navigation from "./components/navigation";
import { GetServerSideProps } from "next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { Button, Container, Space } from "@mantine/core";
import { serialize } from "superjson";

const Home: NextPage = ({ user, blog }: any) => {
  return (
    <>
      <Navigation user={user} />

      <Container size="xl" bg="#dbdada4c" mih={750}>
        <Space h={10}></Space>
        <BlogList blog={blog} />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  const userModel = session
    ? await prisma?.user.findUnique({
        where: {
          id: session?.user?.id,
        },
        select: {
          username: true,
          email: true,
          id: true,
          avatar: true,
        },
      })
    : null;
  const user = await serialize(userModel).json;
  const blogsModel = await prisma?.blog.findMany({
    select: {
      id: true,
      title: true,
      views: true,
      ups: true,
      user: true,
      downs: true,
      description: true,
      firstPicture: true,
      tags: true,
      type: true,
      createTime: true,
    },
    orderBy: {
      views: "desc",
    },
  });
  const blog = await serialize(blogsModel).json;
  return {
    props: { user, blog },
  };
};
export default Home;
