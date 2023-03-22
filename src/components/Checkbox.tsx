import { ComponentPropsWithoutRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface CheckBoxProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  id?: string;
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ label, id, className, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={twMerge(
            "w-4 h-4 active:scale-90 cursor-pointer",
            className,
          )}
          {...props}
        />
        <label htmlFor={id} className="ml-2 text-md font-medium">
          {label}
        </label>
      </div>
    );
  },
);
