import "source-map-support/register";
import { app } from "electron";
import { createBrowserWindow } from "./helpers/browserWindow";
import "./helpers/appState";

/**
 * Performance improvement:
 * https://www.electronjs.org/docs/latest/tutorial/performance#8-call-menusetapplicationmenunull-when-you-do-not-need-a-default-menu
 */
// Menu.setApplicationMenu(null);

app
  .whenReady()
  .then(async () => {
    createBrowserWindow();
  })
  .catch(console.error);
