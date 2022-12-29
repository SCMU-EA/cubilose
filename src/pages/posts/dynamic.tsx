import { GetServerSideProps } from "next";
import { Button, Group, Space, Textarea, Container } from "@mantine/core";
import Picker from "emoji-picker-react";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import { CheckIcon } from "@mantine/core";
import { IconMoodHappy } from "@tabler/icons";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { serialize } from "superjson";
import Navigation from "../components/navigation";
import DynamicList from "../components/dynamic/dynamicList";
import { Dynamic } from "../../types/dynamic";

const Dynamic = ({ user, dynamic }: any) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const dynamics: Dynamic[] = dynamic;
  let content = "";
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const handleEmojiClick = (emoji: any, event: MouseEvent) => {
    content += emoji.emoji;
  };

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
        content: content,
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

  const handleSubmit = async (content: string) => {
    const payload = {
      content,
      userId: user.id,
    };
    await mutate(payload);
  };
  return (
    <>
      <Navigation user={user} />

      <Container size="xl" bg="#dbdada4c" mih={750}>
        <Space h={15}></Space>
        <Container sx={{ borderRadius: 5 }} size="sm" px="lg" bg="white">
          <Space h={10}></Space>
          <Textarea
            minRows={3}
            onClick={() => {
              setShowEmojiPicker(false);
            }}
            onChange={(e) => {
              content = e.target.value;
            }}
          ></Textarea>
          <Space h={10}></Space>
          <Group position="apart">
            <Button c="dimmed" variant="white" compact>
              <IconMoodHappy
                onClick={handleEmojiPickerHideShow}
              ></IconMoodHappy>
            </Button>
            <Button
              loading={isLoading}
              variant="white"
              onClick={() => handleSubmit(content)}
            >
              发表动态
            </Button>
          </Group>

          {showEmojiPicker ? (
            <Picker onEmojiClick={handleEmojiClick}></Picker>
          ) : undefined}
        </Container>
        <DynamicList dynamic={dynamics} />
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
