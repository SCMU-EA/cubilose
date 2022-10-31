import { NextPage } from "next";
import Editor from "../components/editor";
import { Container, Group, Button, Grid, Input, Avatar } from "@mantine/core";
import { useState } from "react";
const BlogEditor: NextPage = () => {
  return (
    <>
      <Container size="xl">
        <Grid justify="space-between">
          <Grid.Col span={9}>
            <Container>
              <Input
                size="xl"
                variant="unstyled"
                placeholder="请输入文章标题"
              ></Input>
            </Container>
          </Grid.Col>
          <Grid.Col span={3}>
            <Group position="right" spacing="lg" style={{ minHeight: 60 }}>
              <Button variant="outline">草稿箱</Button>

              <Button
                variant="gradient"
                gradient={{ from: "teal", to: "blue", deg: 60 }}
              >
                发布
              </Button>
              <Avatar color="cyan" radius="xl">
                微风
              </Avatar>
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
      <Container size="xl" px="lg">
        <Editor></Editor>
      </Container>
    </>
  );
};

export default BlogEditor;
