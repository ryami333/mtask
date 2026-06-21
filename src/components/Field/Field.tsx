import classNames from "classnames/bind";
import React from "react";
import styles from "./Field.module.css";

const cx = classNames.bind(styles);

export function Field({
  label,
  children,
  inputId,
  errorMessage,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  inputId: string;
  errorMessage: React.ReactNode;
}) {
  return (
    <div className={cx("container")}>
      <label className={cx("label")} htmlFor={inputId}>
        {label}
      </label>
      {children}
      <p className={cx("error-message")}>{errorMessage}</p>
    </div>
  );
}
