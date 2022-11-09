import { InferGetStaticPropsType } from "next";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { trpc } from "../../utils/trpc";
import { Blog } from "../../types/blog";
type Id = {
  id: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const ids: Id[] = trpc.blog.getBlogIds.useQuery().data || [];

  const paths = ids.map((item: Id) => ({ params: { id: item.id } }));
  return { paths, fallback: false };
};
export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const blog: Blog = trpc.blog.getBlogById.useQuery({ id: params.id })
    .data as Blog;
  return {
    props: { blog },
  };
};
const BlogDetail = ({
  blog,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <div>{blog.title}</div>
    </>
  );
};

export default BlogDetail;
