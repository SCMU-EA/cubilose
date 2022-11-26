import type { NextPage } from "next";
import { Guide } from "./posts/guide";
import { BlogList } from "./posts/blogList";
import Navigation from "./posts/navigation";
import { GetServerSideProps } from "next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { Container, Space } from "@mantine/core";
import { serialize } from "superjson";
const Home: NextPage = ({ user, blog, type }: any) => {
  // const { data: userData } = useSession();
  // const id = userData?.user?.id;
  // const user = trpc.user.getUserMsg.useQuery({ id: id as string }).data;
  if (user === null) return <Guide />;
  else
    return (
      <>
        <Navigation user={user} />

        <Container size="xl" bg="#dbdada4c" mih={750}>
          <Space h={10}></Space>

          <BlogList blog={blog} type={type} />
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

  const userModel = await prisma?.user.findFirst({
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
      createTime: "asc",
    },
  });
  const blog = await serialize(blogsModel).json;
  const type = "preview";
  return {
    props: { user, blog, type },
  };
};
export default Home;
