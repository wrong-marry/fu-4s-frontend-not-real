import { Container, Stack, Title } from "@mantine/core";
import RecentTest from "../../components/user_dashboard/RecentTest";
import UploadedTest from "../../components/user_dashboard/UploadedTest";
import UploadedAuthor from "../../components/user_dashboard/UploadedAuthor";
import DocumentTitle from "../../components/document-title/DocumentTitle";

function UserDashboard() {
  DocumentTitle("FU-4S | Dashboard");
  return (
    <>
      <Container className="container">
        <Stack gap="md">
          <Title order={2}>Recent</Title>
          <RecentTest />
          <Title order={2}>Uploaded Testzes</Title>
          <UploadedTest />
          <Title order={2}>Uploaded Authors</Title>
          <UploadedAuthor />
        </Stack>
      </Container>
    </>
  );
}

export default UserDashboard;
