import {
  Button,
  Container,
  Divider,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { QuizData } from "../../../pages/study-mode/learn/LearnPage";
import { useContext, useEffect } from "react";
import { QuizInfoContext } from "../../../store/quiz-info-context";
import { IconChevronRight } from "@tabler/icons-react";

function LearnSummary({
  questionsData,
  globalQuestionIndex,
  handleNextRound,
}: {
  questionsData: QuizData["questions"];
  globalQuestionIndex: number;
  handleNextRound: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key) {
        handleNextRound();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  const { totalQuestion } = useContext(QuizInfoContext);

  const rows = questionsData
    ? questionsData.map((question, index) => (
        <Paper shadow="md" radius="lg" p="xl" withBorder key={index}>
          <Group>
            <div className="basis-2/3">
              <Text>{question.questionContent}</Text>
            </div>
            <Divider orientation="vertical" />
            <div className="basis-1/4">
              {question.answers.map((answer) => (
                <Text key={answer.content} fw={700}>
                  {answer.isCorrect && answer.content}
                </Text>
              ))}
            </div>
          </Group>
        </Paper>
      ))
    : null;

  return (
    <>
      <Container className="container my-10">
        <Group className="justify-between">
          <Title order={2}>Great job, you're making progress!</Title>
          <Button
            variant="light"
            radius={"lg"}
            rightSection={<IconChevronRight size={18} />}
            onClick={handleNextRound}
          >
            Press any key to continue
          </Button>
        </Group>
        <Stack gap={"xs"} className="mt-10">
          <Text c={"dimmed"}>
            {globalQuestionIndex + "/" + totalQuestion} question
          </Text>
          <Progress
            radius="xl"
            size="lg"
            value={(100 * globalQuestionIndex) / totalQuestion!}
          />
        </Stack>
        <Divider my="sm" className="mt-10" />
        <Text c={"dimmed"}>Learned in this round</Text>
        <Stack className="mt-10">{rows}</Stack>
      </Container>
    </>
  );
}

export default LearnSummary;
