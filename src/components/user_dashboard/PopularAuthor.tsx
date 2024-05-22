import { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "@mantine/carousel";
import { Card, Group, Stack, Avatar, Title, Text } from "@mantine/core";
import classes from "./Carousel.module.css";
import "@tabler/icons-react";

interface User {
  userName: string;
  role: string;
  numberOfTestSet: number;
  classes: number;
  avatar: string;
}

function UploadedAuthor() {
  const [uploadedAuthor, setuploadedAuthor] = useState<User[]>([]);
  console.log(uploadedAuthor);
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/admin/users-dashboard")
      .then((res) => {
        const sortedAuthors = res.data.sort(
          (a: { view: number }, b: { view: number }) => b.view - a.view
        );
        setuploadedAuthor(sortedAuthors);
      });
  }, []);

  return (
    <>
      {uploadedAuthor.length === 0 ? (
        <Text c={"dimmed"}>No uploaded authors available :(</Text>
      ) : (
        <Carousel
          slideSize={"33.333333%"}
          height={"200px"}
          align={"start"}
          slideGap="lg"
          controlsOffset="xs"
          controlSize={30}
          dragFree
          classNames={classes}
        >
          {uploadedAuthor.map((user, index) => (
            <Carousel.Slide key={index}>
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                component="a"
                className="h-full"
              >
                <Stack className="h-full justify-between cursor-pointer">
                  <Avatar
                    variant="filled"
                    radius="xl"
                    size="xl"
                    color="violet"
                    src={user.avatar}
                  />
                  <Stack gap={6}>
                    <Group gap={8}>
                      <Title order={3}>{user.userName}</Title>
                    </Group>
                  </Stack>
                </Stack>
              </Card>
            </Carousel.Slide>
          ))}
        </Carousel>
      )}
    </>
  );
}

export default UploadedAuthor;
