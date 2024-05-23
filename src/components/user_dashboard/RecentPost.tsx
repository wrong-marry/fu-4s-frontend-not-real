import { Carousel } from "@mantine/carousel";
import { Card, Text, Badge, Group, Stack, Avatar } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import classes from "./Carousel.module.css";
import { useNavigate } from "react-router-dom";
function RecentPost() {
    interface Post {
        id: number;
        title: string;
        result: number;
        postTime: Date;
        username: string;
        test: boolean;
        subjectCode: string;
        // Add other properties as needed
    }

    const [recentPost, setRecentPost] = useState<Post[]>([]);
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/v1/getRecentPost`)
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
                setRecentPost(sortedList);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                // Handle error gracefully, e.g., display an error message to the user
            });
    }, []);

    return (
        <>
            {recentPost.length === 0 ? (
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
                    {recentPost?.map((test, index) => (
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
                                        navigate(`/post/${test.id}`);
                                    }}
                                    className="cursor-pointer justify-between h-full"
                                >
                                    <Stack gap={2}>
                                        <Text fw={500}>{test.title}</Text>
                                        <Text fw={200}>{test.postTime
                                            .toString().substring(0,10)
                                        }
                                        </Text>
                                        {
                                            (test.test)?
                                        <Badge color="indigo">
                                            Mock Test
                                        </Badge> :
                                        <Badge color="pink">
                                            Learning Material
                                        </Badge>
                                        }
                                    </Stack>
                                    <Group gap={"xs"}>
                                        <Avatar variant="filled" radius="xl" size="sm" />
                                        <Text size="sm">{test.username}</Text>
                                        <Stack gap={2}>
                                            <Badge color="blue">
                                                {test.subjectCode}
                                            </Badge>
                                        </Stack>
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

export default RecentPost;
