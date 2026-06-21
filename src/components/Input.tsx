import React from "react";
import classNames from "classnames/bind";
import styles from "./Input.module.css";

const cx = classNames.bind(styles);

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cx("input", className)} {...props} />
));

Input.displayName = "Input";
