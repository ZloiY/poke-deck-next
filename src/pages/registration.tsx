import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactEventHandler, useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { NotificationsPopups } from "../components/NotificationPopup";
import { Welcome } from "../components/Welcome";
import { useMessageBus } from "../hooks";
import { setNewMessages } from "../hooks/useMessageBus";
import { api } from "../utils/api";
import { clientLogin } from "../utils/login";

type RegistrationForm = {
  username: string;
  password: string;
  repeatPassword: string;
};

export function getStaticProps(context: GetServerSidePropsContext) {
  setNewMessages([]);
  return {
    props: {},
  };
}

export default function Registration() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationForm>({
    defaultValues: {
      username: "",
      password: "",
      repeatPassword: "",
    },
  });
  const createUser = api.auth.signUp.useMutation();
  const router = useRouter();
  const { pushMessage } = useMessageBus();

  const signUpUser: SubmitHandler<RegistrationForm> = useCallback((data) => {
    createUser
      .mutateAsync(data)
      .then((message) => {
        pushMessage(message);
        return clientLogin({
          username: data.username,
          password: data.password,
        });
       })
      .then((validatedMessage) => {
        if (validatedMessage.success) {
          const { payload, ...message } = validatedMessage.data;
          pushMessage(message);
          if (message.state == "Success") {
            router.push("/home");
          }
        }
      })
      .catch(pushMessage);
  }, []);

  const onSubmit = useCallback<ReactEventHandler>(
    (event) =>
      handleSubmit(signUpUser)(event).catch((error) => {
        console.log(error);
      }),
    [],
  );

  return (
    <div className="flex h-full items-center justify-center font-fredoka relative">
      <Head>
        <title>PokeDeck registration</title>
        <meta
          property="og:registration"
          content="PokeDeck registration"
          key="title"
        />
      </Head>
      <NotificationsPopups />
      <div>
        <Welcome />
        <div className="flex items-center justify-center">
          <form
            className="flex flex-col gap-5 sm:rounded-lg text-xl bg-purple-900 p-5 
            sm:shadow-[0px_0px_20px_5px] sm:shadow-zinc-600/50 w-full max-w-2xl
            rounded-none shadow-none"
            onSubmit={onSubmit}
          >
            <Input
              id="username"
              label="Username:"
              labelStyles="text-2xl"
              inputStyles="text-2xl h-14"
              errorStyles="text-lg"
              error={errors?.username?.message}
              {...register("username", {
                required: "You should specify username",
                minLength: {
                  value: 3,
                  message: "Username should be longer than 3 symbols",
                },
                maxLength: {
                  value: 30,
                  message: "Username is too long...",
                },
              })}
            />
            <Input
              id="password"
              type="password"
              label="Password:"
              labelStyles="text-2xl"
              inputStyles="text-2xl h-14"
              errorStyles="text-lg"
              error={errors?.password?.message}
              {...register("password", {
                required: "You should specify password",
                minLength: {
                  value: 8,
                  message: "Password should be longer than 8 symbols",
                },
                pattern: {
                  value: /[\w(@|#|$|&)+]{8,}/,
                  message:
                    "Your password should contain at least one of this @, #, $, &",
                },
              })}
            />
            <Input
              id="repeatPassword"
              type="password"
              label="Repeat Password:"
              labelStyles="text-2xl"
              inputStyles="text-2xl h-14"
              errorStyles="text-lg"
              error={errors?.repeatPassword?.message}
              {...register("repeatPassword", {
                required: "You should put password",
                validate: (value) =>
                  value === getValues("password") ||
                  "You should repeat your 'password'",
              })}
            />
            <Button
              className="text-2xl h-12"
              isLoading={createUser.isLoading || createUser.isSuccess}
              disabled={createUser.isLoading || createUser.isSuccess}
              type="submit"
            >
              Register
            </Button>
            <span>
              Already have account?
              <Link
                href="/login"
                className="ml-1 text-blue-300 underline hover:text-yellow-400"
              >
                Log in!
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
