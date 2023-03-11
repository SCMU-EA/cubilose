import type { NextPage } from "next";
import { BlogList } from "./components/blog/blogList";
import Navigation from "./components/navigation";
import { GetServerSideProps } from "next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { Container, Space } from "@mantine/core";
import { serialize } from "superjson";
import { useState } from "react";
import { Guide } from "./posts/guide";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Home: NextPage = ({ user }: any) => {
  const [searchData, setSearchData] = useState<string>();

  const getSearchData = (searchData: string) => {
    setSearchData(searchData);
  };
  return (
    <>
      {!user ? (
        <Guide />
      ) : (
        <>
          {" "}
          <Navigation user={user} getSearchData={getSearchData} />
          <Container size="xl" bg="#dbdada4c" mih={750}>
            <Space h={10}></Space>
            <BlogList searchData={searchData} />
          </Container>
        </>
      )}
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
          id: session.user?.id,
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

  return {
    props: { user },
  };
};
export default Home;
