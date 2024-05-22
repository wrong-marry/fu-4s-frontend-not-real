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
  addTestToClassApi,
  removeTestFromClassApi,
  Questions,
  fetchQuestionsData,
} from "../../pages/class/ClassPage";

import { Link, useNavigate } from "react-router-dom";
import TestQuestionModal from "./TestQuestionModal";

function AddTestSetsModal({
  classId,
  addSetsModalOpened,
  setAddSetsModalOpened,
  studyUserCreatedSets,
  fetchStudySets,
  setLoading
  commonTestIds,
}) {
  async function addTestToClass(classId: number, testId: number) {
    setLoading(true);
    try {
      // Make API call to add test to class
      await addTestToClassApi(classId, testId);

      // After successful API call, refresh studySets data
      await fetchStudySets(classId);
    } catch (error) {
      console.error("Error adding test to class:", error);
    } finally {
      setLoading(false);
    }
  }

  async function removeTestFromClass(classId: number, testId: number) {
    setLoading(true);
    try {
      // Make API call to remove test from class
      await removeTestFromClassApi(classId, testId);

      // After successful API call, refresh studySets data
      await fetchStudySets(classId);
    } catch (error) {
      console.error("Error removing test from class:", error);
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
              Add test sets
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
        </div>

        <Modal.Body>
          <Stack p={"xl"}>
            <Button variant="subtle" size="sm" leftSection={<IconPlus />}>
              <Link to="/create-test">Create new sets</Link>
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
                <Stack key={set.testId}>
                  <Paper
                    shadow="lg"
                    radius="md"
                    withBorder
                    p="xl"
                    className="py-4"
                  >
                    <Group className="justify-between">
                      <Text className="font-bold text-lg">{set.testName}</Text>
                      {commonTestIds.includes(set.testId) ? (
                        // If the test ID exists, render the minus button
                        <Button
                          variant="default"
                          size="sm"
                          radius="md"
                          onClick={() => {
                            removeTestFromClass(classId, set.testId);
                            const updatedCommonTestIds = commonTestIds.filter(
                              (id) => id !== set.testId
                            );
                            setCommonTestIds(updatedCommonTestIds);
                          }}
                        >
                          <IconMinus size={12} />
                        </Button>
                      ) : (
                        // If the test ID does not exist, render the plus button
                        <Button
                          variant="default"
                          size="sm"
                          radius="md"
                          onClick={() => {
                            addTestToClass(classId, set.testId);
                            const updatedCommonTestIds = [
                              ...commonTestIds,
                              set.testId,
                            ];
                            setCommonTestIds(updatedCommonTestIds);
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

export default AddTestSetsModal;
