import { Box, Button, Group, Space, Textarea } from "@mantine/core";
import Picker from "emoji-picker-react";
import { useState } from "react";
import { IconMoodHappy } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { EmojiClickData } from "emoji-picker-react";
import { useSession } from "next-auth/react";
import { Dynamic } from "../../types/dynamic";
import { Comment } from "../../types/comment";
import cuid from "cuid";
import { User } from "../../types/user";
import { trpc } from "../../utils/trpc";
const Editor = ({
  mutate,
  isLoading,
  formMsg,
  parentId,
  addNewDynamic,
  addNewComment,
}: any) => {
  const id = cuid();
  const { data } = useSession();
  const user: User = trpc.user.getUserMsg.useQuery({ id: data?.user?.id ?? "" })
    .data as User;
  const userId = user?.id;
  const form = useForm({
    initialValues: addNewDynamic
      ? { content: "" }
      : { ...formMsg, content: "" },
    validate: {
      content: (value) => (value.length === 0 ? "输入不能为空" : null),
    },
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const session = useSession();
  const handleSubmit = () => {
    if (!session.data) {
      alert("请登录");
      return;
    }

    if (addNewDynamic) {
      const dynamic: Dynamic = {
        id,
        content: form.getInputProps("content").value,
        user,
        comments: [],
        ups: 0,
        createTime: new Date(),
      };
      addNewDynamic(dynamic);
    }
    if (addNewComment) {
      const comment: Comment = {
        id,
        content: form.getInputProps("content").value,
        user,
        formMsg,
        ups: 0,
        createdAt: new Date(),
        parentId,
      };
      addNewComment(comment);
    }
    form.validate();
    const payload = { ...form.values, userId, id };
    if (form.isValid()) mutate(payload);
  };
  const handleEmojiClick = (emoji: EmojiClickData, event: MouseEvent) => {
    event.preventDefault();
    form.setValues({
      content: form.getInputProps("content").value + emoji.emoji,
    });
  };

  return (
    <>
      <Box mt="md" mb="md">
        <Textarea
          minRows={3}
          onClick={() => {
            setShowEmojiPicker(false);
          }}
          {...form.getInputProps("content")}
        ></Textarea>
        <Space h={10}></Space>
        <Group position="apart">
          <Button
            c="dimmed"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
            }}
            variant="white"
            compact
          >
            <IconMoodHappy></IconMoodHappy>
          </Button>
          <Button loading={isLoading} variant="white" onClick={handleSubmit}>
            {parentId ? "回复" : "发表评论"}
          </Button>
        </Group>

        {showEmojiPicker ? (
          <Picker onEmojiClick={handleEmojiClick}></Picker>
        ) : undefined}
      </Box>
    </>
  );
};

export default Editor;
