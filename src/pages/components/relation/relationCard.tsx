import {
  Avatar,
  Container,
  Divider,
  Grid,
  Stack,
  Button,
  Text,
  Space,
  Card,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { User } from "../../../types/user";
import { trpc } from "../../../utils/trpc";
import { useEffect, useState } from "react";
const RelationCard = ({ userId }: { userId: string }) => {
  const user: User = trpc.user.getUserMsg.useQuery({ id: userId }).data as User;
  const session = useSession().data;
  const relations: { followings: string } =
    trpc.userRelation.getRelations.useQuery({
      userId: session?.user?.id ?? "",
      type: "follow",
    }).data as { followings: string };
  const { mutate } = trpc.userRelation.updateRelations.useMutation({});

  const followings = relations?.followings ?? "[]";
  const followingsArr = JSON.parse(followings);
  const [isFollow, setIsFollow] = useState<boolean>();
  useEffect(() => {
    setIsFollow(followingsArr.includes(userId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relations]);
  return (
    <>
      <Container sx={{ borderRadius: 5 }} px="lg" bg="white">
        <Space h={10}></Space>
        <Grid>
          <Grid.Col span={1}>
            <Card>
              <Card.Section
                component="a"
                href={"/posts/personal/" + user?.id}
                target="_blank"
              >
                <Avatar radius={25} src={user?.avatar}></Avatar>
              </Card.Section>
            </Card>
          </Grid.Col>
          <Grid.Col span={9}>
            <Stack spacing={0}>
              <Text>{user?.username}</Text>

              <Text c="dimmed" fz={9}>
                {user?.description}
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={2}>
            {session ? (
              <Button
                variant={isFollow ? "default" : "outline"}
                c={isFollow ? "gray" : "blue"}
                onClick={() => {
                  if (isFollow) {
                    mutate({
                      userId: session?.user?.id ?? "",
                      following: userId,
                      operate: "remove",
                    });
                    mutate({
                      userId: userId,
                      fan: session?.user?.id ?? "",
                      operate: "remove",
                    });
                  } else {
                    mutate({
                      userId: session?.user?.id ?? "",
                      following: userId,
                      operate: "add",
                    });
                    mutate({
                      userId: userId,
                      fan: session?.user?.id ?? "",
                      operate: "add",
                    });
                  }

                  setIsFollow(!isFollow);
                }}
              >
                {isFollow ? "已关注" : "关注"}
              </Button>
            ) : undefined}
          </Grid.Col>
        </Grid>
      </Container>
      <Space h={15}></Space>
      <Divider />
    </>
  );
};
export default RelationCard;
