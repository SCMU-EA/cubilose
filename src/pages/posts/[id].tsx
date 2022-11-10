import {
  GetStaticProps,
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { Blog } from "../../types/blog";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { prisma } from "../../server/db/client";
import { appRouter } from "../../server/trpc/router/_app";
import { createContextInner } from "../../server/trpc/context";

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await prisma.blog.findMany({
    select: {
      id: true,
    },
  });
  const paths = ids.map((item) => ({ params: { id: item.id } }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>,
) => {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({
      session: null,
    }),
    transformer: superjson, // optional - adds superjson serialization
  });
  const id = context.params?.id as string;

  await ssg.blog.getBlogById.prefetch({ id });
  return {
    props: { id, trpcState: ssg.dehydrate() },
    revalidate: 1,
  };
};
const BlogDetail = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { id } = props;
  console.log(props.trpcState); // success log
  // const blog = props.trpcState.json.queries[0].state.data; // error: cant read property 'json'a
  // const blogQuery = trpc.blog.getBlogById.useQuery({ id: id });
  // if (blogQuery.status !== "success") {
  //   return <>{props.id}</>;
  // }
  // const { data: blog } = blogQuery;
  return (
    <>
      {/* <div>{data.title}</div>
      <div>{data.content}</div> */}
    </>
  );
};

export default BlogDetail;
