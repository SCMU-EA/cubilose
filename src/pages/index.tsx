import type { NextPage } from "next";
import { Guide } from "./posts/guide";
import { BlogList } from "./components/blog/blogList";
import Navigation from "./components/navigation";
import { GetServerSideProps } from "next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { Container, Space } from "@mantine/core";
import { serialize } from "superjson";
import { useSession } from "next-auth/react";

const Home: NextPage = ({ user, blog }: any) => {
  if (user === null) return <Guide />;
  else
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
  if (!session) {
    return { props: { user: null, blog: null } };
  }
  const userModel = await prisma?.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    select: {
      username: true,
      email: true,
      id: true,
      avatar: true,
    },
  });
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
