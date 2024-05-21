import { useContext, useState } from "react";
import {
  Question,
  Comments,
  RepliesComment,
} from "../../../pages/class/ClassQuestionPage";
import {
  ActionIcon,
  Avatar,
  Button,
  FocusTrap,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconDots,
  IconMessage2,
  IconPencil,
  IconSend,
  IconTrash,
} from "@tabler/icons-react";
import { UserCredentialsContext } from "../../../store/user-credentials-context";
import { Form, useSubmit } from "react-router-dom";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import EditInput from "./edit/EditInput";
interface Props {
  comments: Comments[] | null;
  question: Question;
}
const formValidationSchema = z.object({
  reply: z
    .string()
    .max(2000, "Reply must be less than 2000 characters")
    .min(1, "Reply is required"),
});
function CommentSection({ comments, question }: Props) {
  const submit = useSubmit();
  const form = useForm({
    initialValues: {
      reply: "",
    },
    validate: zodResolver(formValidationSchema),
  });
  const { info } = useContext(UserCredentialsContext);
  const currentUserId = info?.userId;
  const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: boolean }>(
    {}
  );

  const [editComment, setEditComment] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [editReplyComment, setEditReplyComment] = useState<{
    [key: number]: { [key: number]: boolean };
  }>({});

  // togglers
  const toggleEditComment = (commentId: number, comment: Comments) => {
    setEditComment((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
    form.setFieldValue("editComment", comment.content);
  };

  const toggleEditReply = (commentId: number, reply: RepliesComment) => {
    setEditReplyComment((prevState) => ({
      ...prevState,
      [commentId]: {
        ...prevState[commentId],
        [reply.replyCommentId]:
          !prevState[commentId]?.[reply.replyCommentId] || false,
      },
    }));
    form.setFieldValue("reply", "");
  };

  const toggleShowReplies = (commentId: number) => {
    setShowReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const toggleReplyInput = (commentId: number) => {
    setReplyInputs((prevInputs) => ({
      ...prevInputs,
      [commentId]: !prevInputs[commentId],
    }));
  };
  // handlers
  const handleReplySubmit = (values: typeof form.values, commentId: number) => {
    const payload = {
      requestField: "reply",
      content: values.reply,
      commentId: commentId,
      userId: currentUserId!,
    };
    submit(payload, { method: "post" });
    form.setFieldValue("reply", "");
  };

  const handleDeleteComment = (commentId: number) => {
    const payload = {
      requestField: "comment",
      commentId: commentId,
    };
    submit(payload, { method: "delete" });
  };
  const handleDeleteReply = (replyCommentId: number) => {
    const payload = {
      requestField: "reply",
      replyCommentId: replyCommentId,
    };
    submit(payload, { method: "delete" });
  };

  const commentsList = comments!
    .filter((comment) => comment.questionId === question.classQuestionId)
    .map((comment) => (
      <>
        <Paper withBorder key={comment.commentId} p="md" shadow="lg">
          <Group className="justify-between">
            <Group className="grow">
              <Group>
                <Avatar size={"sm"} src={null} color="orange" />
                <Text c={"dimmed"} className="text-sm">
                  {comment.userName}
                  {": "}
                </Text>
              </Group>
              {/* edit comment input */}
              {editComment[comment.commentId] ? (
                <EditInput
                  requestField="comment"
                  object={comment}
                  toggler={() => {
                    toggleEditComment(comment.commentId, comment);
                  }}
                />
              ) : (
                <Text fz={"sm"}>{comment.content}</Text>
              )}
            </Group>
            {/* util buttons */}
            <Group>
              <Button
                size="compact-xs"
                variant="subtle"
                radius="md"
                color="gray"
                onClick={() => {
                  toggleReplyInput(comment.commentId);
                  toggleShowReplies(comment.commentId);
                }}
                leftSection={<IconMessage2 size={14} />}
              >
                Reply
              </Button>
              {comment.replyComments.length > 0 && (
                <Button
                  size="compact-xs"
                  variant="subtle"
                  radius="md"
                  onClick={() => {
                    toggleShowReplies(comment.commentId);
                    toggleReplyInput(comment.commentId);
                  }}
                  leftSection={
                    showReplies[comment.commentId] ? (
                      <IconChevronUp size={14} />
                    ) : (
                      <IconChevronDown size={14} />
                    )
                  }
                  color="orange"
                >
                  {showReplies[comment.commentId]
                    ? "Hide replies"
                    : "Show replies"}
                </Button>
              )}

              {/* edit and delete button if comment is created by current user */}
              {comment.userId == currentUserId && (
                <Menu shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="orange">
                      <IconDots size={14} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconPencil size={14} />}
                      onClick={() =>
                        toggleEditComment(comment.commentId, comment)
                      }
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={14} />}
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>
          </Group>

          {/* render reply section */}
          {showReplies[comment.commentId] && (
            <Stack gap="xs" className="mt-3">
              {comment.replyComments.map((reply: RepliesComment) => (
                <Paper key={reply.replyCommentId} withBorder p="md" shadow="lg">
                  <Group className="justify-between">
                    <Group className="grow">
                      <Group>
                        <Avatar size={"xs"} src={null} color="orange" />
                        <Text c={"dimmed"} className="text-xs">
                          {reply.userName}
                          {": "}
                        </Text>
                      </Group>
                      {/* edit reply input */}
                      {editReplyComment[comment.commentId] &&
                      editReplyComment[comment.commentId][
                        reply.replyCommentId
                      ] ? (
                        <EditInput
                          requestField="reply"
                          object={reply}
                          toggler={() => {
                            toggleEditReply(comment.commentId, reply);
                          }}
                        />
                      ) : (
                        <Text fz={"sm"}>{reply.content}</Text>
                      )}
                    </Group>
                    {/*  util buttons if reply is created by current user */}
                    {reply.userId == currentUserId && (
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="orange">
                            <IconDots size={14} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconPencil size={14} />}
                            onClick={() =>
                              toggleEditReply(comment.commentId, reply)
                            }
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() =>
                              handleDeleteReply(reply.replyCommentId)
                            }
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    )}
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}
          {/* render reply form */}
          {replyInputs[comment.commentId] && (
            <FocusTrap active={replyInputs[comment.commentId]}>
              <Form
                onSubmit={form.onSubmit((values) => {
                  handleReplySubmit(values, comment.commentId);
                })}
              >
                <Group className="mt-3">
                  <TextInput
                    placeholder="Reply to comment"
                    className="grow"
                    {...form.getInputProps("reply")}
                    data-autofocus
                  />
                  <ActionIcon variant="subtle" type="submit">
                    <IconSend size={20} color="orange" />
                  </ActionIcon>
                </Group>
              </Form>
            </FocusTrap>
          )}
        </Paper>
      </>
    ));

  return <Stack>{commentsList}</Stack>;
}

export default CommentSection;
