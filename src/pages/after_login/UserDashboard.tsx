import { Container, Stack, Title } from "@mantine/core";
// import CompletedTest from "../../components/user_dashboard/CompletedTest";
// import UploadedTest from "../../components/user_dashboard/UploadedTest";
// import UploadedAuthor from "../../components/user_dashboard/PopularAuthor";
import DocumentTitle from "../../components/document-title/DocumentTitle";

function UserDashboard() {
  DocumentTitle("FU-4S | Dashboard");
  return (
    <>
      <Container className="container">
        {/*<Stack gap="md">*/}
        {/*  <Title order={2}>Completed Tests</Title>*/}
        {/*  <CompletedTest />*/}
        {/*  <Title order={2}>Uploaded Tests</Title>*/}
        {/*  <UploadedTest />*/}
        {/*  <Title order={2}>Uploaded Authors</Title>*/}
        {/*  <UploadedAuthor />*/}
        {/*</Stack>*/}
      </Container>
    </>
  );
}

export default UserDashboard;
