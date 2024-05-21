import axios from "axios";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Params, useLoaderData } from "react-router-dom";
import { SetDetails } from "../../quiz/set/SetDetails";
import { Carousel, Embla } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  ActionIcon,
  Badge,
  Container,
  Group,
  Paper,
  Progress,
  Text,
} from "@mantine/core";
import classes from "../../quiz/set/SetDetails.module.css";
import {
  IconArrowsShuffle,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { QuizInfoContext } from "../../../store/quiz-info-context";
import FlashcardSummary from "../../../components/study-mode/flashcard/FlashcardSummary";
import { StudyModeContext } from "../../../store/study-mode-context";

function FlashcardPage() {
  const { assignQuizInfo } = useContext(QuizInfoContext);
  const { settings } = useContext(StudyModeContext);
  const loaderData = useLoaderData() as SetDetails;
  const questionsData = loaderData?.questions;
  const [isQuestion, setIsQuestion] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [embla, setEmbla] = useState<Embla | null>(null);
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);

  if (!isAutoPlaying) {
    autoplay.current.stop();
  } else {
    autoplay.current.reset();
  }

  const handleScroll = useCallback(() => {
    if (!embla) return;
    const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [embla, setScrollProgress]);

  useEffect(() => {
    if (embla) {
      embla.on("scroll", handleScroll);
      handleScroll();
    }
  }, [embla]);

  useEffect(() => {
    assignQuizInfo({
      id: loaderData?.quizId,
      name: loaderData?.quizName,
      totalQuestion: loaderData?.numberOfQuestions,
    });
  }, [loaderData]);
  function handleFlashcardClick() {
    setIsQuestion(!isQuestion);
  }

  function handleRestart() {
    setCurrentIndex(0);
    setDone(false);
  }

  const flashcards = useMemo(() => {
    if (settings.flashcard.isSorted) {
      return questionsData
        ?.slice()
        .sort((a, b) => {
          const contentA = a.questionContent!.toUpperCase();
          const contentB = b.questionContent!.toUpperCase();
          return contentA.localeCompare(contentB);
        })
        .map((question, index) => (
          <Carousel.Slide key={index}>
            {isQuestion ? (
              <Paper
                shadow="md"
                radius="lg"
                p="xl"
                withBorder
                h={"100%"}
                className="flex flex-col items-center justify-center"
                onClick={() => handleFlashcardClick()}
              >
                <Text className="text-3xl text-justify" fw={600}>
                  {question.questionContent}
                </Text>
              </Paper>
            ) : (
              <Paper
                shadow="md"
                radius="lg"
                p="xl"
                withBorder
                h={"100%"}
                className="flex flex-col items-center justify-center"
                onClick={() => handleFlashcardClick()}
              >
                {question.answers.map((answer) => (
                  <Text className="text-3xl text-justify" fw={600}>
                    {answer.isCorrect && answer.content}
                  </Text>
                ))}
              </Paper>
            )}
          </Carousel.Slide>
        ));
    } else {
      return questionsData?.map((question, index) => (
        <Carousel.Slide key={index}>
          {isQuestion ? (
            <Paper
              shadow="md"
              radius="lg"
              p="xl"
              withBorder
              h={"100%"}
              className="flex flex-col items-center justify-center"
              onClick={() => handleFlashcardClick()}
            >
              <Text className="text-3xl text-justify" fw={600}>
                {question.questionContent}
              </Text>
            </Paper>
          ) : (
            <Paper
              shadow="md"
              radius="lg"
              p="xl"
              withBorder
              h={"100%"}
              className="flex flex-col items-center justify-center"
              onClick={() => handleFlashcardClick()}
            >
              {question.answers.map((answer) => (
                <Text className="text-3xl text-justify" fw={600}>
                  {answer.isCorrect && answer.content}
                </Text>
              ))}
            </Paper>
          )}
        </Carousel.Slide>
      ));
    }
  }, [settings?.flashcard?.isSorted, questionsData, isQuestion]);
  return (
    <>
      {done ? (
        <FlashcardSummary handleRestart={handleRestart} />
      ) : (
        <>
          <Progress value={scrollProgress} size="xs" />
          <Container>
            <Carousel
              align={"start"}
              height={500}
              className="mt-10 rounded-md"
              onSlideChange={(index) => {
                setCurrentIndex(index);
                setIsQuestion(true);
              }}
              getEmblaApi={setEmbla}
              classNames={classes}
              plugins={[autoplay.current]}
              onClick={() => {
                if (currentIndex === flashcards!.length - 1) {
                  setDone(true);
                }
              }}
            >
              {flashcards}
            </Carousel>
            <Group className="justify-between mt-5">
              <Badge size="lg">{`${currentIndex + 1}/${
                flashcards?.length
              }`}</Badge>
              <Group>
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  radius="xl"
                  aria-label="shuffle"
                >
                  <IconArrowsShuffle size={24} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  radius="xl"
                  aria-label="autoplay"
                  onClick={() => {
                    setIsAutoPlaying(!isAutoPlaying);
                  }}
                >
                  {isAutoPlaying ? (
                    <IconPlayerPause size={24} />
                  ) : (
                    <IconPlayerPlay size={24} />
                  )}
                </ActionIcon>
              </Group>
            </Group>
          </Container>
        </>
      )}
    </>
  );
}

async function loader({ params }: { params: Readonly<Params> }) {
  const { id } = params;
  try {
    const res = await axios
      .get(`http://localhost:8080/api/v1/quiz/get-quiz?id=${id}`)
      .catch(() => {
        throw new Error("Error while fetching data");
      });
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
  }
}
export { loader };
export default FlashcardPage;
