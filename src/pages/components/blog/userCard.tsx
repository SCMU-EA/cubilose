import { Container, Grid, Card, Avatar, Text, Button } from "@mantine/core";
import { User } from "../../../types/user";

const UserCard = ({ author }: { author: User }) => {
  return (
    <>
      <Container>
        <Grid>
          <Grid.Col span={3}>
            <Card>
              <Card.Section
                component="a"
                target="_blank"
                href={"/posts/personal/" + author?.id}
              >
                <Avatar
                  color="cyan"
                  radius="xl"
                  src={author?.avatar ?? ""}
                ></Avatar>
              </Card.Section>
            </Card>
          </Grid.Col>
          <Grid.Col span={9}>
            <Text>{author?.username}</Text>
            <Text>{author?.description}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Button>关注</Button>
          </Grid.Col>
          <Grid.Col span={6}>
            <Button>私信 </Button>
          </Grid.Col>
        </Grid>
      </Container>
      ;
    </>
  );
};

export default UserCard;
