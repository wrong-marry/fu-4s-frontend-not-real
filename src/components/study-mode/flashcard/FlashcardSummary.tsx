import Lottie from "lottie-react";
import Congrats from "../../../assets/CongratulationsAnimation-1.json";
import {
  Container,
  Divider,
  Group,
  Title,
  Text,
  Stack,
  Badge,
  UnstyledButton,
  Button,
} from "@mantine/core";
import partyPopper from "../../../assets/emoji/party-popper.svg";
import {
  IconBook,
  IconChevronRight,
  IconCircleCheck,
  IconRotateClockwise2,
} from "@tabler/icons-react";
import { useContext, useEffect } from "react";
import { TestInfoContext } from "../../../store/test-info-context";
import { useNavigate } from "react-router-dom";

function FlashcardSummary({ handleRestart }: { handleRestart: () => void }) {
  const { totalQuestion, id } = useContext(TestInfoContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key) {
        navigate(`/test/set/${id}`);
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
        <Group className="justify-between">
          <Title order={2} fw={700}>
            Yay! You’ve reviewed all the cards.
          </Title>
          <img
            src={partyPopper}
            alt="party-popper"
            width={100}
            className="-scale-x-100"
          />
        </Group>
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
                <IconBook size={70} />
                <Stack gap={0}>
                  <Title order={4}>Learn this set</Title>
                  <Text size="sm" maw={200}>
                    Answer questions about these {totalQuestion} terms to build
                    knowledge.
                  </Text>
                </Stack>
              </Group>
            </UnstyledButton>
            <UnstyledButton
              className="hover:bg-[--mantine-primary-color-light-hover] rounded-lg p-2"
              onClick={handleRestart}
            >
              <Group>
                <IconRotateClockwise2 size={70} />
                <Stack gap={0}>
                  <Title order={4}>Restart Flashcard</Title>
                  <Text size="sm">Study this set again.</Text>
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
            onClick={() => navigate(`/test/set/${id}`)}
          >
            Press any key to continue
          </Button>
        </Group>
      </Container>
    </>
  );
}

export default FlashcardSummary;
