import React from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "default" | "secondary" | "danger" | "status";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        "ui-button",
        `ui-button-${variant}`,
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
