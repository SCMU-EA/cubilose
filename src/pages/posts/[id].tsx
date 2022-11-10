import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from "next";
import {
  TextInput,
  Button,
  Group,
  Box,
  Flex,
  Input,
  Container,
  Image,
  Text,
  Menu,
  Divider,
} from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  IconLogout,
  IconUser,
  IconCirclePlus,
  IconExternalLink,
  IconBrandTelegram,
} from "@tabler/icons";
import { Blog } from "../../types/blog";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { prisma } from "../../server/db/client";
import { appRouter } from "../../server/trpc/router/_app";
import { createContextInner } from "../../server/trpc/context";

import Navigation from "./navigation";

const navigation = [
  { name: "首页", href: "/", current: true },
  { name: "动态", href: "#", current: false },
  { name: "直播", href: "#", current: false },
  { name: "学习看板", href: "#", current: false },
];

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await prisma.blog.findMany({
    select: {
      id: true,
    },
  });
  const paths = ids.map((item) => ({ params: { id: item.id } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({
      session: null,
    }),
    transformer: superjson, // optional - adds superjson serialization
  });
  const id = params?.id as string;

  await ssg.blog.getBlogById.prefetch({ id });
  return {
    props: { id, trpcState: ssg.dehydrate() },
    revalidate: 1,
  };
};
const BlogDetail = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { id } = props;
  const blog: Blog = props.trpcState?.json.queries[0].state.data as Blog;
  const { user } = blog;
  // const { json } = props.trpcState; // error: cant read property 'json'a
  // const { data } = json.queries[0].state;
  // console.log(data);
  // const blogQuery = trpc.blog.getBlogById.useQuery({ id: id });
  // if (blogQuery.status !== "success") {
  //   return <>{props.id}</>;
  // }
  // const { data: blog } = blogQuery;
  return (
    <>
      <Navigation user={user}></Navigation>
      <Container>
        <Flex
          mih={300}
          gap="md"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Text>{blog?.title}</Text>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
        </Flex>
      </Container>
    </>
  );
};

export default BlogDetail;
