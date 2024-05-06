export const atob = (base64: string) => {
  const buffer = Buffer.from(base64, "base64");
  return buffer.toString("binary");
};
