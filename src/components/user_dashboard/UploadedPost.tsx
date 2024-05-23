import { Carousel } from "@mantine/carousel";
import { Card, Text, Badge, Group, Stack, Avatar } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./Carousel.module.css";
import { useNavigate } from "react-router-dom";
function UploadedPost() {
    interface Post {
        id: number;
        title: string;
        result: number;
        date: Date;
        username: string;
        test: boolean;
        subjectCode: string;
        // Add other properties as needed
    }

    const [uploadedPost, setUploadedPost] = useState<Post[]>([]);
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/v1/getUploadedPost/${username}`)
            .then((res) => {
                const sortedList =
                    res && res.data
                        ? res.data.sort(
                            (
                                a: { date: string | number | Date },
                                b: { date: string | number | Date }
                            ) => {
                                const timeA = new Date(a.date).getTime();
                                const timeB = new Date(b.date).getTime();
                                return timeB - timeA; // Sort in descending order for most completed views first
                            }
                        )
                        : [];
                setUploadedPost(sortedList);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                // Handle error gracefully, e.g., display an error message to the user
            });
    }, []);

    const handleClickUpdateTime = async (testId: any) => {
        await axios.put(
            `http://localhost:8080/api/v1/test/update-time-test/${testId}`
        );
        alert("Update successful!");
    };

    const handleClickIncreaseView = async (testId: any) => {
        await axios.put(
            `http://localhost:8080/api/v1/test/increase-view?test-id=${testId}`
        );
    };
    return (
        <>
            {uploadedPost.length === 0 ? (
                <Text c={"dimmed"}>No completed tests available :(</Text>
            ) : (
                <Carousel
                    slideSize={"33.333333%"}
                    height={"150px"}
                    align={"start"}
                    slideGap="lg"
                    controlsOffset="xs"
                    controlSize={30}
                    dragFree
                    classNames={classes}
                >
                    {uploadedPost?.map((test, index) => (
                        <Carousel.Slide key={index}>
                            <Card
                                shadow="sm"
                                radius="md"
                                padding={"lg"}
                                withBorder
                                component="a"
                                className="h-full"
                            >
                                <Stack
                                    onClick={() => {
                                        handleClickUpdateTime(test.id);
                                        handleClickIncreaseView(test.id);
                                        navigate(`/test/set/${test.id}`);
                                    }}
                                    className="cursor-pointer justify-between h-full"
                                >
                                    <Stack gap={2}>
                                        <Text fw={500}>{test.title}</Text>
                                        <Badge color="indigo">
                                            Unknown number of Questions
                                        </Badge>
                                    </Stack>
                                    <Group gap={"xs"}>
                                        <Avatar variant="filled" radius="xl" size="sm" />
                                        <Text size="sm">{test.username}</Text>
                                    </Group>
                                </Stack>
                            </Card>
                        </Carousel.Slide>
                    ))}
                </Carousel>
            )}
        </>
    );
}

export default UploadedPost;
