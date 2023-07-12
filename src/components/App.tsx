import React, { useState } from "react";
import { HomePage } from "./HomePage";
import { SettingsPage } from "./SettingsPage";

export const App = () => {
  const [currentPage, setCurrentPage] = useState<"HOME" | "SETTINGS">("HOME");

  return (
    <>
      {currentPage === "HOME" && (
        <HomePage onClickSettings={() => setCurrentPage("SETTINGS")} />
      )}
      {currentPage === "SETTINGS" && (
        <SettingsPage onClickBack={() => setCurrentPage("HOME")} />
      )}
    </>
  );
};
