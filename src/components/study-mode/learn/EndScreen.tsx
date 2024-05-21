import {
  Badge,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Title,
  UnstyledButton,
  Text,
} from "@mantine/core";
import Lottie from "lottie-react";
import Congrats from "../../../assets/CongratulationsAnimation-1.json";
import {
  IconCircleCheck,
  IconRotateClockwise2,
  IconChevronRight,
} from "@tabler/icons-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QuizInfoContext } from "../../../store/quiz-info-context";
import trophy from "../../../assets/emoji/trophy.svg";

function EndScreen() {
  const { totalQuestion, id } = useContext(QuizInfoContext);
  console.log(id);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key) {
        navigate(`/quiz/set/${id}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, navigate]);

  return (
    <>
      <Lottie
        animationData={Congrats}
        loop={false}
        className="absolute -translate-x-2/4 top-0 left-2/4 -z-10"
      />
      <Container className="mt-10 h-screen">
        <Stack className="items-center">
          <img src={trophy} alt="party-popper" width={200} />
          <Title order={2} fw={700}>
            Congratulations! You have learned all the terms.
          </Title>
        </Stack>
        <Divider my="md" label="Summary" labelPosition="center" />
        <Group className="justify-between">
          <Title order={3} fw={700} className="ml-3">
            How's you are doing
          </Title>
          <Title order={3} fw={700} className="ml-3">
            Next step
          </Title>
        </Group>
        <Group className="justify-between mt-5">
          <Stack>
            <Group>
              <IconCircleCheck size={120} stroke={1} color="green" />
              <Stack>
                <Badge variant="light" color="green" size="lg">
                  Completed: {totalQuestion}
                </Badge>
                <Badge variant="light" color="red" size="lg">
                  Term left: 0
                </Badge>
              </Stack>
            </Group>
          </Stack>
          <Stack className="basis-1/3">
            <UnstyledButton className="hover:bg-[--mantine-primary-color-light-hover] rounded-lg p-2">
              <Group>
                <IconRotateClockwise2 size={70} />
                <Stack gap={0}>
                  <Title order={4}>Relearn this set</Title>
                  <Text size="sm">Learn this set again.</Text>
                </Stack>
              </Group>
            </UnstyledButton>
          </Stack>
        </Group>
        <Group className="mt-10 justify-end">
          <Button
            variant="light"
            radius={"lg"}
            rightSection={<IconChevronRight size={18} />}
            onClick={() => navigate(`/quiz/set/${id}`)}
          >
            Press any key to continue
          </Button>
        </Group>
      </Container>
    </>
  );
}

export default EndScreen;
