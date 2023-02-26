import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactEventHandler, useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

import { Welcome } from "../components/Welcome";
import { api } from "../utils/api";

type RegistrationForm = {
  username: string;
  password: string;
  repeatPassword: string;
};

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

  const signUpUser: SubmitHandler<RegistrationForm> = useCallback((data) => {
    createUser.mutateAsync(data)
    .then(() => {
      router.push('/login');
    }).catch((err) => {
      console.log('error', err);
    });
  }, []);

  const onSubmit = useCallback<ReactEventHandler>(
    (event) =>
      handleSubmit(signUpUser)(event).catch((error) => {
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
              error={errors?.repeatPassword?.message}
              {...register("repeatPassword", {
                required: "You should put password",
                validate: (value) =>
                  value === getValues("password") ||
                  "You should repeat your 'password'",
              })}
            />
          <Button type="submit">
            Register
          </Button>
            <span>
              Already have account?
              <Link href="/login" className="ml-1 text-blue-300 underline hover:text-yellow-400">
                Log in!
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
