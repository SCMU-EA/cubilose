import { forwardRef } from "react";
import { Group, Text, UnstyledButton } from "@mantine/core";
import Image from "next/image";
interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
}

// eslint-disable-next-line react/display-name
export const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, email, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.md,
        color: theme.white,
        "&:hover": {
          backgroundColor: theme.colors.gray[3],
        },
      })}
      {...others}
    >
      <Group>
        <Image
          src={image}
          alt="avatar"
          width={40}
          height={40}
          style={{ borderRadius: 25 }}
        ></Image>
        <div style={{ flex: 1 }}>
          <Text size="sm" color="blue" weight={500}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ),
);

export default UserButton;
