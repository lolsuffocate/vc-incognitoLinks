/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { execFile } from "child_process";
import { IpcMainInvokeEvent } from "electron";

export async function openIncognitoLink(_:IpcMainInvokeEvent, url: string, preferredBrowser?:string, customCommand?:string) {
    if (!preferredBrowser) {
        preferredBrowser = "chrome";
    }

    const exec = (command: string, args: string[]) => execFile(command, args, error => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
        }
    });


    switch (preferredBrowser) {
        case "chrome":
            exec("chrome", ["--incognito", url]);
            return;
        case "firefox":
            exec("firefox", ["-private", url]);
            return;
        case "edge":
            exec("msedge", ["--inprivate", url]);
            return;
        case "custom":
            if (!customCommand) {
                _.sender.executeJavaScript("console.error('No custom command set for opening links')");
                return;
            }
            const command = customCommand.replace("%url%", url);
            exec(command, []);
            return;
        default:
            _.sender.executeJavaScript("console.error('IncognitoLinks: Unknown browser: " + preferredBrowser + "')");
    }
}
