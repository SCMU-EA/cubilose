import { Box, Button, Group, Space, Textarea } from "@mantine/core";
import { useRouter } from "next/router";
import Picker from "emoji-picker-react";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import { CheckIcon } from "@mantine/core";
import { IconMoodHappy } from "@tabler/icons";
import { useForm } from "@mantine/form";
export default function CommentForm({
  parentId,
  hostId,
  type,
}: {
  parentId?: string;
  hostId: string;
  type: string;
}) {
  const router = useRouter();
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      content: "",
    },
    validate: {
      content: (value) => (value.length === 0 ? "输入不能为空" : null),
    },
  });

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  const handleEmojiClick = (emoji: any, event: MouseEvent) => {
    form.setValues({
      content: form.getInputProps("content").value + emoji.emoji,
    });
  };

  const { mutate, isLoading } = trpc.comment.addComment.useMutation({
    onSuccess: () => {
      form.reset();
      showNotification({
        id: "register-success",
        color: "teal",
        title: "发表成功",
        message: "评论成功",
        icon: <CheckIcon />,
        autoClose: 2000,
      });
    },
  });

  function handleSubmit(content: string) {
    form.validate();
    const payload = {
      content,
      parentId,
      hostId,
      type,
    };
    console.log(payload);
    if (form.isValid()) mutate(payload);
  }

  return (
    <Box mt="md" mb="md">
      <Textarea
        label="发表评论"
        onClick={() => {
          setShowEmojiPicker(false);
        }}
        {...form.getInputProps("content")}
      ></Textarea>
      <Space h={10}></Space>
      <Group position="apart">
        <Button c="dimmed" variant="white" compact>
          <IconMoodHappy onClick={handleEmojiPickerHideShow}></IconMoodHappy>
        </Button>
        <Button
          loading={isLoading}
          variant="white"
          onClick={() => handleSubmit(form.getInputProps("content").value)}
        >
          {parentId ? "回复" : "发表评论"}
        </Button>
      </Group>

      {showEmojiPicker ? (
        <Picker onEmojiClick={handleEmojiClick}></Picker>
      ) : undefined}
    </Box>
  );
}
