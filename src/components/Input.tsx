import React from "react";
import classNames from "classnames/bind";
import styles from "./Input.module.css";

const cx = classNames.bind(styles);

export const Input = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: React.Ref<HTMLInputElement>;
}) => <input className={cx("input", className)} {...props} />;
