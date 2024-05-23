import { Container, Stack, Title } from "@mantine/core";
import CompletedTest from "../../components/user_dashboard/CompletedTest";
import UploadedPost from "../../components/user_dashboard/UploadedPost";
import RecentPost from "../../components/user_dashboard/RecentPost";
import DocumentTitle from "../../components/document-title/DocumentTitle";

function UserDashboard() {
  DocumentTitle("FU-4S | Dashboard");
  return (
    <>
      <Container className="container">
        <Stack gap="md">
            <Title order={2}>Recent Posts</Title>
            <RecentPost />
            <Title order={2}>Completed Tests</Title>
            <CompletedTest />
            <Title order={2}>Uploaded Posts</Title>
            <UploadedPost />
        </Stack>
      </Container>
    </>
  );
}

export default UserDashboard;
