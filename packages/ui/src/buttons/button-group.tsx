import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  attached?: boolean;
}

export function ButtonGroup({
  orientation = "horizontal",
  attached = true,
  className,
  children,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={twMerge(
        clsx(
          "inline-flex",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          attached
            ? orientation === "horizontal"
              ? "[&>button]:rounded-none [&>button:first-child]:rounded-l-lg [&>button:last-child]:rounded-r-lg [&>button:not(:first-child)]:-ml-px"
              : "[&>button]:rounded-none [&>button:first-child]:rounded-t-lg [&>button:last-child]:rounded-b-lg [&>button:not(:first-child)]:-mt-px"
            : "gap-2",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
