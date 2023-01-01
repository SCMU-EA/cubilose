import { Avatar, Box, Button, Group, Paper, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { Comment, CommentWithChildren } from "../../../types/comment";
import { formatPassedTime } from "../../utils";
import CommentForm from "./CommentForm";
import { IconThumbUp, IconMessageDots } from "@tabler/icons";
import { trpc } from "../../../utils/trpc";
import { User } from "../../../types/user";
function getReplyCountText(count: number) {
  return count;
}

function CommentActions({
  commentId,
  replyCount,
  ups,
  hostId,
  type,
  addNewComment,
}: {
  commentId: string;
  replyCount: number;
  ups: number;
  hostId: string;
  type: string;
  addNewComment: (comment: Comment) => void;
}) {
  const [replying, setReplying] = useState(false);
  const [isUp, setIsUp] = useState<boolean>(false);
  const { mutate } = trpc.comment.updateStatus.useMutation();
  const [upNum, setUpNum] = useState<number>(ups);
  return (
    <>
      <Group position="left" mt="md">
        <Button
          variant="white"
          c={isUp ? "blue" : "gray"}
          onClick={async () => {
            setIsUp(!isUp);

            if (isUp) {
              setUpNum(upNum - 1);
              const num = upNum - 1;
              await mutate({ ups: num, commentId });
            } else {
              setUpNum(upNum + 1);
              const num = upNum + 1;
              await mutate({ ups: num, commentId });
            }
          }}
          compact
        >
          <IconThumbUp size={18}></IconThumbUp>
          <Text>{upNum}</Text>
        </Button>
        <Button variant="white" onClick={() => setReplying(!replying)} compact>
          <IconMessageDots size={18} color="gray"></IconMessageDots>
          <Text c="dimmed">{getReplyCountText(replyCount)}</Text>
        </Button>
      </Group>

      {replying && (
        <CommentForm
          parentId={commentId}
          hostId={hostId}
          addNewComment={addNewComment}
          type={type}
        />
      )}
    </>
  );
}

function Comment({
  comment,
  addNewComment,
}: {
  comment: CommentWithChildren;
  addNewComment: (comment: Comment) => void;
}) {
  const { blogId, dynamicId } = comment;
  const hostId = blogId ? blogId : dynamicId;
  const type = blogId ? "blog" : "dynamic";
  const user: User = comment?.user
    ? comment?.user
    : (trpc.user.getUserMsg.useQuery({ id: comment.userId }).data as User);
  return (
    <Paper withBorder radius="md" mb="md" p="md">
      <Box
        sx={() => ({
          display: "flex",
        })}
      >
        <Avatar src={user?.avatar} radius="xl" />

        <Box
          pl="md"
          sx={() => ({
            display: "flex",
            flexDirection: "column",
          })}
        >
          <Group>
            <Text>{user?.username}</Text>
            <Text size={8} c="dimmed">
              {formatPassedTime(comment.createdAt)}
            </Text>
          </Group>

          <Text fz={12}>{comment.content}</Text>
        </Box>
      </Box>

      <CommentActions
        commentId={comment.id}
        replyCount={comment.children.length}
        ups={comment.ups}
        hostId={hostId}
        type={type}
        addNewComment={addNewComment}
      />

      {comment.children && comment.children.length > 0 && (
        <ListComments
          addNewComment={addNewComment}
          comments={comment.children}
        />
      )}
    </Paper>
  );
}

function ListComments({
  comments,
  addNewComment,
}: {
  comments: Array<CommentWithChildren>;
  addNewComment: (comment: Comment) => void;
}) {
  return (
    <Box>
      {comments.map((comment) => {
        return (
          <Comment
            key={comment.id}
            addNewComment={addNewComment}
            comment={comment}
          />
        );
      })}
    </Box>
  );
}

export default ListComments;
