import { FormEventHandler, ReactEventHandler, useCallback } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { Input } from "../Input";
import { ModalContainer } from "./ModalContainer";

export const CreateDeck = ({
  create,
  isLoading,
}: {
  create?: (params: CreateDeckParams) => void;
  isLoading?: boolean;
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      private: false,
    },
  });

  const onSubmit =
    (closeModal: () => void): FormEventHandler<HTMLFormElement> =>
    (event) =>
      handleSubmit(async (form) => {
        create?.(form);
      })(event)
        .catch((error) => {
          console.log(error);
        })
        .finally(closeModal);

  return (
    <ModalContainer title="Create new deck">
      {(onClose) => (
        <div className="gap-5 p-4">
          <form
            className="flex flex-col w-full gap-5"
            onSubmit={onSubmit(onClose)}
          >
            <div
              className={twMerge(
                "flex gap-5 justify-between items-end",
                errors.name?.message && "items-center",
              )}
            >
              <Input
                label="Deck name:"
                containerStyles="max-w-[220px]"
                error={errors.name?.message}
                {...register("name", {
                  required: "Field shouldn't be empty",
                  minLength: {
                    value: 2,
                    message:
                      "Name of the deck should include more than 2 symbols",
                  },
                  maxLength: {
                    value: 15,
                    message: "Shouldn't be longer than 20 symbols",
                  },
                })}
              />
              <Button
                type="submit"
                disabled={!isValid}
                isLoading={isLoading}
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
      )}
    </ModalContainer>
  );
};
