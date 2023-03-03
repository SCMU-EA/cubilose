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
  Flex,
} from "@mantine/core";
import Navigation from "../components/navigation";
import { GetServerSideProps } from "next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import { serialize } from "superjson";
import { IconPlus, IconBrandYoutube, IconFlame } from "@tabler/icons";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { trpc } from "../../utils/trpc";
import type { SelectItem } from "@mantine/core";
import type { Video } from "../../types/video";
import cuid from "cuid";
import { User } from "../../types/user";
import Image from "next/image";
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
    backgroundColor: theme.colors.white,
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

const Video = ({
  user,
  videos,
  videoClasses,
}: {
  user: User;
  videos: Video[];
  videoClasses: { id: string; name: string }[];
}) => {
  const videoClassModalForm = useForm({
    initialValues: {
      name: "",
    },

    validate: {
      name: (value) => (value.length === 0 ? "用户名长度只能在3-8位" : null),
    },
  });
  const id = cuid();
  const videoModalForm = useForm({
    initialValues: {
      id,
      name: "",
      firstPicture: "",
      href: "",
      ups: 0,
    },

    validate: {
      name: (value) => (value.length === 0 ? "用户名长度只能在3-8位" : null),
      firstPicture: (value) =>
        value.length === 0 ? "用户名长度只能在3-8位" : null,
      href: (value) => (value.length === 0 ? "用户名长度只能在3-8位" : null),
    },
  });
  const { classes } = useStyles();
  const [videoClassOpened, setvideoClassOpened] = useState<boolean>(false);
  const [videoOpened, setvideoOpened] = useState<boolean>(false);
  const [videoClassSelectValue, setvideoClassSelectValue] = useState<string>(
    videoClasses[0]?.id ?? "",
  );
  const [title, setTitle] = useState<string>(videoClasses[0]?.name ?? "");
  let currentClass: string = videoClasses[0]?.id ?? "";
  const [videosShow, setVideosShow] = useState<Video[]>(
    videos?.filter((item: Video) => item.videoClassId === currentClass),
  );
  const videoClassesSelect: SelectItem[] = videoClasses?.map(
    (item: { id: string; name: string }) => {
      return { value: item.id, label: item.name };
    },
  );
  const { mutate: addvideoClass, isLoading: classLoading } =
    trpc.videoClass.addVideoClass.useMutation({
      onSuccess() {
        showNotification({
          id: "register-success",
          color: "teal",
          title: "修改成功",
          message: "您已成功修改，正在跳转至个人中心",
          autoClose: 2000,
        });
        setvideoClassOpened(false);
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
  const { mutate: addvideo, isLoading: videoLoading } =
    trpc.video.addVideo.useMutation({
      onSuccess() {
        showNotification({
          id: "register-success",
          color: "teal",
          title: "修改成功",
          message: "您已成功修改，正在跳转至个人中心",
          autoClose: 2000,
        });
        setvideoOpened(false);
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
  const { mutate: changeVideoStatus } = trpc.video.updateVideo.useMutation();
  const collectionLinks = videoClasses.map(
    (videoClass: { id: string; name: string }) => (
      // eslint-disable-next-line @next/next/no-html-link-for-pages
      <a
        onClick={(event) => {
          event.preventDefault();
          currentClass = videoClass?.id;
          setTitle(videoClass?.name);
          setVideosShow(
            videos?.filter((item: Video) => item.videoClassId === currentClass),
          );
        }}
        key={videoClass?.id}
        className={classes.collectionLink}
      >
        {videoClass?.name}
      </a>
    ),
  );
  const updateVideo = (id: string, ups: number) => {
    changeVideoStatus({ id, ups: ups + 1 });
  };
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
              <Text size="sm" weight="bold" c="dimmed">
                技术方向
              </Text>
              {user.role === "管理员" ? (
                <Tooltip label="添加类别" withArrow position="right">
                  <ActionIcon
                    variant="default"
                    size={18}
                    onClick={() => setvideoClassOpened(true)}
                  >
                    <IconPlus size={12} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              ) : undefined}
            </Group>
            <div className={classes?.collectionLink}>{collectionLinks}</div>
          </Navbar.Section>
        </Navbar>
        <div style={{ width: 1200 }}>
          <Stack justify="flex-start">
            <Group spacing={5}>
              <IconBrandYoutube size={20} color="#45494b" />
              <Text fw="bold" c="gray.7">
                {title}
              </Text>
              {user.role === "管理员" ? (
                <ActionIcon
                  variant="default"
                  size={18}
                  onClick={() => setvideoOpened(true)}
                >
                  <IconPlus size={12} stroke={1.5} />
                </ActionIcon>
              ) : undefined}
            </Group>

            <Divider></Divider>
            <Grid>
              {videosShow.map((item: Video, index: number) => (
                <Grid.Col span="content" key={index}>
                  <Card>
                    <Card.Section
                      className={classes.gridItem}
                      component="a"
                      href={item.href}
                      target="_blank"
                      onClick={() => updateVideo(item.id, item.ups)}
                    >
                      <Stack>
                        <Image
                          src={item.firstPicture}
                          alt={item.name}
                          style={{ borderRadius: 10 }}
                          width={100}
                          height={150}
                        ></Image>
                        <Group spacing={2}>
                          <Text>{item.name}</Text>
                          <IconFlame size={16} color="#ff3300cb"></IconFlame>
                          <Text size={14} c="#ff3300cb">
                            {item.ups}
                          </Text>
                        </Group>
                      </Stack>
                    </Card.Section>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </div>
      </Flex>
      <Modal
        opened={videoClassOpened}
        onClose={() => setvideoClassOpened(false)}
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
              {...videoClassModalForm.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col offset={9} span={3}>
            <Button
              loading={classLoading}
              onClick={async () => {
                videoClassModalForm.validate();
                if (videoClassModalForm.isValid()) {
                  const name = videoClassModalForm.getInputProps("name").value;
                  await addvideoClass({ name });
                }
              }}
            >
              确定
            </Button>
          </Grid.Col>
        </Grid>
      </Modal>
      <Modal
        opened={videoOpened}
        onClose={() => setvideoOpened(false)}
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
              {...videoModalForm.getInputProps("name")}
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
              {...videoModalForm.getInputProps("href")}
            />
          </Grid.Col>
          <Grid.Col span={3} offset={-1}>
            <Text align="right" c="dimmed">
              视频封面:
            </Text>
          </Grid.Col>

          <Grid.Col span={9}>
            <Input
              name="logoUrl"
              type="text"
              withAsterisk
              {...videoModalForm.getInputProps("firstPicture")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Text align="right" c="dimmed">
              分类
            </Text>
          </Grid.Col>

          <Grid.Col span={9}>
            <NativeSelect
              data={videoClassesSelect}
              value={videoClassSelectValue}
              onChange={(event) => {
                setvideoClassSelectValue(event.currentTarget.value);
              }}
              withAsterisk
            />
          </Grid.Col>

          <Grid.Col offset={4} span={3}>
            <Button
              loading={videoLoading}
              onClick={async () => {
                videoModalForm.validate();
                if (videoModalForm.isValid()) {
                  const videoForm: Video = {
                    ...videoModalForm.values,
                    videoClassId: videoClassSelectValue,
                  };
                  setVideosShow([...videosShow, videoForm]);

                  await addvideo(videoForm);
                }
              }}
            >
              确定
            </Button>
          </Grid.Col>
        </Grid>
      </Modal>
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
    ? await prisma?.user.findFirst({
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
  const videoClassModel = await prisma?.videoClass?.findMany();
  const videoClasses = await serialize(videoClassModel).json;
  const videoModel = await prisma?.video.findMany();
  const videos = await serialize(videoModel).json;
  return {
    props: { user, videoClasses, videos },
  };
};
export default Video;
