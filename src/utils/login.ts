import { z } from "zod";

export const clientLogin = async (creds: { username: string , password: string }) => {
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify(creds),
  });
  const maybeMessage = await response.json();
  return z.object({
    id: z.string().uuid(),
    state: z.enum(["Success", "Failure"]),
    message: z.string(),
    payload: z.object({
      id: z.string(),
      name: z.string(),
      numberOfDecks: z.number().min(0).max(20),
      iat: z.number().gt(0),
      exp: z.number().gt(0),
      refreshToken: z.string(),
    }).nullish(),
    accessToken: z.string().nullish(),
  }).safeParse(maybeMessage);
}
