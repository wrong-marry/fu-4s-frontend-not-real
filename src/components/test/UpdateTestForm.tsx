import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  TextInput,
  Text,
  Group,
  Button,
  Stack,
  Container,
  Paper,
  Checkbox,
  ActionIcon,
  Divider,
  Select,
} from "@mantine/core";
import {
  IconDeviceFloppy,
  IconMinus,
  IconPlaylistAdd,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import _debounce from "lodash/debounce";
import _throttle from "lodash/throttle";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import {
  TransformedValues,
  UseFormReturnType,
  isNotEmpty,
  useForm,
} from "@mantine/form";
import {
  Question,
  TestForm,
} from "../../pages/test/create_form/CreateTestPage";
import { useContext, useEffect } from "react";
import { UserCredentialsContext } from "../../store/user-credentials-context";
import { toast } from "react-toastify";
import { SetDetails } from "../../pages/test/set/SetDetails";

interface QuestionBoxProps {
  question: Question;
  index: number;
  form: UseFormReturnType<TestForm>;
}

const QuestionBox: React.FC<QuestionBoxProps> = ({ question, index, form }) => {
  return (
    <Paper shadow="md" radius="md" withBorder p="xl" className="mt-3">
      <Stack>
        <Group className="justify-between">
          <Text className="font-bold text-xl">Question {index + 1}</Text>
          <ActionIcon
            onClick={() => form.removeListItem("questions", index)}
            color="red"
            autoContrast
          >
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
        <TextInput
          placeholder="Enter question content, eg. What is your name?"
          label="Question"
          {...form.getInputProps(`questions.${index}.question`)}
        />
        <Divider />
        <Stack>
          {question.answers.map((_, answerIndex) => (
            <Group key={answerIndex}>
              <TextInput
                variant="filled"
                placeholder={`Enter answer ${answerIndex + 1}`}
                className="grow"
                {...form.getInputProps(
                  `questions.${index}.answers.${answerIndex}.content`
                )}
              />
              <Checkbox
                checked={
                  form.values.questions[index].answers[answerIndex].isCorrect
                }
                label={"Correct"}
                color="green"
                {...form.getInputProps(
                  `questions.${index}.answers.${answerIndex}.isCorrect`
                )}
              />
              <ActionIcon
                onClick={() =>
                  form.removeListItem(`questions.${index}.answers`, answerIndex)
                }
                variant="light"
                color="red"
                size="sm"
              >
                <IconMinus size={14} />
              </ActionIcon>
            </Group>
          ))}
          <Button
            onClick={() =>
              form.insertListItem(`questions.${index}.answers`, {
                content: "",
                isCorrect: false,
              })
            }
            variant="light"
            color="orange"
            size="sm"
            leftSection={<IconPlaylistAdd size={14} />}
          >
            Add answer
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

const UpdateTestForm: React.FC = () => {
  const { info } = useContext(UserCredentialsContext);
  const loaderData = useLoaderData() as {
    test: SetDetails;
    categories: { categoryId: number; categoryName: string }[];
  };
  const fetcher = useFetcher();
  const { data, state } = fetcher;
  const isSubmitting = state === "submitting";
  const navigate = useNavigate();

  useEffect(() => {
    if (!data?.error) {
      toast.success(data?.msg);
    } else if (data?.error) {
      toast.error(data?.msg);
    }
  }, [data]);

  useEffect(() => {
    if (info?.userId !== loaderData?.test.userId) {
      navigate(`/test/set/${loaderData?.test.testId}`);
    }
  }, []);

  const processedCategories: string[] = [];
  loaderData?.categories.forEach((category) => {
    processedCategories.push(category.categoryName);
  });
  const form = useForm<TestForm>({
    initialValues: {
      title: "",
      categoryName: "",
      description: "",
      questions: [
        {
          testQuestionId: 0,
          question: "",
          answers: [{ testAnswerId: 0, content: "", isCorrect: false }],
        },
      ],
    },
    validate: {
      title: isNotEmpty("Title is required"),
      categoryName: isNotEmpty("Category is required"),
      questions: {
        question: isNotEmpty("Question is required"),
        answers: {
          content: isNotEmpty("Answer is required"),
        }
      },
    },
    transformValues: (values) => ({
      title: values.title.trim(),
      description: values.description.trim(),
      categoryName: values.categoryName.trim(),
      questions: values.questions.map((question) => ({
        ...question,
        answers: question.answers.map((answer) => ({
          ...answer,
          content: answer.content.trim(),
        })),
      })),
      testId: loaderData?.test?.testId as number,
      userId: info?.userId as number,
      categoryId: (() => {
        const category = loaderData?.categories.find(
          (category) => category.categoryName === values.categoryName
        );
        return category?.categoryId;
      })(),
    }),
  });

  type Transformed = TransformedValues<typeof form>;

  useEffect(() => {
    form.initialize({
      title: loaderData?.test?.testName as string,
      categoryName: loaderData?.test?.categoryName as string,
      description: (loaderData?.test?.description as string) || "",
      questions: loaderData?.test?.questions?.map((question) => ({
        testQuestionId: question.questionId,
        question: question.questionContent as string,
        answers: question.answers?.map((answer) => ({
          testAnswerId: answer.answerId,
          content: answer.content,
          isCorrect: answer.isCorrect,
        })),
      })) as Question[],
    });
  }, [loaderData]);

  const handleSubmit = (values: Transformed) => {
    const totalQuestions = values.questions.length;
    const checkInvalidQuestion = () => {
      let isValid = true;
      values.questions.forEach((question, index) => {
        const isAllNotCorrect = () =>
          question.answers.every((answer) => !answer.isCorrect);
        const isAllCorrect = () =>
          question.answers.every((answer) => answer.isCorrect);
        if (question.answers.length < 2) {
          form.setFieldError(`questions.${index}.question`, "Invalid question");
          isValid = false;
        } else if (isAllNotCorrect()) {
          form.setFieldError(
            `questions.${index}.question`,
            "Invalid question! At least one answer must be correct."
          );
          isValid = false;
        } else if (isAllCorrect()) {
          form.setFieldError(
            `questions.${index}.question`,
            "Invalid question! At least one answer must be incorrect."
          );
          isValid = false;
        }
      });
      return isValid;
    };

    const hasInvalidQuestion = checkInvalidQuestion();

    if (!hasInvalidQuestion) {
      toast.warning("Invalid question");
    } else if (totalQuestions < 1) {
      toast.warning("Please add at least one question");
    } else {
      fetcher.submit(
        {
          ...values,
          questions: JSON.stringify(values.questions),
        },
        {
          method: "put",
        }
      );
    }
  };

  return (
    <Container>
      <fetcher.Form onSubmit={form.onSubmit(handleSubmit)}>
        <Group className="justify-between">
          <Text className="font-bold text-3xl my-5">Edit study set</Text>
          <Button.Group>
            <Button
              type="submit"
              variant="filled"
              leftSection={<IconDeviceFloppy size={14} />}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Save
            </Button>
          </Button.Group>
        </Group>

        <Stack>
          <TextInput
            className="w-full border-b-2 border-transparent focus-within:border-blue-400"
            variant="white"
            label="Title"
            placeholder="Enter a title, like 'Computer Science - Chapter 8: The beyond of computers'"
            {...form.getInputProps("title")}
          />
          <TextInput
            className="w-full border-b-2 border-transparent focus-within:border-yellow-400"
            variant="white"
            label="Description"
            placeholder="Add a description (optional)"
            {...form.getInputProps("description")}
          />
          <Select
            label="Category"
            data={processedCategories}
            placeholder="Pick one"
            allowDeselect={false}
            searchable
            {...form.getInputProps("categoryName")}
          />
          <DragDropContext
            onDragEnd={({ destination, source }) => {
              destination?.index !== undefined &&
                form.reorderListItem("questions", {
                  from: source.index,
                  to: destination.index,
                });
            }}
          >
            <Droppable droppableId="questions">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {form.values.questions.map((question, index) => (
                    <Draggable
                      key={index}
                      draggableId={index.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <QuestionBox
                            index={index}
                            question={question}
                            form={form}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-full"
            leftSection={<IconPlus size={14} />}
            onClick={() =>
              form.insertListItem("questions", {
                question: "",
                answers: [{ content: "", isCorrect: false }],
              })
            }
          >
            Add question
          </Button>
          <Group className="justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Save
            </Button>
          </Group>
        </Stack>
      </fetcher.Form>
    </Container>
  );
};
export default UpdateTestForm;
