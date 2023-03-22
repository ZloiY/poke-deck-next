import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactEventHandler, useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { NotificationsPopups } from "../components/NotificationPopup";
import { Welcome } from "../components/Welcome";
import { useMessageBus } from "../hooks";
import { setAccessToken, setSession } from "../hooks/useAuth";
import { api } from "../utils/api";

type LoginForm = {
  username: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const router = useRouter();
  const login = api.auth.signIn.useMutation();
  const { pushMessage } = useMessageBus();
  const [isLoginIn, toggleLogin] = useState(false);

  const onSubmit = useCallback<ReactEventHandler>(
    (event) =>
      handleSubmit(async (form) => {
        toggleLogin(true);
        const response = await login.mutateAsync(form);
        const { payload, ...message } = response;
        pushMessage(message);
        if (payload) {
          const { access_token, ...session } = payload;
          setAccessToken(access_token);
          setSession(session);
          router.push("/home");
        }
      })(event).catch((error) => {
        console.log(error);
      }),
    [],
  );

  return (
    <div className="flex h-full items-center justify-center relative font-fredoka">
      <Head>
        <title>PokeDeck login</title>
        <meta property="og:title" content="PokeDeck login" key="title" />
      </Head>
      <NotificationsPopups />
      <div>
        <Welcome />
        <div className="flex items-center justify-center h-full">
          <form
            className="flex flex-col gap-5 sm:rounded-lg text-xl bg-purple-900 p-5 
            sm:shadow-[0px_0px_20px_5px] sm:shadow-zinc-600/50 w-full max-w-2xl
            shadow-none rounded-none"
            onSubmit={onSubmit}
          >
            <Input
              id="username"
              label="Username:"
              labelStyles="text-2xl"
              inputStyles="text-2xl h-14"
              errorStyles="text-lg"
              error={errors.username?.message}
              {...register("username", {
                required: "You should type you username",
              })}
            />
            <Input
              id="password"
              label="Password:"
              type="password"
              inputStyles="text-2xl h-14"
              labelStyles="text-2xl"
              errorStyles="text-lg"
              error={errors.password?.message}
              {...register("password", {
                required: "You should enter password",
              })}
            />
            <Button
              className="text-2xl py-2 h-12"
              isLoading={isLoginIn}
              type="submit"
            >
              Log In
            </Button>
            <span>
              Don&apos;t have account?
              <Link
                href="/registration"
                className="ml-1 text-blue-300 underline hover:text-yellow-400"
              >
                Create one!
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
