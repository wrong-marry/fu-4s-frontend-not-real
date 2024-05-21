import { Title, Button, Text } from "@mantine/core";
import homepageCover from "../../assets/homepage-cover.jpg";

export default function HeroContent() {
  return (
    <div
      className="w-full h-screen bg-cover "
      style={{ backgroundImage: `url(${homepageCover})` }}
    >
      {/* <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={0.2}
        zIndex={0}
      /> */}

      <div className="h-full flex justify-start items-center w-[80%] mx-auto">
        <div className="basis-1/2">
          <Title >QuizToast is Awesome!</Title>
          <Text className="text-left" size="xl" mt="xl">
            Build fully functional accessible web applications faster than ever
            – Mantine includes more than 120 customizable components and hooks
            to cover you in any situation
          </Text>

          <Button variant="gradient" size="xl" radius="xl" className="mt-5">
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
}
