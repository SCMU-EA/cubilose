import { GetServerSideProps } from "next";
import {
  Button,
  Group,
  Space,
  Textarea,
  Container,
  Divider,
} from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import { CheckIcon } from "@mantine/core";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { serialize } from "superjson";
import Navigation from "../components/navigation";
import DynamicList from "../components/dynamic/dynamicList";
import { Dynamic } from "../../types/dynamic";
import Editor from "../components/editor";
const Dynamic = ({ user, dynamic }: any) => {
  const dynamics: Dynamic[] = dynamic;

  const { mutate, isLoading } = trpc.dynamic.addDynamic.useMutation({
    onSuccess: () => {
      showNotification({
        id: "register-success",
        color: "teal",
        title: "发表成功",
        message: "评论成功",
        icon: <CheckIcon />,
        autoClose: 2000,
      });
      const dynamic: Dynamic = {
        id: user.id,
        content: "刷新后查看",
        user: user,
        ups: 0,
        comments: [],
        createTime: new Date(),
      };
      dynamics.unshift(dynamic);
    },
    onError: () => {
      showNotification({
        id: "register-success",
        color: "red",
        title: "失败成功",
        message: "请检查输入问题",
        autoClose: 2000,
      });
    },
  });

  return (
    <>
      <Navigation user={user} />

      <Container size="xl" bg="#dbdada4c" mih={750}>
        <Space h={15}></Space>

        <Container sx={{ borderRadius: 5 }} size="md" bg="white">
          <Space h={1}></Space>

          <Editor
            mutate={mutate}
            isLoading={isLoading}
            formMsg={{ userId: user?.id }}
          ></Editor>
          <DynamicList dynamic={dynamics} />
        </Container>
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
  const dynamicModel = await prisma?.dynamic.findMany({
    include: {
      user: true,
      comments: true,
    },

    orderBy: {
      createTime: "desc",
    },
  });
  const dynamic = await serialize(dynamicModel).json;
  return {
    props: { user, dynamic },
  };
};
export default Dynamic;
