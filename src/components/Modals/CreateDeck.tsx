import { ReactEventHandler, useCallback } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Input } from "../Input";

export type CreateDeckParams = {
  name: string;
  private: boolean;
};

export const CreateDeck = ({
  create,
  closeModal,
}: {
  create?: (params: CreateDeckParams) => void;
  closeModal: () => void;
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: "",
      private: false,
    },
  });

  const onSubmit = useCallback<ReactEventHandler>((event) => handleSubmit(async (form) => {
    create?.(form);
  })(event).catch((error) => {
    console.log(error);
  }).finally(closeModal), [])

  return (
    <div className="gap-5 ">
      <form className="flex flex-col w-full gap-5" onSubmit={onSubmit}>
        <div className={twMerge("flex gap-5 justify-between items-end", errors.name?.message && "items-center")}>
          <Input
            label="Deck name:"
            containerStyles="max-w-[220px]"
            error={errors.name?.message}
            {...register("name", {
              required: "Field shouldn't be empty",
              minLength: {
                value: 2,
                message: "Name of the deck should include more than 2 symbols",
              },
              maxLength: {
                value: 20,
                message: "Shouldn't be longer than 20 symbols"
              }
            })}
          />
          <Button
            type="submit"
            disabled={!isValid}
            className="bg-green-500 whitespace-nowrap text-xl px-3 h-10"
          >
            Create Deck!
          </Button>
        </div>
        <Checkbox
          className="w-5 h-5"
          label="Make this deck private?"
          {...register("private")}
        />
      </form>
    </div>
  );
};
