import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";

import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  StudySet,
  ClassData,
  fetchStudySetsData,
  fetchClassData,
  fetchMembersData,
  Member,
  fetchUserCreatedStudySetsData,
  addQuizToClassApi,
  removeQuizFromClassApi,
  Questions,
  fetchQuestionsData,
} from "../../pages/class/ClassPage";

import { Link, useNavigate } from "react-router-dom";
import QuizQuestionModal from "./QuizQuestionModal";

function AddQuizSetsModal({
  classId,
  addSetsModalOpened,
  setAddSetsModalOpened,
  studyUserCreatedSets,
  fetchStudySets,
  setLoading
  commonQuizIds,
}) {
  async function addQuizToClass(classId: number, quizId: number) {
    setLoading(true);
    try {
      // Make API call to add quiz to class
      await addQuizToClassApi(classId, quizId);

      // After successful API call, refresh studySets data
      await fetchStudySets(classId);
    } catch (error) {
      console.error("Error adding quiz to class:", error);
    } finally {
      setLoading(false);
    }
  }

  async function removeQuizFromClass(classId: number, quizId: number) {
    setLoading(true);
    try {
      // Make API call to remove quiz from class
      await removeQuizFromClassApi(classId, quizId);

      // After successful API call, refresh studySets data
      await fetchStudySets(classId);
    } catch (error) {
      console.error("Error removing quiz from class:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Modal.Root
      opened={addSetsModalOpened}
      onClose={() => setAddSetsModalOpened(false)}
      centered
      size="lg"
    >
      <Modal.Overlay />
      <Modal.Content>
        <div className="p-4">
          <Modal.Header>
            <Modal.Title className="font-bold text-size text-2xl">
              Add quiz sets
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
        </div>

        <Modal.Body>
          <Stack p={"xl"}>
            <Button variant="subtle" size="sm" leftSection={<IconPlus />}>
              <Link to="/create-quiz">Create new sets</Link>
            </Button>
            <div>
              <Select
                className="w-1/4"
                checkIconPosition="right"
                data={["Your sets", "Folder sets", "Study sets"]}
                defaultValue={"Your sets"}
                onChange={(value) => handleFilterChange(value)}
                allowDeselect={false}
              />
            </div>
            {!isLoading ? (
              studyUserCreatedSets.map((set) => (
                <Stack key={set.quizId}>
                  <Paper
                    shadow="lg"
                    radius="md"
                    withBorder
                    p="xl"
                    className="py-4"
                  >
                    <Group className="justify-between">
                      <Text className="font-bold text-lg">{set.quizName}</Text>
                      {commonQuizIds.includes(set.quizId) ? (
                        // If the quiz ID exists, render the minus button
                        <Button
                          variant="default"
                          size="sm"
                          radius="md"
                          onClick={() => {
                            removeQuizFromClass(classId, set.quizId);
                            const updatedCommonQuizIds = commonQuizIds.filter(
                              (id) => id !== set.quizId
                            );
                            setCommonQuizIds(updatedCommonQuizIds);
                          }}
                        >
                          <IconMinus size={12} />
                        </Button>
                      ) : (
                        // If the quiz ID does not exist, render the plus button
                        <Button
                          variant="default"
                          size="sm"
                          radius="md"
                          onClick={() => {
                            addQuizToClass(classId, set.quizId);
                            const updatedCommonQuizIds = [
                              ...commonQuizIds,
                              set.quizId,
                            ];
                            setCommonQuizIds(updatedCommonQuizIds);
                          }}
                        >
                          <IconPlus size={12} />
                        </Button>
                      )}
                    </Group>
                  </Paper>
                </Stack>
              ))
            ) : (
              <LoadingOverlay visible={true} zIndex={1000} />
            )}
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default AddQuizSetsModal;
