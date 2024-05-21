import { Container, Title, Text, Stack } from "@mantine/core";
import DocumentTitle from "../../document-title/DocumentTitle";

function Sent({ forgotEmail }: { forgotEmail: string }) {
  const encryptedEmail = `${forgotEmail.charAt(0)}***${forgotEmail.slice(
    forgotEmail.indexOf("@")
  )}`;
  DocumentTitle("QuizToast | Forgot Password");
  return (
    <>
      <Container size="xs">
        <Stack>
          <Title className="mb-5 text-3xl font-extrabold">
            Check your email!
          </Title>
          <Text className="font-thin">
            We&apos;ve sent an email to {encryptedEmail}
          </Text>
          <Text className="font-thin">
            Click the link in the email to reset your password. If you
            can&apos;t find the email,{" "}
            <span className="font-semibold">please check your spam folder.</span>
          </Text>
        </Stack>
      </Container>
    </>
  );
}

export default Sent;
