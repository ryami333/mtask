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
}: React.ComponentPropsWithRef<"button"> & {
  icon?: React.ComponentType<IconProps>;
  iconPlacement?: "before" | "after";
}) => {
  const iconChild = IconComponent && <IconComponent className={cx("icon")} />;
  const isIconOnly = iconChild && !children;
  return (
    <button
      className={cx("button", className)}
      data-icon-only={!!isIconOnly}
      {...props}
    >
      <span className={cx("inner")}>
        {iconPlacement === "before" && iconChild}
        {children}
        {iconPlacement === "after" && iconChild}
      </span>
    </button>
  );
};
