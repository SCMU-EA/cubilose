import { Box, Button, Group, Space, Textarea } from "@mantine/core";
import Picker from "emoji-picker-react";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import { CheckIcon } from "@mantine/core";
import { IconMoodHappy } from "@tabler/icons";
import { useForm } from "@mantine/form";
import Editor from "../editor";
export default function CommentForm({
  parentId,
  hostId,
  type,
}: {
  parentId?: string;
  hostId: string;
  type: string;
}) {
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
    if (form.isValid()) mutate(payload);
  }

  return (
    <Editor
      mutate={mutate}
      isLoading={isLoading}
      formMsg={{ parentId, hostId, type }}
      parentId={parentId}
    ></Editor>
  );
}