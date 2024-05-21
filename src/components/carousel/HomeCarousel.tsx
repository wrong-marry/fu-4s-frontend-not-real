import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";

export default function HomeCarousel() {
  return (
    <Carousel
      slideSize="70%"
      height={"50vh"}
      slideGap="md"
      controlsOffset="xs"
      controlSize={30}
      loop
      dragFree
      withIndicators
    >
      <Carousel.Slide bg={"red"}>
        <Image
          src="https://i.pinimg.com/originals/b1/6a/c5/b16ac50ce6954a9f4ee2728e05fe85c4.gif"
          alt="Random unsplash image"
        />
      </Carousel.Slide>
      <Carousel.Slide bg={"blue"}>2</Carousel.Slide>
      <Carousel.Slide bg={"green"}>3</Carousel.Slide>
      <Carousel.Slide bg={"yellow"}>4</Carousel.Slide>
      <Carousel.Slide bg={"orange"}>5</Carousel.Slide>
    </Carousel>
  );
}
