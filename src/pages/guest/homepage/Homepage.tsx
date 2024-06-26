import { Title } from "@mantine/core";
import Carousel from "../../../components/carousel/HomeCarousel";
import HeroContent from "../../../components/hero/HeroContent";
import DocumentTitle from "../../../components/document-title/DocumentTitle";

const Homepage = () => {
  DocumentTitle("FU-4S");
  return (
    <div className="overflow-x-hidden">
      <HeroContent />
      <div className="p-10 mx-auto">
        <Title className="text-center text-4xl">
          Why you should use FU-4S
        </Title>
      </div>
      <Carousel />
    </div>
  );
};

export default Homepage;
