import sha256 from "crypto-js/sha256";
import { NextApiRequest, NextApiResponse } from "next/types";
import { v4 } from "uuid";
import { z } from "zod";
import { env } from "../../env/server.mjs";
import { createSessionCookie } from "../../server/auth";

import { prisma } from "../../server/db";
import { createToken,  decodeToken } from "../../utils/token";

const passwordRegEx = /[\w(!|@|#|$|&)+]{8,}/g;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "POST") {
    const body = req.body;
    const validatedBody = z.object({
      username: z.string().min(3),
      password: z.string().regex(passwordRegEx),
    }).safeParse(JSON.parse(body));
    if (validatedBody.success) {
      const user = await prisma.user.findUnique({
        where: { name: validatedBody.data.username },
        include: { decks: true },
      });
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const hash: string = sha256(
          `${validatedBody.data.password}${user.salt}`,
        ).toString();
        if (user.hash == hash) {
          const sessionUser: User = {
            id: user.id,
            name: user.name,
            numberOfDecks: user.decks.length,
          };
          const access_token = await createToken(
            sessionUser,
            env.NEXTAUTH_SECRET!,
          );
          if (access_token) {
            const authCookie = createSessionCookie(access_token);
            const session = decodeToken(access_token);
            const responseMessage = {
              id: v4(),
              state: "Success",
              message: "Successfylly signed in!",
              payload: session,
              accessToken: access_token
            };
            res.setHeader("Set-Cookie", authCookie)
            .status(200)
            .end(JSON.stringify(responseMessage))
            return;
          }
        }
      }
    }
    res.status(406).json({
      id: v4(),
      state: "Failure",
      message: "Either user doesn't exist or your credentials wrong"
    })
  }
};
