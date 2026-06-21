import React from "react";
import classNames from "classnames/bind";
import styles from "./Button.module.css";
import { IconProps } from "@tabler/icons-react";

const cx = classNames.bind(styles);

export const Button = ({
  className,
  icon: IconComponent,
  iconPlacement = "before",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: React.ComponentType<IconProps>;
  iconPlacement?: "before" | "after";
}) => {
  const iconChild = IconComponent && (
    <IconComponent stroke={1.5} size={24} className={cx("icon")} />
  );
  return (
    <button className={cx("button", className)} {...props}>
      {iconPlacement === "before" && iconChild}
      {children}
      {iconPlacement === "after" && iconChild}
    </button>
  );
};
