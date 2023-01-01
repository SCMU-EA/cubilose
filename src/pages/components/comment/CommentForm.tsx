import { trpc } from "../../../utils/trpc";
import { showNotification } from "@mantine/notifications";
import { CheckIcon } from "@mantine/core";
import { useForm } from "@mantine/form";
import Editor from "../editor";
import { Comment } from "../../../types/comment";
export default function CommentForm({
  parentId,
  hostId,
  type,
  addNewComment,
}: {
  parentId?: string;
  hostId: string;
  type: string;
  addNewComment: (comment: Comment) => void;
}) {
  const form = useForm({
    initialValues: {
      content: "",
    },
    validate: {
      content: (value) => (value.length === 0 ? "输入不能为空" : null),
    },
  });
  // const router = useRouter();
  const { mutate, isLoading } = trpc.comment.addComment.useMutation({
    onSuccess: () => {
      form.reset();
      showNotification({
        id: "register-success",
        color: "teal",
        title: "发表成功",
        message: "评论成功",
        icon: <CheckIcon />,
        autoClose: 2000,
      });
      // router.reload();
    },
  });

  return (
    <Editor
      mutate={mutate}
      isLoading={isLoading}
      formMsg={{ parentId, hostId, type }}
      parentId={parentId}
      addNewComment={addNewComment}
    ></Editor>
  );
}
