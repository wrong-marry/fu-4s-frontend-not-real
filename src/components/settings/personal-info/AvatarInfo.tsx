import { Avatar, Group, Stack, Text } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useSubmit } from "react-router-dom";
import { UserCredentialsContext } from "../../../store/user-credentials-context";

async function getBase64(file: FileWithPath) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
  });
}

const AvatarInfo = () => {
  const { info } = useContext(UserCredentialsContext);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const submit = useSubmit();

  useEffect(() => {
    if (files.length > 0) {
      getBase64(files[0]).then((res) => {
        submit(
          {
            avatar: res as string,
            userId: info?.userId as number,
            actionType: "update-avatar",
          },
          { method: "put" }
        );
      });
    }
  }, [files]);
  return (
    <>
      <Group>
        <Avatar src={info?.avatar} size={"xl"}></Avatar>
        <Dropzone
          onDrop={setFiles}
          className="grow"
          maxSize={5 * 1024 ** 2}
          accept={["image/png", "image/jpeg"]}
        >
          <Group>
            <Dropzone.Accept>
              <IconUpload size={32} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={32} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={32} />
            </Dropzone.Idle>
            <Stack gap={0}>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                File should not exceed 5mb
              </Text>
            </Stack>
          </Group>
        </Dropzone>
      </Group>
    </>
  );
};

export default AvatarInfo;
