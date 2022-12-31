import {
  Avatar,
  Container,
  Divider,
  Grid,
  Group,
  Stack,
  Button,
  Text,
  Space,
} from "@mantine/core";
import { Dynamic } from "../../../types/dynamic";
import { IconThumbUp, IconMessageDots, IconMessageShare } from "@tabler/icons";
import { formatPassedTime } from "../../utils";
import CommentSection from "../comment/CommentSection";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";

const DynamicCard = ({ dynamic }: { dynamic: Dynamic }) => {
  const [isShowComments, setIsShowComments] = useState<boolean>(false);
  const { id, ups, comments } = dynamic;
  const commentsNum = comments.length;
  const [isUp, setIsUp] = useState<boolean>(false);
  const { mutate: changeStatus } = trpc.dynamic.changeStatus.useMutation();
  return (
    <>
      <Space h={10}></Space>
      <Container sx={{ borderRadius: 5 }} size="md" px="lg" bg="white">
        <Space h={10}></Space>
        <Stack>
          <Grid>
            <Grid.Col span={1}>
              <Avatar radius={25} src={dynamic.user.avatar}></Avatar>
            </Grid.Col>
            <Grid.Col span={11}>
              <Stack spacing={0}>
                <Text>{dynamic.user.username}</Text>

                <Text c="dimmed" fz={9}>
                  {formatPassedTime(dynamic.createTime)}
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={10} offset={1}>
              <Text>{dynamic.content}</Text>
            </Grid.Col>
          </Grid>
          <Divider sx={{ margin: 0 }}></Divider>
          <Group position="apart" sx={{ marginTop: -10, marginBottom: 8 }}>
            <Text></Text>
            <Button c="gray" compact variant="white">
              <IconMessageShare size={18} />
              <Text size="xs">分享</Text>
            </Button>
            <Text></Text>

            <Button
              c="gray"
              onClick={() => {
                setIsShowComments(!isShowComments);
              }}
              compact
              variant="white"
            >
              <IconMessageDots size={18} />
              <Text size="xs">{commentsNum}</Text>
            </Button>
            <Text></Text>

            <Button
              c={isUp ? "blue" : "gray"}
              compact
              variant="white"
              onClick={() => {
                if (!isUp) {
                  const num = ups + 1;
                  changeStatus({ id, ups: num });
                  setIsUp(true);
                } else {
                  const num = ups - 1;
                  changeStatus({ id, ups: num });
                  setIsUp(false);
                }
              }}
            >
              <IconThumbUp size={18} />
              <Text size="xs">{isUp ? ups + 1 : ups}</Text>
            </Button>
            <Text></Text>
          </Group>
          {isShowComments ? (
            <CommentSection
              data={comments}
              hostId={dynamic.id}
              type="dynamic"
            ></CommentSection>
          ) : undefined}
        </Stack>
      </Container>
    </>
  );
};

export default DynamicCard;
