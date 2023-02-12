import { useCallback, type ReactEventHandler } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Welcome } from "../components/Welcome";
import { useRouter } from "next/router";

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

  const onSubmit = useCallback<ReactEventHandler>(
    (event) =>
      handleSubmit(async (form) => {
        try {
          await signIn("credentials", {
            ...form,
            redirect: false,
          });
          router.push('/home');
        } catch (err) {
          throw err;
        }
      })(event).catch((error) => {
        console.log(error);
      }),
    []
  );

  return (
    <div className="flex h-full items-center justify-center">
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
