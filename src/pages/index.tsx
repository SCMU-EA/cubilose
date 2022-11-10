import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Guide } from "./posts/guide";
import { BlogList } from "./posts/blogList";
import Navigation from "./posts/navigation";
import { trpc } from "../utils/trpc";
import { GetServerSideProps } from "next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
const Home: NextPage = ({ user }: any) => {
  // const { data: userData } = useSession();
  // const id = userData?.user?.id;
  // const user = trpc.user.getUserMsg.useQuery({ id: id as string }).data;
  return <>{user ? <Index user={user} /> : <Guide />}</>;
};

const Index: NextPage = ({ user }: any) => {
  return (
    <>
      <Navigation user={user}></Navigation>
      <BlogList></BlogList>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );

  const user = session
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
  return {
    props: { user },
  };
};
export default Home;
