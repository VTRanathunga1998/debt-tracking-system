// utils/decodeToken.ts
export const decodeToken = (token: string) => {
  try {
    const base64Payload = token.split(".")[1];
    const jsonPayload = atob(
      base64Payload.replace(/-/g, "+").replace(/_/g, "/")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};
