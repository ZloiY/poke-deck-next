import { type InputHTMLAttributes, forwardRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

import EyeClose from "@icons/eye-close.svg";
import EyeOpen from "@icons/eye-open.svg";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
  containerStyles?: string;
  labelStyles?: string;
  inputStyles?: string;
  errorStyles?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      labelStyles,
      containerStyles,
      inputStyles,
      errorStyles,
      type,
      ...props
    },
    ref,
  ) => {
    const [showPassword, toggle] = useState(false);
    const [derivedType, setType] = useState(type);

    useEffect(() => {
      if (showPassword) {
        setType('text')
      } else {
        setType(type)
      }
    }, [showPassword, type]);

    return (
      <div className={twMerge("flex flex-col gap-1", containerStyles)}>
        {label && (
          <label
            htmlFor={props.name}
            className={twMerge("text-lg font-medium", labelStyles)}
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          <input
            ref={ref}
            type={derivedType}
            {...props}
            className={twMerge(
              `rounded-md border-2 border-white py-1 px-2 text-black outline-none text-lg w-full
          hover:shadow-zinc-300/50
          focus:shadow-lg focus:shadow-yellow-300/50 focus:border-yellow-500`,
              error && "border-red-500 bg-red-400 bg-opacity-50",
              inputStyles,
            )}
          />
          {type == "password" && (
            <div className="absolute h-full w-1/12 top-0 right-0 pr-2 text-black transition-opacity duration-200">
                <EyeOpen
                  className={twMerge("h-full w-full top-0 cursor-pointer ml-auto transition-opacity duration-200", showPassword && "opacity-100", !showPassword && "opacity-0")}
                  onClick={() => toggle((state) => !state)}
                />
                <EyeClose
                  className={twMerge("absolute py-2 pr-2 h-full w-full top-0 cursor-pointer ml-auto transition-opacity duration-200", !showPassword && "opacity-100", showPassword && "opacity-0")}
                  onClick={() => toggle((state) => !state)}
                />
            </div>
          )}
        </div>
        {error && (
          <span className={twMerge("text-sm text-red-500", errorStyles)}>
            {error}
          </span>
        )}
      </div>
    );
  },
);
