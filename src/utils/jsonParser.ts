export function jsonParser(data: string) {
  try {
    const token = JSON.parse(data ?? "");
    return token;
  } catch (error: any) {
    console.log(error.message);
  }
}
