import { Container } from "@mantine/core";
import { Navigation } from "./navigation";
import { Space } from "@mantine/core";
import { Card, Image, Text, Badge, Button, Group, Stack } from "@mantine/core";
import { NextPage } from "next";
export const BlogList: NextPage = () => {
  const arr: number[] = [1, 2, 3, 4, 5];
  return (
    <>
      <Navigation />
      <Space h="md"></Space>
      <Space h="md"></Space>

      <Container size="md" px="lg">
        <Stack
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            height: 1800,
          })}
        >
          {arr.map((item) => {
            return (
              <Card shadow="sm" p="lg" radius="md" withBorder key={item}>
                <Card.Section component="a" href="https://mantine.dev/">
                  <Image
                    src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500}>Norway Fjord Adventures</Text>
                  <Badge color="pink" variant="light">
                    On Sale
                  </Badge>
                </Group>

                <Text size="sm" color="dimmed">
                  With Fjord Tours you can explore more of the magical fjord
                  landscapes with tours and activities on and around the fjords
                  of Norway
                </Text>

                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  Book classic tour now
                </Button>
              </Card>
            );
          })}
        </Stack>
      </Container>
    </>
  );
};
