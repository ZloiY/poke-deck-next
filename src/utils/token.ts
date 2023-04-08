import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";

const payloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  numberOfDecks: z.number().min(0).max(20),
  iat: z.number(),
  exp: z.number(),
  refreshToken: z.string(),
});

export type Token = z.infer<typeof payloadSchema>;

export const generateSecret = (key: string): Uint8Array =>
  new TextEncoder().encode(key);

export const getToken = async (
  str: string,
  key: string,
): Promise<Token | null> => {
  try {
    const maybePayload = await jwtVerify(str, generateSecret(key));
    const payload = payloadSchema.safeParse(maybePayload.payload);
    if (payload.success) {
      return payload.data;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export const decodeToken = (token: string): Token | null => {
  if (token.length > 0) {
    const jwtTokenBody = token.split(".")[1];
    if (jwtTokenBody) {
      const body = JSON.parse(decodeURIComponent(atob(jwtTokenBody)));
      const payload = payloadSchema.safeParse(body);
      if (payload.success) {
        return payload.data;
      }
    }
  }
  return null;
};

export const isTokenExpired = (token: Token): boolean => token.exp < Date.now();

export const createToken = async (
  payload: User,
  key: string,
): Promise<string | null> => {
  try {
    const secret = generateSecret(key);
    const refreshToken = await new SignJWT({ token: "refresh" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(Date.now())
      .setExpirationTime(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .sign(secret);
    const token = await new SignJWT({ ...payload, refreshToken })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(Date.now())
      .setExpirationTime(Date.now() + 2 * 60 * 60 * 1000)
      .sign(secret);
    return token;
  } catch (e) {
    return null;
  }
};

