import { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactEventHandler, useCallback } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { NotificationsPopups } from "../components/NotificationPopup";
import { Welcome } from "../components/Welcome";
import { useMessageBus } from "../hooks";
import { getServerAuthSession } from "../server/auth";

type LoginForm = {
  username: string;
  password: string;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  if (session?.expires && new Date() < new Date(session.expires)) {
    return {
      redirect: {
        destination: '/home',
      }
    }
  }

  return {
    props: {}
  }
}

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
  const { pushMessage } = useMessageBus();

  const onSubmit = useCallback<ReactEventHandler>(
    (event) =>
      handleSubmit(async (form) => {
        try {
          const message = await signIn("credentials", {
            ...form,
            redirect: false,
          });
          if (message?.ok) {
            pushMessage({
              id: v4(),
              state: 'Success',
              message: 'You successfully logged in'
            })
            router.push("/home");
          } else {
            pushMessage({
              id: v4(),
              state: 'Failure',
              message: "You've entered wrong credentials"
            })
          }
        } catch (err) {
          throw err;
        }
      })(event).catch((error) => {
        console.log(error);
      }),
    [],
  );

  return (
    <div className="flex h-full items-center justify-center relative">
      <NotificationsPopups/>
      <div>
        <Welcome />
        <div className="flex items-center justify-center">
          <form
            className="flex flex-col gap-5 rounded-lg bg-purple-900 py-5 px-4 shadow-[0px_0px_20px_5px] shadow-zinc-600/50"
            onSubmit={onSubmit}
          >
            <Input
              id="username"
              label="Username:"
              error={errors.username?.message}
              {...register("username", {
                required: "You should type you username",
              })}
            />
            <Input
              id="password"
              label="Password:"
              type="password"
              error={errors.password?.message}
              {...register("password", {
                required: "You should enter password",
              })}
            />
            <Button type="submit">Log In</Button>
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
