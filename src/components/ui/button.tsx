import React from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost" | "danger" | "status";
type ButtonSize = "default" | "sm" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        "ui-button",
        `ui-button-${variant}`,
        `ui-button-${size === "default" ? "md" : size}`,
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
