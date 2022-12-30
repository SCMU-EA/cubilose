import { Box, Button, Group, Space, Textarea } from "@mantine/core";
import Picker from "emoji-picker-react";
import { useState } from "react";
import { IconMoodHappy } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { EmojiClickData } from "emoji-picker-react";
const Editor = ({ mutate, isLoading, formMsg, parentId }: any) => {
  const form = useForm({
    initialValues: { ...formMsg, content: "" },
    validate: {
      content: (value) => (value.length === 0 ? "输入不能为空" : null),
    },
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  function handleSubmit() {
    console.log(form.values, mutate);
    form.validate();
    const payload = form.values;
    if (form.isValid()) mutate(payload);
  }
  const handleEmojiClick = (emoji: EmojiClickData, event: MouseEvent) => {
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
          <Button c="dimmed" variant="white" compact>
            <IconMoodHappy
              onClick={() => {
                setShowEmojiPicker(true);
              }}
            ></IconMoodHappy>
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
