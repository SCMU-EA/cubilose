import type { NextPage } from "next";
import { Guide } from "./posts/guide";
import { BlogList } from "./posts/blogList";
import Navigation from "./posts/navigation";
import { GetServerSideProps } from "next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { serialize } from "superjson";
const Home: NextPage = ({ userJson, blogJson }: any) => {
  // const { data: userData } = useSession();
  // const id = userData?.user?.id;
  // const user = trpc.user.getUserMsg.useQuery({ id: id as string }).data;
  if (userJson.json === null) return <Guide />;
  else
    return (
      <>
        <Navigation userJson={userJson} />
        <BlogList blogJson={blogJson} />
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
    ? await prisma?.user.findFirst({
        where: {
          id: session.user?.id,
        },
        select: {
          username: true,
          email: true,
          id: true,
        },
      })
    : undefined;
  const userJson = await serialize(userModel);
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
  const blogJson = await serialize(blogsModel);
  return {
    props: { userJson, blogJson },
  };
};
export default Home;
