export function isNumber(value: any) {
  return typeof value === "number";
}

export function isValidEmail(value: string) {
  const re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  return re.test(value);
}

export function checkForgotEmailToken(token: string) {
  if (
    !token ||
    !token.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    )
  ) {
    return false;
  }
  return true;
}
