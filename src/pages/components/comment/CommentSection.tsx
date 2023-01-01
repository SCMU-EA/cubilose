import { Box } from "@mantine/core";
import formatComments from "./formatComments";
import CommentForm from "./CommentForm";
import ListComments from "./ListComments";

function CommentSection({ hostId, type, data, addNewComment }: any) {
  return (
    <Box>
      <CommentForm hostId={hostId} type={type} addNewComment={addNewComment} />
      {data && (
        <ListComments
          comments={formatComments(data ?? [])}
          addNewComment={addNewComment}
        />
      )}
    </Box>
  );
}

export default CommentSection;
