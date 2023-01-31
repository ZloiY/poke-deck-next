import { forwardRef, type InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
  containerStyles?: string;
  labelStyles?: string;
  inputStyles?: string;
  errorStyles?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    labelStyles,
    containerStyles,
    inputStyles,
    errorStyles,
    ...props
  }, ref) => (
    <div className={twMerge("flex flex-col gap-1", containerStyles)}>
      {label && (
        <label
          htmlFor={props.name}
          className={twMerge("text-lg font-medium", labelStyles)}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        {...props}
        className={twMerge(
          `rounded-md border-2 border-white py-1 px-2 text-black outline-none text-lg
          hover:shadow-zinc-300/50
          focus:shadow-lg focus:shadow-yellow-300/50 focus:border-yellow-500`,
          error && "border-red-500 bg-red-400 bg-opacity-50",
          inputStyles
        )}
      />
      {error && (
        <span className={twMerge("text-sm text-red-500", errorStyles)}>
          {error}
        </span>
      )}
    </div>
  )
);
