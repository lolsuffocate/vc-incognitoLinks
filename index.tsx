/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType, PluginNative } from "@utils/types";
import { Menu, React } from "@webpack/common";
import { findGroupChildrenByChildId } from "@api/ContextMenu";

const Native = VencordNative.pluginHelpers.IncognitoLinks as PluginNative<typeof import("./native")>;

const settings = definePluginSettings({
    preferredBrowser: {
        type: OptionType.SELECT,
        description: "Preferred browser to open links in",
        options: [
            { label: "Chrome", value: "chrome" },
            { label: "Firefox", value: "firefox" },
            { label: "Edge", value: "edge" },
            { label: "Custom", value: "custom" }
        ]
    },
    customCommand: {
        type: OptionType.STRING,
        description: "Custom command to open links with",
        placeholder: "e.g. start %url%",
    }
});

function addIncognitoButton(children, props) {
    const group = findGroupChildrenByChildId("open-native-link", children);
    if (!group) return;
    const item = group.find(child => child?.props?.id === "open-native-link");
    if (!item) return;
    const index = group.indexOf(item);

    const button = <Menu.MenuItem
        id="open-native-link-incognito"
        label={item.props.label + " (Incognito)"}
        action={_ => {
            Native.openIncognitoLink(props.itemHref ?? props.itemSrc ?? props.href ?? props.src, settings.store.preferredBrowser, settings.store.customCommand);
        }}
        key="open-native-link-incognito"/>;

    group.splice(index + 1, 0, button);
}

export default definePlugin({
    name: "IncognitoLinks",
    description: "Add an option to open links in an incognito window",
    authors: [{
        name: "Suffocate",
        id: 772601756776923187n
    }],

    settings,

    contextMenus: {
        "message": addIncognitoButton,
        "image-context": addIncognitoButton,
    }
});
