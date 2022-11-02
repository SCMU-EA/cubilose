import { NextPage } from "next";
import {
  Container,
  Group,
  Button,
  Grid,
  Input,
  Avatar,
  Modal,
  Text,
  Image,
  Switch,
  SegmentedControl,
  useMantineTheme,
  FileButton,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import React, { useEffect, useState, useRef } from "react";
import { trpc } from "../../utils/trpc";
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useRouter } from "next/router";
import { BlogForm } from "../../types/blog";
interface TypeForm {
  id: string;
  label: string;
  value: string;
}

const BlogEditor: NextPage = () => {
  const router = useRouter();
  const [content, setContent] = useState<string>(
    "<p>Rich text editor content</p>",
  );
  const previewTheme = "github";
  const [opened, setOpened] = useState<boolean>(false);
  const theme = useMantineTheme();
  const [title, setTitle] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const [type, setType] = useState<string>("");
  const [typeId, setTypeId] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [firstPicture, setFirstPicture] = useState<string>();
  const [inputType, setInputType] = useState<string>();
  const typeForm: TypeForm[] = [];
  const types = trpc.type.getAllTypes.useQuery().data;
  if (types)
    for (const type of types) {
      typeForm.push({ id: type.id, label: type.name, value: type.name });
    }
  useEffect(() => {
    const temp = typeForm.filter((item) => item.value === type);
    if (temp[0]) setTypeId(temp[0]?.id);
    console.log(typeId);
  }, [type]);
  const openModal = () => {
    setOpened(true);
  };
  const { isLoading, mutate } = trpc.blog.createBlog.useMutation({
    onSuccess() {
      showNotification({
        id: "publish-success",
        color: "teal",
        title: "发布成功",
        message: "正在跳转至主页面",
        icon: <IconCheck />,
        autoClose: 2000,
      });
    },
    onError() {
      showNotification({
        id: "publish-error",
        color: "red",
        title: "发布失败",
        message: "请检查输入规范",
        autoClose: 2000,
      });
    },
  });
  const { mutate: typeMutate } = trpc.type.addType.useMutation({
    onSuccess() {
      showNotification({
        id: "publish-success",
        color: "teal",
        title: "发布成功",
        message: "正在跳转至主页面",
        icon: <IconCheck />,
        autoClose: 2000,
      });
    },
  });
  const typeSubmit = () => {
    typeMutate({ name: inputType as string });
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target?.files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target?.files[0]);

        reader.onload = (e) => {
          setFirstPicture(e.target?.result as string);
        };
      }
    }
  };
  const handleSubmit = () => {
    const description: string = content.slice(0, 20);
    const formMsg: BlogForm = {
      title: title,
      content: content,
      firstPicture: firstPicture || "",
      tags: tags,
      description: description,
      published: true,
      type: typeId,
    };
    mutate(formMsg);
    router.push("/");
  };

  return (
    <>
      <Container size={3000}>
        <Grid justify="space-between">
          <Grid.Col span={9} offset={-0.6}>
            <Container>
              <Input
                onChange={handleChange}
                size="xl"
                variant="unstyled"
                placeholder="请输入文章标题"
              ></Input>
            </Container>
          </Grid.Col>
          <Grid.Col span={3}>
            <Group position="right" spacing="lg" style={{ minHeight: 60 }}>
              <Button color="orange">草稿箱</Button>
              <Button onClick={openModal}>发布</Button>
              <Avatar color="cyan" radius="xl">
                微风
              </Avatar>
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
      <Container size={3000} px="lg">
        <MdEditor
          style={{ minHeight: 750 }}
          modelValue={content}
          onChange={setContent}
          previewTheme={previewTheme}
        ></MdEditor>
      </Container>
      <Modal
        size="xl"
        opened={opened}
        onClose={() => {
          setOpened(false);
        }}
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        title={"发布文章"}
      >
        <Container>
          <Grid>
            <Grid.Col span={1}>
              <Text align="right">类型</Text>
            </Grid.Col>

            <Grid.Col span={7}>
              <SegmentedControl
                value={type}
                onChange={setType}
                data={typeForm}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Input
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setInputType(event.target.value);
                }}
              ></Input>
            </Grid.Col>
            <Grid.Col span={2}>
              <Button onClick={typeSubmit}>添加类型</Button>
            </Grid.Col>
            <Grid.Col span={1}>
              <Text align="right">标签</Text>
            </Grid.Col>
            <Grid.Col span={11}>
              <Switch.Group value={tags} onChange={setTags} withAsterisk>
                <Switch value="react" label="React" />
                <Switch value="svelte" label="Svelte" />
                <Switch value="ng" label="Angular" />
                <Switch value="vue" label="Vue" />
              </Switch.Group>
            </Grid.Col>
            <Grid.Col span={2} offset={-1}>
              <Text align="right">上传封面</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Input
                type="file"
                id="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onUpload(e)
                }
              ></Input>
            </Grid.Col>
            <Grid.Col span={6}>
              <Image id="firstPicure" src={firstPicture} alt="" />
            </Grid.Col>
            <Grid.Col span={2} offset={10}>
              <Button
                loading={isLoading}
                variant="outline"
                onClick={handleSubmit}
              >
                发布
              </Button>
            </Grid.Col>
          </Grid>
        </Container>
      </Modal>
    </>
  );
};

export default BlogEditor;
