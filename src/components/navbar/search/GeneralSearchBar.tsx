import {
  Badge,
  CloseButton,
  Combobox,
  Group,
  Text,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUser, IconUserStar } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ClassroomResponseData {
  classId: number;
  className: string;
  teacherName: string;
  numberOfStudent: number;
  numberOfTestSet: number;
  slugCode: string;
}
interface TestResponseData {
  testId: number;
  testName: string;
  author: string;
  authorFirstName: string;
  authorLastName: string;
  numberOfQuestion: number;
  createdAt: string;
}
interface FolderResponseData {
  folderId: number;
  folderName: string;
  numberOfTestSet: number;
  authorName: string;
  createdAt: string;
}

interface ResponseData {
  classrooms: ClassroomResponseData[];
  testzes: TestResponseData[];
  folders: FolderResponseData[];
}

interface Form {
  keywords: string;
}

const fetchSearchResultData = async (keywords: string) => {
  try {
    const res = await axios
      .get(`http://localhost:8080/api/v1/search?keywords=${keywords}`)
      .catch(() => {
        throw new Error();
      });
    return res?.data;
  } catch (error) {}
};

const GeneralSearchBar = () => {
  const [resData, setResData] = useState<ResponseData>();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const form = useForm<Form>({
    initialValues: {
      keywords: "",
    },
  });

  const fetchData = async () => {
    const data = await fetchSearchResultData(form.values.keywords);
    const limitedData = {
      classrooms: data?.classrooms?.slice(0, 10) || [],
      testzes: data?.testzes?.slice(0, 10) || [],
      folders: data?.folders?.slice(0, 10) || [],
    };
    setResData(limitedData);
  };

  const handleInputChange = () => {
    if (form.values.keywords.length === 0) {
      combobox.closeDropdown();
    } else {
      fetchData();
      combobox.openDropdown();
      combobox.updateSelectedOptionIndex();
    }
  };

  const classroomsData = resData?.classrooms?.map((item) => (
    <Combobox.Option value={item.className} key={item.classId}>
      <Link to={`/class/${item.classId}/sets`}>
        <Group>
          <Text>{item.className}</Text>
          <Badge
            leftSection={<IconUserStar size={14} stroke={1.5} />}
            color="violet"
            variant="light"
          >{`Teacher: ${item.teacherName}`}</Badge>
        </Group>
      </Link>
    </Combobox.Option>
  ));

  const testzesData = resData?.testzes?.map((item) => (
    <Combobox.Option value={item.testName} key={item.testId}>
      <Link to={`/test/set/${item.testId}`}>
        <Group>
          <Text>{item.testName}</Text>
          <Badge
            leftSection={<IconUser size={14} stroke={1.5} />}
            color="orange"
            variant="light"
          >{`Author: ${item.author}`}</Badge>
        </Group>
      </Link>
    </Combobox.Option>
  ));

  const foldersData = resData?.folders?.map((item) => (
    <Combobox.Option value={item.folderName} key={item.folderId}>
      <Link to={`/folder/${item.folderId}`}>
        <Group>
          <Text>{item.folderName}</Text>
          <Badge
            leftSection={<IconUser size={14} stroke={1.5} />}
            color="blue"
            variant="light"
          >{`Author: ${item.authorName}`}</Badge>
        </Group>
      </Link>
    </Combobox.Option>
  ));

  return (
    <>
      <Combobox
        withinPortal={false}
        store={combobox}
        onOptionSubmit={(optionValue) => {
          form.setFieldValue("keywords", optionValue);
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <TextInput
            placeholder="Search for testzes, classes, etc."
            onBlur={() => combobox.closeDropdown()}
            rightSection={
              form?.values?.keywords !== "" && (
                <CloseButton
                  size="sm"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    form.reset();
                    combobox.closeDropdown();
                  }}
                  aria-label="Clear value"
                />
              )
            }
            onKeyDown={() => handleInputChange()}
            {...form.getInputProps("keywords")}
          />
        </Combobox.Target>
        <Combobox.Dropdown mah={400} className="overflow-y-auto">
          <Combobox.Group label="Classrooms">
            <Combobox.Options>
              {resData?.classrooms.length !== 0 ? (
                classroomsData
              ) : (
                <Combobox.Empty>Nothing found</Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Group>
          <Combobox.Group label="Testzes">
            <Combobox.Options>
              {resData?.testzes.length !== 0 ? (
                testzesData
              ) : (
                <Combobox.Empty>Nothing found</Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Group>
          <Combobox.Group label="Folders">
            <Combobox.Options>
              {resData?.folders.length !== 0 ? (
                foldersData
              ) : (
                <Combobox.Empty>Nothing found</Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Group>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
};

export default GeneralSearchBar;
