import { Box } from "@mantine/core";
import formatComments from "./formatComments";
import { trpc } from "../../../utils/trpc";
import CommentForm from "./CommentForm";
import ListComments from "./ListComments";

function CommentSection({ hostId, type, data }: any) {
  return (
    <Box>
      <CommentForm hostId={hostId} type={type} />
      {data && <ListComments comments={formatComments(data ?? [])} />}
    </Box>
  );
}

export default CommentSection;
