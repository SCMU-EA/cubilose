import {
  createStyles,
  Navbar,
  Text,
  Group,
  Grid,
  Card,
  Stack,
  Divider,
  Tooltip,
  ActionIcon,
  Modal,
  Input,
  Button,
  NativeSelect,
  Avatar,
  Flex,
} from "@mantine/core";
import Navigation from "../components/navigation";
import { GetServerSideProps } from "next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { serialize } from "superjson";
import { IconTool, IconPlus } from "@tabler/icons";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { trpc } from "../../utils/trpc";
import type { SelectItem } from "@mantine/core";
import type { Tool } from "../../types/tool";
const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
  },
  collectionLink: {
    display: "block",
    padding: `8px ${theme.spacing.xs}px`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    lineHeight: 1,
    fontWeight: "bold",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
  gridItem: {
    display: "flex",
    padding: `8px ${theme.spacing.xs}px`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    backgroundColor: theme.colors.gray[1],
    lineHeight: 1,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

function Tools({ user, tools, toolClasses }: any) {
  const toolClassModalForm = useForm({
    initialValues: {
      name: "",
    },

    validate: {
      name: (value) => (value.length === 0 ? "用户名长度只能在3-8位" : null),
    },
  });
  const toolModalForm = useForm({
    initialValues: {
      name: "",
      logoUrl: "",
      href: "",
    },

    validate: {
      name: (value) => (value.length === 0 ? "用户名长度只能在3-8位" : null),
      logoUrl: (value) => (value.length === 0 ? "用户名长度只能在3-8位" : null),
      href: (value) => (value.length === 0 ? "用户名长度只能在3-8位" : null),
    },
  });
  const { classes } = useStyles();
  const [toolClassOpened, setToolClassOpened] = useState<boolean>(false);
  const [toolOpened, setToolOpened] = useState<boolean>(false);
  const [toolClassSelectValue, setToolClassSelectValue] = useState<string>(
    toolClasses[0].id,
  );
  let currentClass: string = toolClasses[0].id;
  const [toolsShow, setToolsShow] = useState<Tool[]>(
    tools.filter((item: Tool) => item.toolClassId === currentClass),
  );
  const toolClassesSelect: SelectItem[] = toolClasses.map(
    (item: { id: string; name: string }) => {
      return { value: item.id, label: item.name };
    },
  );
  const { mutate: addToolClass, isLoading: classLoading } =
    trpc.toolClass.addtoolClass.useMutation({
      onSuccess() {
        showNotification({
          id: "register-success",
          color: "teal",
          title: "修改成功",
          message: "您已成功修改，正在跳转至个人中心",
          autoClose: 2000,
        });
        setToolClassOpened(false);
      },
      onError() {
        showNotification({
          id: "register-error",
          color: "red",
          title: "修改失败",
          message: "修改失败，请注意输入",
          autoClose: 2000,
        });
      },
    });
  const { mutate: addTool, isLoading: toolLoading } =
    trpc.tool.addTool.useMutation({
      onSuccess() {
        showNotification({
          id: "register-success",
          color: "teal",
          title: "修改成功",
          message: "您已成功修改，正在跳转至个人中心",
          autoClose: 2000,
        });
        setToolOpened(false);
      },
      onError() {
        showNotification({
          id: "register-error",
          color: "red",
          title: "修改失败",
          message: "修改失败，请注意输入",
          autoClose: 2000,
        });
      },
    });
  const collectionLinks = toolClasses.map(
    (toolClass: { id: string; name: string }) => (
      // eslint-disable-next-line @next/next/no-html-link-for-pages
      <a
        onClick={(event) => {
          event.preventDefault();
          currentClass = toolClass.id;
          setToolsShow(
            tools.filter((item: Tool) => item.toolClassId === currentClass),
          );
        }}
        key={toolClass.id}
        className={classes.collectionLink}
      >
        {toolClass.name}
      </a>
    ),
  );

  return (
    <>
      <Navigation user={user} />
      <Flex direction="row" gap={20}>
        <Navbar
          height={700}
          width={{ sm: 200 }}
          p="md"
          className={classes.navbar}
        >
          <Navbar.Section>
            <Group position="apart">
              <Text size="xs" weight={500} color="dimmed">
                Collections
              </Text>
              <Tooltip label="Create collection" withArrow position="right">
                <ActionIcon
                  variant="default"
                  size={18}
                  onClick={() => setToolClassOpened(true)}
                >
                  <IconPlus size={12} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <div className={classes.collectionLink}>{collectionLinks}</div>
          </Navbar.Section>
        </Navbar>
        <div style={{ width: 1200 }}>
          <Stack justify="flex-start">
            <Group spacing={5}>
              <IconTool size={20} color="#45494b" />
              <Text fw="bold" c="gray.7">
                实用工具
              </Text>
              <ActionIcon
                variant="default"
                size={18}
                onClick={() => setToolOpened(true)}
              >
                <IconPlus size={12} stroke={1.5} />
              </ActionIcon>
            </Group>

            <Divider></Divider>
            <Grid>
              {toolsShow.map((item: Tool, index: number) => (
                <Grid.Col span="content" key={index}>
                  <Card>
                    <Card.Section
                      className={classes.gridItem}
                      component="a"
                      href={item.href}
                      target="_blank"
                    >
                      <Group>
                        <Avatar src={item.logoUrl}></Avatar>
                        <Text>{item.name}</Text>
                      </Group>
                    </Card.Section>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </div>
      </Flex>
      <Modal
        opened={toolClassOpened}
        onClose={() => setToolClassOpened(false)}
        title="添加工具类别"
      >
        <Grid>
          <Grid.Col span={2} offset={-1}>
            <Text align="right" c="dimmed">
              名称:
            </Text>
          </Grid.Col>

          <Grid.Col span={11}>
            <Input
              name="name"
              type="text"
              withAsterisk
              {...toolClassModalForm.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col offset={9} span={3}>
            <Button
              loading={classLoading}
              onClick={async () => {
                toolClassModalForm.validate();
                if (toolClassModalForm.isValid()) {
                  const name = toolClassModalForm.getInputProps("name").value;
                  await addToolClass({ name });
                }
              }}
            >
              确定
            </Button>
          </Grid.Col>
        </Grid>
      </Modal>
      <Modal
        opened={toolOpened}
        onClose={() => setToolOpened(false)}
        title="添加工具类别"
      >
        <Grid>
          <Grid.Col span={2}>
            <Text align="right" c="dimmed">
              名称:
            </Text>
          </Grid.Col>

          <Grid.Col span={9}>
            <Input
              name="name"
              type="text"
              withAsterisk
              {...toolModalForm.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Text align="right" c="dimmed">
              href:
            </Text>
          </Grid.Col>

          <Grid.Col span={9}>
            <Input
              name="href"
              type="text"
              withAsterisk
              {...toolModalForm.getInputProps("href")}
            />
          </Grid.Col>
          <Grid.Col span={3} offset={-1}>
            <Text align="right" c="dimmed">
              LogoUrl:
            </Text>
          </Grid.Col>

          <Grid.Col span={9}>
            <Input
              name="logoUrl"
              type="text"
              withAsterisk
              {...toolModalForm.getInputProps("logoUrl")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Text align="right" c="dimmed">
              分类
            </Text>
          </Grid.Col>

          <Grid.Col span={9}>
            <NativeSelect
              data={toolClassesSelect}
              value={toolClassSelectValue}
              onChange={(event) => {
                console.log(toolClassSelectValue);
                setToolClassSelectValue(event.currentTarget.value);
              }}
              withAsterisk
            />
          </Grid.Col>

          <Grid.Col offset={4} span={3}>
            <Button
              loading={toolLoading}
              onClick={async () => {
                toolClassModalForm.validate();
                // if (toolModalForm.isValid()) {
                const toolForm = {
                  name: toolModalForm.getInputProps("name").value,
                  href: toolModalForm.getInputProps("href").value,
                  logoUrl: toolModalForm.getInputProps("logoUrl").value,
                  toolClassId: toolClassSelectValue,
                };
                await addTool(toolForm);
                // }
              }}
            >
              确定
            </Button>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
}
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
  const toolClassModel = await prisma?.toolClass.findMany();
  const toolClasses = await serialize(toolClassModel).json;
  const toolModel = await prisma?.tool.findMany();
  const tools = await serialize(toolModel).json;
  return {
    props: { user, toolClasses, tools },
  };
};
export default Tools;
